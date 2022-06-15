from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    date_and_time = models.CharField(max_length=50)
    reminder = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)
