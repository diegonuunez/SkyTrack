from rest_framework import generics
from .models import Mission
from .serializers import MissionSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny 

class MissionFeed(generics.ListAPIView):
    queryset = Mission.objects.all().order_by('-id')
    serializer_class = MissionSerializer
    permission_classes = [AllowAny]
class MissionList(generics.ListCreateAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Mission.objects.filter(user=self.request.user)

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
            mission.saves.remove(request.user)
            return Response({'message': 'Misión eliminada de tus guardados'}, status=status.HTTP_200_OK)
        else:
            mission.saves.add(request.user)
            return Response({'message': 'Misión guardada con éxito'}, status=status.HTTP_200_OK)       