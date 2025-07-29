"""Tests for the todos app."""
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Group, Todo


class TodoModelTests(TestCase):
    def test_create_group_and_todo(self) -> None:
        user = get_user_model().objects.create(username='user')
        group = Group.objects.create(name='Test Group')
        group.members.add(user)
        todo = Todo.objects.create(group=group, title='Task')
        self.assertEqual(todo.title, 'Task')
        self.assertFalse(todo.completed)
        self.assertIn(group, Group.objects.all())
