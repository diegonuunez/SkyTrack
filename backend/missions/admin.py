from django.contrib import admin
from .models import Mission


@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display    = ('name', 'user', 'date', 'drone_model', 'visibility', 'status', 'max_alt_m', 'max_vel_ms')
    list_filter     = ('visibility', 'status', 'drone_model')
    search_fields   = ('name', 'user__username', 'description')
    readonly_fields = ('date',)
    ordering        = ('-date',)
