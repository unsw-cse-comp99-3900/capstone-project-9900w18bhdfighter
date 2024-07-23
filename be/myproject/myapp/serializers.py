from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.db.models import Count

from rest_framework.exceptions import PermissionDenied


class StudentsignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['FirstName', 'LastName', 'EmailAddres', 'Passwd']

class StudentAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentArea
        fields = ['AreaID', 'AreaName']


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['AreaID', 'AreaName']


class SkillSerializer(serializers.ModelSerializer):
    Area = AreaSerializer()
    class Meta:
        model = Skill
        fields = ['SkillID', 'SkillName', 'Area']

class SkillProjectSerializer(serializers.ModelSerializer):
    Skill = SkillSerializer()

    class Meta:
        model = SkillProject
        fields = ['Skill']

class ProjectSerializer(serializers.ModelSerializer):
    RequiredSkills = serializers.SerializerMethodField()
    projectOwner_id = serializers.SerializerMethodField()
    ProjectDescription = serializers.CharField( allow_blank=True)
    class Meta:
        model = Project
        fields = ['ProjectID', 'ProjectName', 'ProjectDescription', 'ProjectOwner','MaxNumOfGroup', 'RequiredSkills',"CreatedBy","projectOwner_id"]
        read_only_fields = ['CreatedBy']
    def get_RequiredSkills(self, obj):
        skills = SkillProject.objects.filter(Project=obj)
        return SkillProjectSerializer(skills, many=True).data

    def get_projectOwner_id(self, obj):
        if obj.ProjectOwner:
            try:
                user = User.objects.get(EmailAddress=obj.ProjectOwner)
                return user.UserID
            except User.DoesNotExist:
                return None
        return None


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['AreaID', 'AreaName']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'Passwd': {'write_only': True}}


class UserSlimSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['UserID', 'FirstName', 'LastName', 'EmailAddress', 'UserRole']
        extra_kwargs = {'Passwd': {'write_only': True}}
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCode
        fields = ['CourseCodeID', 'CourseName']

class UserWithAreaSerializer(serializers.ModelSerializer):
    Areas = AreaSerializer(many=True, read_only=True)
    CourseCode = CourseSerializer()
    class Meta:
        model = User
        fields = ['UserID', 'FirstName', 'LastName', 'EmailAddress', 'UserRole', 'UserInformation', 'Areas',  'CourseCode']
        extra_kwargs = {'Passwd': {'write_only': True}}



class GroupSerializer(serializers.ModelSerializer):
    GroupDescription = serializers.CharField(allow_blank=True)
    MaxMemberNumber = serializers.IntegerField(min_value=5)
    
    # CourseCode 用作 PrimaryKeyRelatedField
    CourseCode = serializers.PrimaryKeyRelatedField(queryset=CourseCode.objects.all())
    
    class Meta:
        model = Group
        fields = ['GroupName', 'GroupDescription', 'MaxMemberNumber', 'GroupID', 'CourseCode', 'CreatedBy']
        read_only_fields = ['CreatedBy']

    def create(self, validated_data):
        # 从 validated_data 中提取 CourseCode 数据
        course_code = validated_data.pop('CourseCode')
        
        # 从上下文中获取 `CreatedBy` 用户
        created_by = self.context['request'].user
        
        # 创建 Group 实例
        group = Group.objects.create(**validated_data, CourseCode=course_code, CreatedBy=created_by)
        
        return group


    
class GroupFetchSerializer(serializers.ModelSerializer):
    GroupMembers = UserSlimSerializer(many=True, read_only=True)
    Preferences = serializers.SerializerMethodField()
    CourseCode = CourseSerializer()
    class Meta:
        model=Group
        fields = ['GroupName', 'GroupDescription', 'MaxMemberNumber',  'GroupID',"GroupMembers","CreatedBy","Preferences","CourseCode"]
    def get_Preferences(self, obj):
        preferences = GroupPreference.objects.filter(Group=obj)
        return GroupPreferenceSerializer(preferences, many=True).data


