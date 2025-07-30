from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TodoList, TodoItem
from .serializers import TodoListSerializer, TodoItemSerializer


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    lookup_field = "token"

    def create(self, request, *args, **kwargs):
        """Create a new todo list with a server-generated token."""
        todo_list = TodoList.objects.create()
        serializer = self.get_serializer(todo_list)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=["get"])
    def items(self, request, token=None):
        """Return all todo items for this list."""
        todo_list = self.get_object()
        serializer = TodoItemSerializer(todo_list.items.all(), many=True)
        return Response(serializer.data)


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer
