from django.urls import path
from . import views


urlpatterns = [
    path('', views.TaskListAPIView.as_view()),
    path('<pk>/', views.TaskUpdateDeleteView.as_view(), name='task-detail'),
]
