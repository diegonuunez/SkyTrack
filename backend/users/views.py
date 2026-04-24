from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import UserSerializer,ProfileSerializer
from rest_framework import generics, permissions
from .models import Profile

from .serializer import UserSerializer
class UserMeView(APIView):
    permission_classes = [IsAuthenticated] # Solo si hay token válido

    def get(self, request):
        serializer = UserSerializer(request.user)
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