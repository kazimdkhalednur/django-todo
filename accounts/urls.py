from django.urls import path
from django.contrib.auth import views
from .views import UserCreateView


urlpatterns = [
    path("create/", UserCreateView.as_view(), name='signup'),
    path("login/", views.LoginView.as_view(template_name='accounts/login.html'), name="login"),
    path("logout/", views.LogoutView.as_view(template_name='accounts/logout.html'), name="logout"),
]
