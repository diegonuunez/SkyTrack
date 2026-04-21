from rest_framework import serializers
from .models import Mission, TelemetryPoint
from users.models import Profile

class TelemetryPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelemetryPoint
        fields = ['timestamp', 'latitude', 'longitude', 'altitude', 'speed']

class MissionSerializer(serializers.ModelSerializer):
    points = TelemetryPointSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    saves_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    user_name = serializers.ReadOnlyField(source='user.username')
    user_experience = serializers.ReadOnlyField(source='user.profile.experience_level')    
    class Meta:
        model = Mission
        fields = ['id','user_name','user_experience','user', 'name', 'date', 'description', 'drone_model','likes_count','is_liked','saves_count','is_saved','points']

    def get_likes_count(self, obj):
            return obj.likes.count() 
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    def get_saves_count(self, obj):
            return obj.saves.count()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saves.filter(id=request.user.id).exists()
        return False

    def validate(self, data):
        print(f" {data} ")
        return data

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        print(f" {ret} ")
        return ret