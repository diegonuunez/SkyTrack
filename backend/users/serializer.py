from io import BytesIO
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.files.uploadedfile import InMemoryUploadedFile
from .models import Profile
from django.db.models import Count
from PIL import Image

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar','bio', 'location', 'favorite_drone', 'experience_level']

    def validate_avatar(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("El avatar no puede superar los 2 MB.")
        try:
            img = Image.open(value)
            if img.format not in ('JPEG', 'PNG', 'WEBP', 'GIF'):
                raise serializers.ValidationError("Solo se permiten imágenes JPEG, PNG, WEBP o GIF.")
        except serializers.ValidationError:
            raise
        except Exception:
            raise serializers.ValidationError("Archivo de imagen no válido.")

        img.thumbnail((400, 400), Image.LANCZOS)

        save_format = 'GIF' if img.format == 'GIF' else 'JPEG'
        if save_format == 'JPEG' and img.mode != 'RGB':
            img = img.convert('RGB')

        buf = BytesIO()
        img.save(buf, format=save_format, quality=85, optimize=True)
        buf.seek(0)

        ext          = 'gif' if save_format == 'GIF' else 'jpg'
        content_type = 'image/gif' if save_format == 'GIF' else 'image/jpeg'
        stem         = value.name.rsplit('.', 1)[0]

        return InMemoryUploadedFile(
            buf, 'ImageField', f"{stem}.{ext}",
            content_type, buf.getbuffer().nbytes, None,
        )

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer() 

    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff', 'profile']

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
    
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'bio', 'avatar', 'experience_level', 
            'stats', 'date_joined', 'followers_count', 
            'following_count', 'is_following'
        ]

    def get_stats(self, obj):
        """Calcula estadísticas de misiones y likes recibidos"""
        try:
            total_missions = obj.missions.count()
            # Sumamos todos los likes de todas las misiones del usuario
            total_likes = obj.missions.aggregate(total=Count('likes'))['total'] or 0
            
            return {
                'missions': total_missions,
                'likes': total_likes
            }
        except Exception:
            return {'missions': 0, 'likes': 0}

    def get_followers_count(self, obj):
        """Cuántos usuarios siguen a este piloto"""
        try:
            return obj.followers.count()
        except AttributeError:
            return 0

    def get_following_count(self, obj):
        """A cuántos usuarios sigue este piloto"""
        try:
            return obj.following.count()
        except AttributeError:
            return 0

    def get_is_following(self, obj):
        """Indica si el usuario que hace la petición ya sigue a este piloto"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                from social.models import Connection
                return Connection.objects.filter(
                    follower=request.user,
                    following=obj
                ).exists()
            except (ImportError, AttributeError):
                return False
        return False


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {'email': {'required': False}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden.'})
        return attrs

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('Este nombre de usuario ya está en uso.')
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)