from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar','bio', 'location', 'favorite_drone', 'experience_level']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer() 

    class Meta:
        model = User
        fields = ['username', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.save()

        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()
        
        return instance
    
class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', read_only=True)
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    experience_level = serializers.CharField(source='profile.experience_level', read_only=True)
    
    stats = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'bio', 'avatar', 'experience_level', 'stats', 'date_joined']

    def get_stats(self, obj):
        from django.db.models import Count
        
        try:
            total_missions = obj.missions.count()
            
            total_likes = obj.missions.aggregate(total=Count('likes'))['total'] or 0
            
            return {
                'missions': total_missions,
                'likes': total_likes
            }
        except Exception as e:
            return {
                'missions': 0,
                'likes': 0
            }