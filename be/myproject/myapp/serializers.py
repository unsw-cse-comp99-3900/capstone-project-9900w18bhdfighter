from rest_framework import serializers
from .models import Project, User, UserPreferencesLink


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
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'Passwd': {'write_only': True}}

    def validate(self, attrs):
        if self.instance and (attrs.get('UserID') or attrs.get('UserRole')):
            raise serializers.ValidationError("Cannot update UserID or UserRole.")
        return super().validate(attrs)


class UserPreferencesLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferencesLink
        fields = '__all_'
