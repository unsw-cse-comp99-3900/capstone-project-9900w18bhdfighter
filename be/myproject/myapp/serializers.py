from rest_framework import serializers
from .models import Project


# ?
class StudentsignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['username', 'email', 'password']



class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'description', 'required_skills', 'timeline', 'related_course', 'specific_student_criteria']
