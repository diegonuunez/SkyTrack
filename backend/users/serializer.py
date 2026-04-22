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