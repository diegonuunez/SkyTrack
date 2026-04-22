from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import UserSerializer,ProfileSerializer
from rest_framework import generics, permissions

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
        return self.request.user.profile