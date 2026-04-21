from django.contrib import admin

from django.contrib import admin
from .models import Mission, TelemetryPoint

admin.site.register(Mission)
admin.site.register(TelemetryPoint)