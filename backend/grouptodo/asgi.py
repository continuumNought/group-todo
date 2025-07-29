"""ASGI config for grouptodo project."""

import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import grouptodo.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'grouptodo.settings')

django_application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_application,
        "websocket": AuthMiddlewareStack(
            URLRouter(grouptodo.routing.websocket_urlpatterns)
        ),
    }
)
