from django.db import models
from django.contrib.auth.models import User

class Mission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='missions')
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    drone_model = models.CharField(max_length=100, default="Unknown")
    visibility = models.CharField(max_length=20, default='public')
    status = models.CharField(
        max_length=20,
        choices=[('in_progress', 'En curso'), ('completed', 'Completada')],
        default='completed'
    )
    max_alt_m = models.FloatField(default=0.0)
    max_vel_ms = models.FloatField(default=0.0)
    
    
    def __str__(self):
        return f"{self.name} - {self.date.strftime('%Y-%m-%d')}"
    