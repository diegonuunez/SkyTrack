from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics  # <-- Añadido 'generics'
from django.shortcuts import get_object_or_404

from missions.models import Mission
from missions.serializers import MissionSerializer  # <-- Importamos el serializador
from missions.views import TelemetryListMixin       # <-- Importamos tu mixin estrella

from .models import Like, Save

# ==========================================
# VISTAS DE BOTONES (TOGGLE)
# ==========================================

class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, mission_id):
        mission = get_object_or_404(Mission, id=mission_id)
        like, created = Like.objects.get_or_create(user=request.user, mission=mission)

        if not created:
            like.delete()
            is_liked = False
        else:
            is_liked = True

        return Response({
            "is_liked": is_liked,
            "likes_count": mission.likes.count()
        }, status=status.HTTP_200_OK)


class ToggleSaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, mission_id):
        mission = get_object_or_404(Mission, id=mission_id)
        
        save_obj, created = Save.objects.get_or_create(user=request.user, mission=mission)

        if not created:
            save_obj.delete() 
            is_saved = False
        else:
            is_saved = True

        return Response({
            "is_saved": is_saved,
            "saves_count": mission.saved_by.count()
        }, status=status.HTTP_200_OK)

# ==========================================
# VISTAS DE LISTADOS PARA EL PERFIL
# ==========================================
    
# social/views.py

class LikedMissionsListView(TelemetryListMixin, generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Mission.objects.filter(likes__user=self.request.user).order_by('-likes__created_at')


class SavedMissionsListView(TelemetryListMixin, generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Mission.objects.filter(saved_by__user=self.request.user).order_by('-saved_by__created_at')