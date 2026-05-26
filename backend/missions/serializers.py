from rest_framework import serializers
from .models import Mission

class MissionSerializer(serializers.ModelSerializer):
    
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    saves_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_following_author = serializers.SerializerMethodField() 
    
    user_name = serializers.ReadOnlyField(source='user.username')
    user_experience = serializers.SerializerMethodField() 

    class Meta:
        model = Mission
        fields = [
            'id', 'user_name', 'user_experience', 'user', 'name',
            'date', 'description', 'drone_model', 'visibility', 'status',
            'max_alt_m', 'max_vel_ms',
            'likes_count', 'is_liked', 'saves_count', 'is_saved',
            'comments_count', 'is_following_author'
        ]
        read_only_fields = ['user', 'date', 'max_alt_m', 'max_vel_ms']

    def get_is_following_author(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated or request.user == obj.user:
            return False
        try:
            from social.models import Connection
            return Connection.objects.filter(follower=request.user, following=obj.user).exists()
        except (ImportError, AttributeError):
            return False

    def get_comments_count(self, obj):
        try:
            return obj.comments.count()
        except AttributeError:
            return 0

    def get_likes_count(self, obj):
        try:
            return obj.likes.count() 
        except AttributeError:
            return 0
    
    def get_is_liked(self, obj):
        try:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                return obj.likes.filter(user=request.user).exists()
        except AttributeError:
            pass
        return False
    
    def get_saves_count(self, obj):
        try:
            return obj.saved_by.count()
        except AttributeError:
            return 0

    def get_is_saved(self, obj):
        try:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                return obj.saved_by.filter(user=request.user).exists()
        except AttributeError:
            pass
        return False

    def get_user_experience(self, obj):
        if hasattr(obj.user, 'profile'):
            return obj.user.profile.experience_level
        return "Piloto"