from django.db import models

# Create your models here.


# Student Sign up ?
class UserProfile(models.Model):
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

# Project Creation and Updating
class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.CharField(max_length=255)
    timeline = models.CharField(max_length=255)
    related_course = models.CharField(max_length=255)
    specific_student_criteria = models.CharField(max_length=255)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE) # When the UserProfile record is deleted, delete all Project records associated with that

    def __str__(self):
        return self.title