class UserUpdateSerializer(serializers.ModelSerializer):
    Passwd = serializers.CharField(write_only=True, required=False, default="")
    Areas = serializers.ListField(child=serializers.IntegerField(), required=False)
    UserInformation = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, data):
        UserID = self.context.get('UserID')
        RequesterID = self.context.get('RequesterID')
        # check if the requester exists
        try:
            requester = User.objects.get(UserID=RequesterID)
        except User.DoesNotExist:
            raise serializers.ValidationError("The requester does not exist.")
        # check if the email address is already in use
        if data.get('EmailAddress'):
            if User.objects.exclude(UserID=UserID).filter(EmailAddress=data['EmailAddress']).exists():
                raise serializers.ValidationError("The email address is already in use by another user!")
            data["EmailAddress"] = data["EmailAddress"]
        # if the password is provided, hash it and save it
        if data.get('Passwd'):
            data["Passwd"] = make_password(data["Passwd"])

        # check if the areas exist
        areas_data = data.get('Areas', [])
        for area_id in areas_data:
            if not Area.objects.filter(AreaID=area_id).exists():
                raise serializers.ValidationError(f"Area with ID {area_id} does not exist.")
        data['Areas'] = areas_data
        course_code = data.get('CourseCodeID', None)
        if course_code:
            try:
                course = CourseCode.objects.get(CourseCodeID=course_code)
                data['CourseCode'] = course
            except CourseCode.DoesNotExist:
                raise serializers.ValidationError("The course does not exist.")
        # if not admin
        if requester.UserRole != 5:
            # only alow the user to update their own information
            if UserID != RequesterID:
                raise serializers.ValidationError("You do not have permission to change another user's information.")
            # do not allow the user to change their role to another
            if UserID == RequesterID and data.get('UserRole') == requester.UserRole:
                pass
            else:
                raise serializers.ValidationError("You do not have permission to change your role.")

        return data

    def update(self, instance, validated_data):
        areas_data = validated_data.pop('Areas', [])
        instance.EmailAddress = validated_data.get('EmailAddress', instance.EmailAddress)
        instance.FirstName = validated_data.get('FirstName', instance.FirstName)
        instance.LastName = validated_data.get('LastName', instance.LastName)
        instance.UserInformation = validated_data.get('UserInformation', instance.UserInformation)
        instance.Passwd = validated_data.get('Passwd', instance.Passwd)
        instance.UserRole = validated_data.get('UserRole', instance.UserRole)
        instance.CourseCode = validated_data.get('CourseCode', instance.CourseCode)
        
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


class MessageSerializer(serializers.Serializer):
    class Meta:
        model = Message
        fields = ['message']


class ContactSerializer(serializers.ModelSerializer):
    Contact = UserSlimSerializer(read_only=True)
    UnreadMsgsCount = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = ['Contact', 'ContactUser', 'IsFixed', 'ContactID', 'UnreadMsgsCount']

    def get_UnreadMsgsCount(self, obj):
        unread_count = Message.objects.filter(
            Sender=obj.Contact,
            Receiver=obj.ContactUser,
            IsRead=False
        ).count()
        return unread_count


class GroupContactSerializer(GroupFetchSerializer):
    UnreadMsgsCount = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = GroupFetchSerializer.Meta.fields + ['UnreadMsgsCount'] 
        
    def get_UnreadMsgsCount(self, obj):
        user_id=self.context.get('requesterId')
        User_obj=User.objects.get(UserID=user_id)
        unread_count = GroupMessage.objects.filter(
            ReceiverGroup=obj, 
        ).exclude(ReadBy=User_obj).count()
        
        
        return unread_count

    
from .models import Contact, User


class ContactCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["Contact", "ContactUser", "IsFixed", "ContactID"]

    def validate(self, data):
        requester_id = self.context.get('requesterId')
        if requester_id != data['ContactUser'].UserID:
            raise PermissionDenied("You do not have permission to create a contact for another user.")
        return data

    def create(self, validated_data):
        return Contact.objects.create(**validated_data)


class ContactUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"
        extra_kwargs = {
            'Contact': {'read_only': True},
            'ContactUser': {'read_only': True}
        }

    def validate(self, data):
        requester_id = self.context.get('requesterId')
        # check if the requester is the same as the contact user
        if requester_id != self.instance.ContactUser.UserID:
            raise PermissionDenied("You do not have permission to update a contact for another user.")
        return data

    def update(self, instance, validated_data):
        instance.IsFixed = validated_data.get('IsFixed', instance.IsFixed)
        instance.save()
        return instance


