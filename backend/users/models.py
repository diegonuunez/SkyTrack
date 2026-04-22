from django.db import models
from django.contrib.auth.models import User
    
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=500, blank=True)
    favorite_drone = models.CharField(max_length=500, blank=True)
    experience_level = models.CharField(
        max_length=20,
        choices=[('beginner','Principiante'),('pro','Profesional')],
        default= 'beginner'
        )
    def __str__(self):
        return f"Perfil de {self.user.username}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
