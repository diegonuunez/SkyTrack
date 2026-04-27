from django.db import models
from django.contrib.auth.models import User


class Mission(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='missions')
    name = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    drone_model = models.CharField(max_length=100,default="Unknown")
    likes = models.ManyToManyField(User, related_name='liked_missions', blank=True)
    saved_by = models.ManyToManyField(User, related_name='saved_missions', blank=True)    
    
    def __str__(self):
        return f"{self.name} - {self.date.strftime('%Y-%m-%d')}"
    

class TelemetryPoint(models.Model):
    mission = models.ForeignKey(Mission, related_name='points', on_delete=models.CASCADE)
    timestamp = models.FloatField() 
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude = models.FloatField()
    speed = models.FloatField(default=0.0)
     
    class Meta:
        ordering = ['timestamp']