class MessageSerializer(serializers.ModelSerializer):
    ChannelId = serializers.SerializerMethodField()

    def get_ChannelId(self, obj):
        if obj.Sender.UserID > obj.Receiver.UserID:
            return f"{obj.Receiver.UserID}_{obj.Sender.UserID}"
        return f"{obj.Sender.UserID}_{obj.Receiver.UserID}"

    class Meta:
        model = Message
        fields = ['MessageID', 'Content', 'Sender', 'Receiver', 'CreatedAt', 'IsRead', 'ChannelId']


class GroupMessageSerializer(serializers.ModelSerializer):
    ChannelId = serializers.SerializerMethodField()
    class Meta:
        model = GroupMessage
        fields = ['GroupMessageID', 'Content', 'Sender', 'ReceiverGroup', 'CreatedAt', 'ReadBy', 'ChannelId']
    def get_ChannelId(self, obj):
        return f"group_{obj.ReceiverGroup.GroupID}"


class GroupPreferenceSerializer(serializers.ModelSerializer):
    Preference=ProjectSerializer()
    class Meta:
        model = GroupPreference
        fields = ['PreferenceID', 'Preference', 'Rank']
        extra_kwargs = {
            'PreferenceID': {'read_only': True}
        }


class GroupPreferenceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPreference
        fields = ['Preference', 'Rank']


class GroupWithPreferencesSerializer(serializers.ModelSerializer):
    Preferences = GroupPreferenceSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['GroupID', 'GroupName', 'GroupDescription', 'CreatedBy', 'Preferences']


class NotificationSerializer(serializers.ModelSerializer):
    Receivers = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()),
        write_only=True
    )

    class Meta:
        model = Notification
        fields = ['NotificationID', 'Type', 'Message', 'AdditionalData', 'CreatedAt', 'FromGroup', 'FromUser', 'Receivers']
    def validate(self, data):
        if data.get('FromGroup') and data.get('FromUser'):
            raise serializers.ValidationError("A notification can only be from a group or a user, not both.")
        return data

    def create(self, validated_data):
        receivers = validated_data.pop('Receivers')
        notification = Notification.objects.create(**validated_data)
        for receiver in receivers:
            NotificationReceiver.objects.create(Notification=notification, Receiver=receiver)

        return notification
    
class NotificationFetchSerializer(serializers.ModelSerializer):
    Receivers = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()),
        write_only=True
    )
    IsRead = serializers.SerializerMethodField()
    class Meta:
        model = Notification
        fields = ['NotificationID', 'Type', 'Message', 'AdditionalData', 'CreatedAt', 'FromGroup', 'FromUser', 'Receivers','IsRead']
    def get_IsRead(self, obj):
        user_id=self.context.get('user_id')
        User_obj=User.objects.get(UserID=user_id)
        notification_receiver=NotificationReceiver.objects.filter(Notification=obj,Receiver=User_obj).first()
        if notification_receiver:
            return notification_receiver.IsRead
        return False
  
class NotificationReceiverSerializer(serializers.ModelSerializer):
    Notification = NotificationSerializer()
    IsRead = serializers.BooleanField(required=True)
    class Meta:
        model = NotificationReceiver
        fields = ['NotificationReceiverID', 'Receiver', 'Notification', 'IsRead']
    def validate(self, data):
        if 'IsRead' not in data:
            raise serializers.ValidationError("IsRead is required.")
        return data
    def update(self, instance, validated_data):
        instance.IsRead = validated_data.get('IsRead', instance.IsRead)
        instance.save()
        return instance


class GroupProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupProjectsLink
        fields = ['GroupID', 'ProjectID', 'GroupProjectsLinkID']
        

class TimeRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeRule
        # fields = [TimeNodeID,GroupFreezeTime,ProjectDeadline,IsActive]
        fields=["TimeNodeID","GroupFreezeTime","ProjectDeadline","IsActive","RuleName"]
        extra_kwargs = {
            'TimeRuleID': {'read_only': True}
        }
