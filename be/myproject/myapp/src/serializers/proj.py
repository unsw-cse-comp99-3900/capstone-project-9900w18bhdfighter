from myapp.src.models.models import Project, SkillProject, User
from myapp.src.serializers.skill import SkillProjectSerializer
from rest_framework import serializers


class ProjectSerializer(serializers.ModelSerializer):
    RequiredSkills = serializers.SerializerMethodField()
    projectOwner_id = serializers.SerializerMethodField()
    ProjectDescription = serializers.CharField(allow_blank=True)

    class Meta:
        model = Project
        fields = [
            "ProjectID",
            "ProjectName",
            "ProjectDescription",
            "ProjectOwner",
            "MaxNumOfGroup",
            "RequiredSkills",
            "CreatedBy",
            "projectOwner_id",
        ]
        read_only_fields = ["CreatedBy"]

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
