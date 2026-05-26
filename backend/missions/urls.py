from django.urls import path
from .views import MissionList, MissionDetailView, MissionFeed, MissionUploadView, MissionDetail

urlpatterns = [
    path('feed/', MissionFeed.as_view(), name='mission-feed'),
    path('', MissionList.as_view(), name='mission-list'),
    path('<int:pk>/', MissionDetailView.as_view(), name='mission-detail'),
    path('my/<int:pk>/', MissionDetail.as_view(), name='mission-my-detail'),
    path('upload/', MissionUploadView.as_view(), name='mission-upload'),
]