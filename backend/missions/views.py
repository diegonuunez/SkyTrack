from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Mission
from .serializers import MissionSerializer
from .permissions import IsOwner
from services.telemetry_service import TelemetryService
from utils.csv_processor import CSVProcessor
from utils.db_connector import get_telemetry_collection 


class TelemetryListMixin:
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        missions_data = response.data

        if isinstance(missions_data, dict) and 'results' in missions_data:
            missions_list = missions_data['results']
        else:
            missions_list = missions_data

        mission_ids = [m['id'] for m in missions_list]

        if not mission_ids:
            return response

        points_map = {}
        try:
            collection = get_telemetry_collection()
            all_telemetry = list(collection.find(
                {"mission_id": {"$in": mission_ids}},
                {"_id": 0, "mission_id": 1, "latitude": 1, "longitude": 1}
            ))
            for p in all_telemetry:
                m_id = p.get('mission_id')
                if m_id not in points_map:
                    points_map[m_id] = []
                points_map[m_id].append({
                    "latitude": p.get('latitude'),
                    "longitude": p.get('longitude')
                })
        except Exception:
            pass

        for mission in missions_list:
            mission['points'] = points_map.get(mission['id'], [])

        return response

class TelemetryRetrieveMixin:
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        mission_data = response.data

        try:
            collection = get_telemetry_collection()
            telemetry = list(collection.find(
                {"mission_id": mission_data['id']},
                {"_id": 0, "latitude": 1, "longitude": 1, "alt_m": 1, "vel_ms": 1, "timestamp": 1, "battery": 1}
            ).sort("timestamp", 1))
            mission_data['points'] = telemetry
        except Exception:
            mission_data['points'] = []

        return response

class MissionFeed(TelemetryListMixin, generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Mission.objects.all().order_by('-id')
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

class MissionList(TelemetryListMixin, generics.ListCreateAPIView):
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]
    queryset = Mission.objects.all().order_by('-id')


class MissionDetail(TelemetryRetrieveMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Mission.objects.filter(user=self.request.user)

class MissionDetailView(TelemetryRetrieveMixin, generics.RetrieveAPIView):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
    permission_classes = [permissions.AllowAny]


class MissionUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No se subió ningún archivo."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            telemetry_data = CSVProcessor.process_telemetry_file(file)
        except Exception as e:
            return Response({"error": f"Error procesando el CSV: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not telemetry_data:
            return Response({"error": "El archivo CSV está vacío o no tiene el formato correcto."}, status=status.HTTP_400_BAD_REQUEST)

        max_alt = max([p.get('alt_m', 0) for p in telemetry_data], default=0)
        max_vel = max([p.get('vel_ms', 0) for p in telemetry_data], default=0)
        
        try:
            with transaction.atomic():
                mission = Mission.objects.create(
                    user=request.user,
                    name=request.data.get('name', 'Misión sin nombre'), 
                    date=request.data.get('date'), 
                    description=request.data.get('description', ''),
                    drone_model=request.data.get('drone_model', 'Unknown'),
                    visibility=request.data.get('visibility', 'public'), 
                    max_alt_m=max_alt,
                    max_vel_ms=max_vel,
                )
                
                TelemetryService.save_mission_telemetry(mission.id, telemetry_data)
                
            return Response({
                "message": "Misión publicada con éxito", 
                "id": mission.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": f"Error interno guardando la misión: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

