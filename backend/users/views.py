from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, permissions

from django.contrib.auth import get_user_model 
User = get_user_model()

from .models import Profile
from .serializer import UserSerializer, ProfileSerializer, UserProfileSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from missions.models import Mission
from missions.serializers import MissionSerializer
from missions.views import TelemetryListMixin 


class UserMeView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        user_serializer = UserSerializer(request.user, context={'request': request})
        return Response(user_serializer.data)


class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'username'


class UserMissionsListView(TelemetryListMixin, generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        return Mission.objects.filter(user__username=username).order_by('-id')


class UserSearchView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        search = self.request.query_params.get('search', '').strip()
        if not search:
            return User.objects.none()
        return User.objects.filter(username__icontains=search).order_by('username')[:10]


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
        