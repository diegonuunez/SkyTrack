# backend/missions/urls.py
from django.urls import path
from .views import MissionList, MissionDetail, ToggleLikeMissionView, ToggleSaveMissionView, MissionFeed

urlpatterns = [
    path('feed/', MissionFeed.as_view(), name='mission-feed'), 
    path('', MissionList.as_view(), name='mission-list'),
    path('<int:pk>/', MissionDetail.as_view(), name='mission-detail'),
    path('<int:pk>/like/', ToggleLikeMissionView.as_view(), name='mission-like'),
    path('<int:pk>/save/', ToggleSaveMissionView.as_view(), name='mission-save'),
]