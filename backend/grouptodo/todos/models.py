"""Database models for todos."""
from django.db import models
import uuid


class TodoList(models.Model):
    token = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"TodoList {self.token}"


class TodoItem(models.Model):
    list = models.ForeignKey(TodoList, on_delete=models.CASCADE, related_name="items")
    text = models.CharField(max_length=255)
    description = models.CharField(max_length=1023, null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Trim text and description if they're too long
        if self.text:
            self.text = self.text[:255]
        if self.description:
            self.description = self.description[:1023]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.text} ({'\u2713' if self.is_completed else '\u2717'})"
