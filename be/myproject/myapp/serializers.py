from rest_framework import serializers
from .models import Project, User, UserPreferencesLink


class StudentsignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['FirstName', 'LastName', 'EmailAddres', 'Passwd']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['ProjectID', 'ProjectName', 'ProjectDescription', 'ProjectOwner','ProjectGroupNumber']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'Passwd': {'write_only': True}}


class UserPreferencesLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferencesLink
        fields = '__all_'
