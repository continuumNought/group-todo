"""Tests for the todos app."""
from django.test import TestCase
from .models import TodoList, TodoItem


class TodoModelTests(TestCase):
    def test_create_list_and_item(self) -> None:
        todo_list = TodoList.objects.create()
        item = TodoItem.objects.create(list=todo_list, text="Task")
        self.assertEqual(item.text, "Task")
        self.assertFalse(item.is_completed)
        self.assertIn(item, todo_list.items.all())
