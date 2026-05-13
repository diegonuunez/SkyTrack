from rest_framework import serializers  # <--- ESTA ES LA QUE FALTA
from .models import Mission

class MissionSerializer(serializers.ModelSerializer):
    
    # Campos calculados dinámicamente
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    saves_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField() # <--- NUEVO
    
    # Datos de usuario seguros
    user_name = serializers.ReadOnlyField(source='user.username')
    user_experience = serializers.SerializerMethodField() 

    class Meta:
        model = Mission
        fields = [
            'id', 'user_name', 'user_experience', 'user', 'name', 
            'date', 'description', 'drone_model', 
            'likes_count', 'is_liked', 'saves_count', 'is_saved',
            'comments_count' # <--- NUEVO
        ]

    # ==========================================
    # LÓGICA SOCIAL (Acoplamiento Débil)
    # ==========================================
    
    def get_comments_count(self, obj):
        try:
            # 'comments' será el related_name que definiremos en el modelo Comment
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

    # ==========================================
    # LÓGICA DE USUARIO SEGURA
    # ==========================================

    def get_user_experience(self, obj):
        if hasattr(obj.user, 'profile'):
            return obj.user.profile.experience_level
        return "Piloto"