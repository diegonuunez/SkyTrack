from django.contrib import admin
from .models import Comment, Like, Save, Connection


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display    = ('user', 'mission', 'created_at')
    search_fields   = ('user__username', 'mission__name', 'text')
    readonly_fields = ('created_at',)
    ordering        = ('-created_at',)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display    = ('user', 'mission', 'created_at')
    search_fields   = ('user__username', 'mission__name')
    readonly_fields = ('created_at',)


@admin.register(Save)
class SaveAdmin(admin.ModelAdmin):
    list_display    = ('user', 'mission', 'created_at')
    search_fields   = ('user__username', 'mission__name')
    readonly_fields = ('created_at',)


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display    = ('follower', 'following', 'created_at')
    search_fields   = ('follower__username', 'following__username')
    readonly_fields = ('created_at',)
