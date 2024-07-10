# Create your models here.
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
class Area(models.Model):
    AreaID = models.AutoField(primary_key=True)
    AreaName = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.AreaName


class User(models.Model):
    UserID = models.AutoField(primary_key=True)
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    EmailAddress = models.CharField(max_length=255, unique=True)
    Passwd = models.CharField(max_length=255)
    # 1: student, 2:client, 3:tut  4:cord 5:admin 
    UserRole = models.IntegerField(choices=[(1, 'student'), (2, 'client'), (3, 'tut'), (4, 'cord'), (5, 'admin')],
                                   default=1, null=True, blank=True)
    UserInformation = models.CharField(max_length=255)
    Areas = models.ManyToManyField(Area, through='StudentArea')
    Notifications = models.ManyToManyField('Notification', through='NotificationReceiver')
    Contacts = models.ManyToManyField('self', through='Contact', symmetrical=False)

    def __str__(self):
        return str(self.UserID)


class Project(models.Model):
    ProjectID = models.AutoField(primary_key=True)
    ProjectName = models.CharField(max_length=255)
    ProjectDescription = models.TextField()
    ProjectOwner = models.CharField(max_length=255)
    CreatedBy = models.ForeignKey(User, related_name='created_projects', on_delete=models.CASCADE)
    MaxNumOfGroup = models.IntegerField(default=1)
    
    
    def __str__(self):
        return str(self.ProjectID)

class Skill(models.Model):
    SkillID = models.AutoField(primary_key=True)
    SkillName = models.CharField(max_length=255)
    Area = models.ForeignKey(Area, on_delete=models.CASCADE)

    def __str__(self):
        return self.SkillName

class SkillProject(models.Model):
    SkillProjectID = models.AutoField(primary_key=True)
    Skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    Project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.SkillProjectID)
class Group(models.Model):
    GroupID = models.AutoField(primary_key=True)
    GroupName = models.CharField(max_length=255, unique=True)
    GroupDescription = models.TextField()
    CreatedBy = models.ForeignKey(User, on_delete=models.CASCADE)
    MaxMemberNumber = models.IntegerField(default=1)
    Preferences=models.ManyToManyField(Project, through='GroupPreference')
    
    def __str__(self):
        return str(self.GroupID)


class GroupPreference(models.Model):
    PreferenceID = models.AutoField(primary_key=True)
    Preference=models.ForeignKey(Project, on_delete=models.CASCADE)
    Group=models.ForeignKey(Group, on_delete=models.CASCADE)
    Rank=models.IntegerField()
    def __str__(self):
        return str(self.PreferenceID)


class GroupUsersLink(models.Model):
    GroupUsersLinkID = models.AutoField(primary_key=True)
    GroupID = models.ForeignKey(Group, on_delete=models.CASCADE)
    UserID = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.GroupUsersLinkID)


class GroupProjectsLink(models.Model):
    GroupProjectsLinkID = models.AutoField(primary_key=True)
    GroupID = models.ForeignKey(Group, on_delete=models.CASCADE)
    ProjectID = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.GroupProjectsLinkID)


class StudentArea(models.Model):
    StudentAreaID = models.AutoField(primary_key=True)
    Area = models.ForeignKey(Area, on_delete=models.CASCADE)
    User = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.User} - {self.Area}'







class GroupAssignProject(models.Model):
    GroupID = models.AutoField(primary_key=True)
    Project = models.ForeignKey(Project, on_delete=models.CASCADE)
    Allocated = models.ForeignKey(User, on_delete=models.CASCADE)
    AllocatedAt = models.DateTimeField(default=timezone.now)
    ProgressStatus = models.CharField(
        max_length=20,
        choices=[('To Do', 'To Do'), ('In Progress', 'In Progress'), ('Done', 'Done')],
        default='To Do'
    )

    def __str__(self):
        return f'{self.Project} - {self.Allocated}'


class Notification(models.Model):
    NotificationID = models.AutoField(primary_key=True)
    #1:personal 2:group
    sender_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,default=1)
    sender_object_id = models.PositiveIntegerField(default=1)
    # so the sender can be any model(group, user, etc.)
    # it would be stored like this:
    # sender_content_type = User, sender_object_id = 1
    # or sender_content_type = Group, sender_object_id = 1
    Sender = GenericForeignKey('sender_content_type', 'sender_object_id')
    # 1: msg_personal,2: msg_group
    Type = models.CharField(max_length=255)
    Message = models.TextField()
    AdditionalData = models.JSONField(null=True, blank=True)
    CreatedAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.Sender}'


class NotificationReceiver(models.Model):
    NotificationReceiverID = models.AutoField(primary_key=True)
    ReceiverUser = models.ForeignKey(User, related_name='received_notifications', on_delete=models.CASCADE)
    Notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    IsRead = models.BooleanField(default=False)
    def __str__(self):
        return f'{self.ReceiverUser} - {self.Notification}'

class Message(models.Model):
    MessageID = models.AutoField(primary_key=True)
    Sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    Receiver= models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    Content = models.TextField()
    CreatedAt = models.DateTimeField(default=timezone.now)
    IsRead=models.BooleanField()
    def __str__(self):
        return f'{self.Sender} - {self.Content}'


class GroupMessage(models.Model):
    GroupMessageID = models.AutoField(primary_key=True)
    Sender = models.ForeignKey(User, related_name='sent_group_messages', on_delete=models.CASCADE)
    ReceiverGroup = models.ForeignKey(Group, related_name='received_group_messages', on_delete=models.CASCADE)
    Content = models.TextField()
    CreatedAt = models.DateTimeField(default=timezone.now)
    ReadBy = models.ManyToManyField(User, related_name='read_group_messages')
    def __str__(self):
        return f'{self.Sender} - {self.Content}'



class Contact(models.Model):
    ContactID = models.AutoField(primary_key=True)
    ContactUser = models.ForeignKey(User, on_delete=models.CASCADE)
    Contact = models.ForeignKey(User, related_name='contacts', on_delete=models.CASCADE)
    IsFixed = models.BooleanField(default=False)
    class Meta:
        unique_together = (('Contact', 'ContactUser'),)
    def __str__(self):
        return f'{self.Contact} - {self.ContactUser}'



   
   

        
