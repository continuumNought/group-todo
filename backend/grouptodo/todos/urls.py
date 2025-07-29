from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TodoListViewSet, TodoItemViewSet

router = DefaultRouter()
router.register(r'lists', TodoListViewSet)
router.register(r'items', TodoItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
