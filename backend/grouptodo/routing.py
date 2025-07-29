from django.urls import re_path
from .todos.consumers import TodoConsumer

websocket_urlpatterns = [
    re_path(r"ws/todos/$", TodoConsumer.as_asgi()),
]
