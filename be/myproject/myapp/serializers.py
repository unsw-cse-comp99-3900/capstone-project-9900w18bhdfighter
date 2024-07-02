from rest_framework import serializers
from .models import Project, User, UserPreferencesLink, Area, StudentArea
from django.contrib.auth.hashers import make_password


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

class StudentAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentArea
        fields = ['AreaID', 'AreaName']

class UserUpdateSerializer(serializers.ModelSerializer):
    Passwd = serializers.CharField(write_only=True, required=False, default="")
    Areas = serializers.ListField(child=serializers.IntegerField(), required=False)
    UserInformation = serializers.CharField(required=False, allow_blank=True, default="")
    def validate(self, data):
        UserID = self.context.get('UserID')
        if data.get('EmailAddress'):
            if User.objects.exclude(UserID=UserID).filter(EmailAddress=data['EmailAddress']).exists():
                raise serializers.ValidationError("The email address is already in use by another user!")
        if data.get('Passwd'):
            data["Passwd"] = make_password(data["Passwd"])
        areas_data = data.get('Areas', [])
        for area_id in areas_data:
            if not Area.objects.filter(AreaID=area_id).exists():
                raise serializers.ValidationError(f"Area with ID {area_id} does not exist.")
        data['Areas'] = areas_data
        return data
    
    def update(self, instance, validated_data):
        areas_data = validated_data.pop('Areas', [])
        instance.EmailAddress = validated_data.get('EmailAddress', instance.EmailAddress)
        instance.FirstName = validated_data.get('FirstName', instance.FirstName)
        instance.LastName = validated_data.get('LastName', instance.LastName)
        instance.UserInformation = validated_data.get('UserInformation', instance.UserInformation)
        instance.Passwd = validated_data.get('Passwd', instance.Passwd)
        instance.UserRole = validated_data.get('UserRole', instance.UserRole)
        StudentArea.objects.filter(User=instance).delete()
        for area_id in areas_data:
            area = Area.objects.get(AreaID=area_id)
            StudentArea.objects.create(User=instance, Area=area)
            
        instance.save()    
        return {
            **instance.__dict__,
            "Areas": areas_data
        }
    class Meta:
        model = User
        fields = "__all__"


class UserUpdatePasswdSerializer(serializers.ModelSerializer):
    Passwd2 = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['Passwd'] != data['Passwd2']:
            raise serializers.ValidationError("The passwords entered twice do not match, please re-enter them!")
        data.pop('Passwd2')

        user = User.objects.filter(UserID=self.context.get('UserID')).first()
        new_pwd = data['Passwd']
        if user.Passwd != new_pwd:
            data["Passwd"] = make_password(new_pwd)
        return data

    class Meta:
        model = User
        fields = ["Passwd", "Passwd2"]

class RegisterSerializer(serializers.ModelSerializer):
    Areas = serializers.ListField(child=serializers.IntegerField(), required=False)
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
        data["Passwd"] = make_password(data["Passwd"])
        
        areas_data = data.get('Areas', [])
        for area_id in areas_data:
            if not Area.objects.filter(AreaID=area_id).exists():
                raise serializers.ValidationError(f"Area with ID {area_id} does not exist.")
            
        data['Areas'] = areas_data
        return data

    def create(self, validated_data):
        areas_data = validated_data.pop('Areas', [])
        user = User.objects.create(**validated_data)
        for area_id in areas_data:
            area = Area.objects.get(AreaID=area_id)
            StudentArea.objects.create(User=user, Area=area)
    
        return {
            **user.__dict__,
            "Areas": areas_data
        }


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = "__all__"
    
