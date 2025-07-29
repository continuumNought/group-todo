from rest_framework import serializers
from .models import TodoList, TodoItem


class TodoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoList
        fields = ["id", "token", "created_at"]


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = [
            "id",
            "list",
            "text",
            "description",
            "is_completed",
            "created_at",
            "updated_at",
        ]
