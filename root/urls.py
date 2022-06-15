from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('task.urls')),
    path('accounts/', include('accounts.urls')),
    path('api/task/', include('task.api.urls')),
]
