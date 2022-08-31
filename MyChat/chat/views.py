from django.forms import model_to_dict
from django.shortcuts import render
from djoser.serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.models import *
from chat.serializers import *


class UsersApiView(generics.ListAPIView):
    serializer_class = UsersSerializer

    def get_queryset(self):
        try:
            room = self.kwargs['room']
        except Exception:
            room = None
        if room is None:
            queryset = User.objects.all()
        else:
            us = UserInRooms.objects.filter(room_id=room)
            queryset = User.objects.all().exclude(user_id__in=us)
        return queryset

class RoomUserAPIView(generics.ListCreateAPIView):
    serializer_class = RoomUsersSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = UserInRooms.objects.all()
        try:
            room = self.kwargs['room']
        except Exception:
            room = None
        if room is not None:
            queryset = queryset.filter(room_id__pk=room)
        return queryset

    def post(self, request):
        post_new = UserInRooms.objects.create(
            room_id=Room.objects.get(pk=request.data['room']),
            user_id=User.objects.get(pk=request.data['user']) if request.data['user'] else request.user,
        )
        return Response({'post': model_to_dict(post_new)})


class RoomsApiView(generics.ListCreateAPIView):
    #queryset = Room.objects.all()
    serializer_class = RoomsSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        inner_qs = UserInRooms.objects.filter(user_id=self.request.user)
        queryset = Room.objects.filter(room_id__in=inner_qs)
        return queryset

class RoomDestroyApiView(generics.RetrieveDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomsSerializer
    permission_classes = (IsAdminUser,)


class MessageAPIList(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Message.objects.all()
        try:
            room = self.kwargs['room']
            idm = self.request.GET.get('idm')
        except Exception:
            room = None
        if room is not None:
            if idm is None:
                queryset = queryset.filter(room_id__pk=room)
            else:
                queryset = queryset.filter(room_id__pk=room, pk__gt=idm)
        return queryset


class SendMessageApiView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        lst = Message.objects.all().values()
        return Response({'messages': list(lst)})

    def post(self, request):
        post_new = Message.objects.create(
            sender_id=User.objects.get(pk=request.data['sender']),
            room_id=Room.objects.get(pk=request.data['room']),
            message=request.data['text'],
        )
        return Response({'post': model_to_dict(post_new)})


class MessageDestroyApiView(generics.RetrieveDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (IsAdminUser,)


class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
