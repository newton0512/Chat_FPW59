from rest_framework import serializers
from django.contrib.auth.models import User

from chat.models import *


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username']

class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['pk', 'name']

class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = "__all__"

    def get_username(self, obj):
        return obj.sender_id.username

class RoomUsersSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserInRooms
        fields = "__all__"

    def get_username(self, obj):
        return obj.user_id.username


