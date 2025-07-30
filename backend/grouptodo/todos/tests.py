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


class TodoAPITests(TestCase):
    """API tests for todo list and items."""

    def test_create_list_and_retrieve_items(self) -> None:
        # Create list via API
        response = self.client.post("/api/lists/")
        self.assertEqual(response.status_code, 201)
        token = response.json()["token"]
        list_id = response.json()["id"]

        # Create an item in that list
        item_response = self.client.post(
            "/api/items/", {"list": list_id, "text": "Task"}
        )
        self.assertEqual(item_response.status_code, 201)

        # Retrieve items via list token
        items_response = self.client.get(f"/api/lists/{token}/items/")
        self.assertEqual(items_response.status_code, 200)
        data = items_response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["text"], "Task")
