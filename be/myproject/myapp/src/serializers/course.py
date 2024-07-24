from myapp.src.models.models import CourseCode
from rest_framework import serializers


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCode
        fields = ["CourseCodeID", "CourseName"]
