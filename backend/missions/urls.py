# backend/missions/urls.py
from django.urls import path
from .views import MissionList, MissionDetailView, MissionFeed , MissionUploadView

urlpatterns = [
    path('feed/', MissionFeed.as_view(), name='mission-feed'), 
    path('', MissionList.as_view(), name='mission-list'),
    path('<int:pk>/', MissionDetailView.as_view(), name='mission-detail'),
    path('upload/', MissionUploadView.as_view(), name='mission-upload')
]