"""MyChat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

from chat.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/sid_auth/', include('rest_framework.urls')),
    path('api/v1/userlist/', UsersApiView.as_view()),   # список пользователей
    path('api/v1/userlist/<int:room>/', UsersApiView.as_view()),   # список пользователей, которых нет в данном чате
    path('api/v1/roomlist/', RoomsApiView.as_view()),   # список комнат
    path('api/v1/send_message/', SendMessageApiView.as_view()), # post создание сообщения (sender, room, text)
    path('api/v1/messagelist/', MessageAPIList.as_view()),  # список всех сообщений
    path('api/v1/messagelist/<int:room>/', MessageAPIList.as_view()), # список сообщений в комнате, с параметром idm - ид сообщ > указанного
    path('api/v1/userroom/', RoomUserAPIView.as_view()),    # пользователи в комнатах
    path('api/v1/userroom/<int:room>/', RoomUserAPIView.as_view()), # пользователи в конкретной комнате
    path('api/v1/roomdelete/<int:pk>/', RoomDestroyApiView.as_view()),  # удаление комнаты admin_only
    path('api/v1/messagedelete/<int:pk>/', MessageDestroyApiView.as_view()), # удаление сообщения admin_only
    path('api/v1/auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    path('api/v1/currentuser/', CurrentUserView.as_view()),
]
