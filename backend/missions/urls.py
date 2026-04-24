# backend/missions/urls.py
from django.urls import path
from .views import MissionList, MissionDetail, ToggleLikeMissionView, ToggleSaveMissionView, MissionFeed, SavedMissionsView, LikedMissionsView

urlpatterns = [
    path('feed/', MissionFeed.as_view(), name='mission-feed'), 
    path('', MissionList.as_view(), name='mission-list'),
    path('<int:pk>/', MissionDetail.as_view(), name='mission-detail'),
    path('saved/', SavedMissionsView.as_view(), name='mission-save'),
    path('liked/', LikedMissionsView.as_view(), name='mission-liked')
        
]