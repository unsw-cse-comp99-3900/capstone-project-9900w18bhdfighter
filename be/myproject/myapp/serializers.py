from rest_framework import serializers
from .models import Project, User, UserPreferencesLink
from .models import Project, User


# ?
class StudentsignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['FirstName', 'LastName', 'EmailAddres', 'Passwd']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['ProjectID', 'ProjectName', 'ProjectDescription', 'ProjectOwner']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'Passwd': {'write_only': True}}


class UserPreferencesLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferencesLink
        fields = '__all_'


class UserUpdateSerializer(serializers.ModelSerializer):
    Passwd2 = serializers.CharField(write_only=True, required=False, default="")

    def validate(self, data):
        UserID = self.context.get('UserID')
        if User.objects.exclude(UserID=UserID).filter(EmailAddress=data['EmailAddress']).exists():
            raise serializers.ValidationError("The email address is already in use by another user!")
        instance = User.objects.get(UserID=UserID)
        if data['Passwd'] != instance.Passwd:
            Passwd2 = data.get('Passwd2')
            if not Passwd2:
                raise serializers.ValidationError("Confirmation password has not been entered, please enter the confirmation password to continue!")
            if data['Passwd'] != data['Passwd2']:
                raise serializers.ValidationError("The passwords entered twice do not match, please re-enter them!")
        data.pop('Passwd2')
        return data

    class Meta:
        model = User
        fields = "__all__"


class UserUpdatePasswdSerializer(serializers.ModelSerializer):
    Passwd2 = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['Passwd'] != data['Passwd2']:
            raise serializers.ValidationError("The passwords entered twice do not match, please re-enter them!")
        data.pop('Passwd2')
        return data

    class Meta:
        model = User
        fields = ["Passwd", "Passwd2"]


class RegisterSerializer(serializers.ModelSerializer):
    Passwd = serializers.CharField(write_only=True, required=True)
    Passwd2 = serializers.CharField(write_only=True, required=True)
    EmailAddress = serializers.EmailField(required=True)
    UserInformation = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = User
        fields = "__all__"

    def validate(self, data):
        if User.objects.filter(EmailAddress=data['EmailAddress']).exists():
            raise serializers.ValidationError("The email address is already in use by another user!")
        if data['Passwd'] != data['Passwd2']:
            raise serializers.ValidationError("The passwords entered twice do not match, please re-enter them!")
        data.pop('Passwd2')
        return data

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        return user
