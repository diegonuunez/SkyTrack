from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User 
from .models import Connection

# Modelos y Serializadores de la propi app
from .models import Comment, Like, Save, Connection  # <--- Añadido Connection
from .serializers import CommentSerializer

# De la app missions
from missions.models import Mission
from missions.serializers import MissionSerializer
from missions.views import TelemetryListMixin

# ==========================================
# VISTAS DE BOTONES (TOGGLE: Like, Save, Follow)
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


class ToggleFollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        # Buscamos al usuario por su username (el que viene en la URL)
        user_to_follow = get_object_or_404(User, username=username)
        
        if request.user == user_to_follow:
            return Response({"error": "No puedes seguirte a ti mismo"}, status=status.HTTP_400_BAD_REQUEST)

        connection, created = Connection.objects.get_or_create(
            follower=request.user, 
            following=user_to_follow
        )

        if not created:
            connection.delete()
            is_following = False
        else:
            is_following = True

        return Response({
            "is_following": is_following,
            "followers_count": user_to_follow.followers.count(),
            "following_count": user_to_follow.following.count()
        }, status=status.HTTP_200_OK)

# ==========================================
# VISTAS DE COMENTARIOS
# ==========================================

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(mission_id=self.kwargs['mission_id'])

    def perform_create(self, serializer):
        mission = get_object_or_404(Mission, id=self.kwargs['mission_id'])
        serializer.save(user=self.request.user, mission=mission)

# ==========================================
# VISTAS DE LISTADOS (ME GUSTA / GUARDADOS)
# ==========================================
    
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
    

class UserMissionsListView(TelemetryListMixin, generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        username = self.kwargs['username']
        # Filtramos las misiones donde el autor sea el usuario con ese username
        return Mission.objects.filter(user__username=username).order_by('-date')