from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    mission_name = serializers.ReadOnlyField(source='mission.name')

    class Meta:
        model = Notification
        fields = ['id', 'sender_name', 'notification_type', 'mission', 'mission_name', 'is_read', 'created_at']