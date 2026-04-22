from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserMeView, ProfileUpdateView
urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('me/', UserMeView.as_view(), name='user-profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
]