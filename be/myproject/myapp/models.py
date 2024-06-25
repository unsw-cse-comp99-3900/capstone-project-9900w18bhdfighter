# Create your models here.
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from rest_framework.authtoken.models import Token

# Users 表
class User(models.Model):
    UserID = models.AutoField(primary_key=True)
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    EmailAddress = models.CharField(max_length=255, unique=True)
    Passwd = models.CharField(max_length=255)
    # 1: student, 2:client, 3:tut  4:cord 5:admin 
    UserRole = models.IntegerField()
    UserInformation = models.CharField(max_length=255)
 

    def __str__(self):
        return str(self.UserID)


class Project(models.Model):
    ProjectID = models.AutoField(primary_key=True)
    ProjectName = models.CharField(max_length=255)
    ProjectDescription = models.TextField()
    ProjectOwner = models.CharField(max_length=255)
    CreatedBy = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.ProjectID)


class UserPreferencesLink(models.Model):
    UserPreferencesLinkID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(User, on_delete=models.CASCADE)
    ProjectID = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.UserPreferencesLinkID)


class Group(models.Model):
    GroupID = models.AutoField(primary_key=True)
    GroupName = models.CharField(max_length=255)
    GroupDescription = models.TextField()
    CreatedBy = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.GroupID)


class GroupPreferencesLink(models.Model):
    GroupPreferencesLinkID = models.AutoField(primary_key=True)
    GroupID = models.ForeignKey(Group, on_delete=models.CASCADE)
    ProjectID = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.GroupPreferencesLinkID)


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

# # Student Sign up ?
# class UserProfile(models.Model):
#     username = models.CharField(max_length=255)
#     email = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)

#     def __str__(self):
#         return self.username

# # Project Creation and Updating
# class Project(models.Model):
#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     required_skills = models.CharField(max_length=255)
#     timeline = models.CharField(max_length=255)
#     related_course = models.CharField(max_length=255)
#     specific_student_criteria = models.CharField(max_length=255)
#     created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE) # When the UserProfile record is deleted, delete all Project records associated with that

#     def __str__(self):
#         return self.title
