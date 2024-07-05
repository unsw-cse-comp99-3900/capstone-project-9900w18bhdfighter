"""
ASGI config for myproject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import myapp.websocket.routing as routing
from channels.security.websocket import AllowedHostsOriginValidator


print("asgi.py")
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": 
            AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
        ,
})
