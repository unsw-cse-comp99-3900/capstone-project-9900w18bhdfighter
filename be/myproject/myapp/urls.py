from django.urls import path
from . import views
from rest_framework import routers
user_url = routers.SimpleRouter()
user_url.register(r'users', views.UserViews)


urlpatterns = [
]

urlpatterns += user_url.urls
