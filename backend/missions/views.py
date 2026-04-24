from rest_framework import generics, permissions
from .models import Mission
from .serializers import MissionSerializer
from .permissions import IsOwner
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class MissionFeed(generics.ListAPIView):
    queryset = Mission.objects.all().order_by('-id')
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]
    
class MissionList(generics.ListCreateAPIView):
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]
    queryset = Mission.objects.all().order_by('-id')

class MissionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Mission.objects.filter(user=self.request.user)
    
class ToggleLikeMissionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        mission = get_object_or_404(Mission, pk=pk)

        if request.user in mission.likes.all():
            mission.likes.remove(request.user)
            return Response({'message': 'Like quitado'}, status=status.HTTP_200_OK)
        else:
            mission.likes.add(request.user)
            return Response({'message': 'Like añadido'}, status=status.HTTP_200_OK)
        
class ToggleSaveMissionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        mission = get_object_or_404(Mission, pk=pk)

        if request.user in mission.saves.all():
            mission.saved_by.remove(request.user)
            return Response({'message': 'Misión eliminada de tus guardados'}, status=status.HTTP_200_OK)
        else:
            mission.saved_by.add(request.user)
            return Response({'message': 'Misión guardada con éxito'}, status=status.HTTP_200_OK)       

class SavedMissionsView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios logueados

    def get_queryset(self):
        # Filtramos las misiones donde el usuario actual esté en la lista de 'saved_by'
        return Mission.objects.filter(saved_by=self.request.user).order_by('-id')

# Vista para misiones ME GUSTA
class LikedMissionsView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtramos las misiones donde el usuario actual esté en la lista de 'likes'
        return Mission.objects.filter(likes=self.request.user).order_by('-id')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    mission = Mission.objects.get(pk=pk)
    # Lógica: si ya existe el like, bórralo, si no, créalo
    if request.user in mission.likes.all():
        mission.likes.remove(request.user)
    else:
        mission.likes.add(request.user)
    return Response({'status': 'ok'})