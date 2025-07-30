from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TodoList, TodoItem
from .serializers import TodoListSerializer, TodoItemSerializer


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    lookup_field = "token"

    @action(detail=True, methods=["get"])
    def items(self, request, token=None):
        """Return all todo items for this list."""
        todo_list = self.get_object()
        serializer = TodoItemSerializer(todo_list.items.all(), many=True)
        return Response(serializer.data)


class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer
