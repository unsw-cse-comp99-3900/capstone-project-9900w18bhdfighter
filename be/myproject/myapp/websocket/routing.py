
import os
import django
from django.urls import re_path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from .import consumers
websocket_urlpatterns = [
   re_path(r'ws/chat/user/(?P<user_id>\d+)$', consumers.Consumer.as_asgi()),
]
