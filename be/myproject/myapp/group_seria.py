from rest_framework import serializers
from .models import *


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouPostPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouSkillEvaluationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouSubmitPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data
