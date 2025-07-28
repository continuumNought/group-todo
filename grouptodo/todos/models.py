"""Database models for todos."""
from django.contrib.auth import get_user_model
from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(get_user_model(), related_name='todo_groups')

    def __str__(self) -> str:
        return self.name


class Todo(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='todos')
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title
