from myapp.src.models.models import (
    CourseCode,
    Group,
    GroupPreference,
    GroupProjectsLink,
    GroupSkillEvaluation,
)
from myapp.src.serializers.course import CourseSerializer
from myapp.src.serializers.proj import ProjectSerializer, ProjectSlimSerializer
from myapp.src.serializers.user import UserSlimSerializer
from rest_framework import serializers


class GroupSkillEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupSkillEvaluation
        fields = ["Note", "Score", "Skill", "EvaluateGroup"]

    def validate(self, data):
        # score不能小于1，不能大于10
        if data["Score"] < 1 or data["Score"] > 10:
            raise serializers.ValidationError("Score must be between 1 and 10")
        # 只能对自己的组进行评分

        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # 删除不需要的字段
        representation.pop("EvaluateGroup", None)
        return representation


class GroupPreferenceSerializer(serializers.ModelSerializer):
    Preference = ProjectSerializer()

    class Meta:
        model = GroupPreference
        fields = ["PreferenceID", "Preference", "Rank"]
        extra_kwargs = {"PreferenceID": {"read_only": True}}


class GroupWithPreferencesSerializer(serializers.ModelSerializer):
    Preferences = GroupPreferenceSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = [
            "GroupID",
            "GroupName",
            "GroupDescription",
            "CreatedBy",
            "Preferences",
        ]


class GroupUpdatePreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPreference
        fields = ["Rank", "Preference"]

    def validate(self, data):
        return data


class GroupSerializer(serializers.ModelSerializer):
    GroupDescription = serializers.CharField(allow_blank=True)
    MaxMemberNumber = serializers.IntegerField(min_value=5)

    # CourseCode 用作 PrimaryKeyRelatedField
    CourseCode = serializers.PrimaryKeyRelatedField(queryset=CourseCode.objects.all())

    class Meta:
        model = Group
        fields = [
            "GroupName",
            "GroupDescription",
            "MaxMemberNumber",
            "GroupID",
            "CourseCode",
            "CreatedBy",
        ]
        read_only_fields = ["CreatedBy"]

    def create(self, validated_data):
        # 从 validated_data 中提取 CourseCode 数据
        course_code = validated_data.pop("CourseCode")

        # 从上下文中获取 `CreatedBy` 用户
        created_by = self.context["request"].user

        # 创建 Group 实例
        group = Group.objects.create(
            **validated_data, CourseCode=course_code, CreatedBy=created_by
        )

        return group


class GroupFetchSerializer(serializers.ModelSerializer):
    GroupMembers = UserSlimSerializer(many=True, read_only=True)
    Preferences = serializers.SerializerMethodField()
    CourseCode = CourseSerializer()
    Project = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "GroupName",
            "GroupDescription",
            "MaxMemberNumber",
            "GroupID",
            "GroupMembers",
            "CreatedBy",
            "Preferences",
            "CourseCode",
            "Project",
        ]

    def get_Preferences(self, obj):
        preferences = GroupPreference.objects.filter(Group=obj)
        return GroupPreferenceSerializer(preferences, many=True).data

    def get_Project(self, obj):
        # 返回小组的项目
        project = GroupProjectsLink.objects.filter(GroupID=obj)
        if project:
            return ProjectSlimSerializer(project[0].ProjectID).data
        return None
