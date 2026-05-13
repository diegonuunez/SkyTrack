from django.db import models
from django.contrib.auth import get_user_model
from missions.models import Mission

User = get_user_model()

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_likes')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'mission') 

    def __str__(self):
        return f"{self.user.username} liked {self.mission.name}"

class Save(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_missions_list')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'mission')

    def __str__(self):
        return f"{self.user.username} saved {self.mission.name}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']