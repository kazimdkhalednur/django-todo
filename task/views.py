from django.shortcuts import render, redirect
from .models import Task


def index(request):
    if request.user.is_authenticated:
        return render(request, 'index.html')
    return redirect('login')
