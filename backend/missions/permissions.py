from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Permiso personalizado para que solo los dueños de un objeto puedan editarlo.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user