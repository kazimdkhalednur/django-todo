from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, HyperlinkedModelSerializer
from ..models import Task


class TaskSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'text', 'date_and_time', 'reminder']


class TaskPOSTSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = ['text', 'date_and_time', 'reminder']


class TaskHyperlinkedSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ['url', 'id', 'text', 'date_and_time', 'reminder']
