from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'user_avatar', 'text', 'created_at']

    def get_user_avatar(self, obj):
        try:
            # Primero comprobamos si tiene perfil y avatar
            if hasattr(obj.user, 'profile') and obj.user.profile.avatar:
                avatar = obj.user.profile.avatar
                
                request = self.context.get('request')
                if request is not None:
                    return request.build_absolute_uri(avatar.url)
                
                return avatar.url
        except Exception:
            pass
        return None