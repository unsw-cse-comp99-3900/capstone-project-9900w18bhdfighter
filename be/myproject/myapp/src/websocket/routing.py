from django.urls import re_path
from myapp.src.websocket import msg_consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/user/(?P<user_id>\d+)$", msg_consumers.Consumer.as_asgi()),
]
