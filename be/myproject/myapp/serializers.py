from rest_framework import serializers
from .models import Project, User


# ?
class StudentsignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['UserID', 'FirstName', 'LastName', 'EmailAddres', 'Passwd']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['ProjectID', 'ProjectName', 'ProjectDescription', 'ProjectOwner']


class UserSerializer(serializers.ModelSerializer):
    # def validate_EmailAddress(self, value):
    #     pass

    class Meta:
        model = User
        fields = "__all__"
