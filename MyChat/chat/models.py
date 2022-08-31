from django.contrib.auth.models import User
from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class UserInRooms(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_id')
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room_id')


class Message(models.Model):
    sender_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room')
    message = models.CharField(max_length=1200)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ('timestamp',)
