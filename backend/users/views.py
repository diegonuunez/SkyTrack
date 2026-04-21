from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import UserSerializer

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