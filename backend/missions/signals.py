from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Mission
from services.telemetry_service import TelemetryService


@receiver(post_delete, sender=Mission)
def delete_mission_telemetry(sender, instance, **kwargs):
    TelemetryService.delete_mission_telemetry(instance.id)
