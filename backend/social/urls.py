from django.urls import path
from .views import ToggleLikeView, ToggleSaveView, LikedMissionsListView, SavedMissionsListView

urlpatterns = [
    path('mission/<int:mission_id>/like/', ToggleLikeView.as_view(), name='toggle-like'),
    path('mission/<int:mission_id>/save/', ToggleSaveView.as_view(), name='toggle-save'),
    
    path('liked/', LikedMissionsListView.as_view(), name='liked-missions'),
    path('saved/', SavedMissionsListView.as_view(), name='saved-missions'),
]