"""Views for the todos app."""
from django.shortcuts import render
from .models import Group


def index(request):
    groups = Group.objects.all()
    return render(request, 'todos/index.html', {'groups': groups})
