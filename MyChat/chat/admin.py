from django.contrib import admin
from .models import *

admin.site.register(Message)
admin.site.register(Room)
admin.site.register(UserInRooms)

# Register your models here.
