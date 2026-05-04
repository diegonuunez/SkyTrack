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
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        mission = get_object_or_404(Mission, pk=pk)
        user = request.user

        if user in mission.likes.all():
            mission.likes.remove(user)
            is_liked = False
        else:
            mission.likes.add(user)
            is_liked = True

        return Response({
            'is_liked': is_liked,
            'likes_count': mission.likes.count()
        }, status=status.HTTP_200_OK)
           

class SavedMissionsView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Mission.objects.filter(saved_by=self.request.user).order_by('-id')

class LikedMissionsView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Mission.objects.filter(likes=self.request.user).order_by('-id')
    
class ToggleSaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        mission = get_object_or_404(Mission, pk=pk)
        user = request.user

        if user in mission.saved_by.all():
            mission.saved_by.remove(user)
            is_saved = False
        else:
            mission.saved_by.add(user)
            is_saved = True

        return Response({
            'is_saved': is_saved,
            'saves_count': mission.saved_by.count()
        }, status=status.HTTP_200_OK)

class MissionDetailView(generics.RetrieveAPIView):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
    permission_classes = [permissions.AllowAny]
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    mission = Mission.objects.get(pk=pk)
    if request.user in mission.likes.all():
        mission.likes.remove(request.user)
    else:
        mission.likes.add(request.user)
    return Response({'status': 'ok'})