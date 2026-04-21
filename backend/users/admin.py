from django.contrib import admin
from .models import Profile

# Le decimos a Django que muestre los Perfiles en el panel
admin.site.register(Profile)