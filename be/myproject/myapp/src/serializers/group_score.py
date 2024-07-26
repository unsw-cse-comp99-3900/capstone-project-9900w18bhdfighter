from myapp.src.models.models import (
    Group,
    GroupProjectsLink,
    GroupScore,
    Submission,
    User,
)
from myapp.src.serializers.proj import ProjectSlimSerializer
from myapp.src.serializers.submission import SubmissionFetchSerializer
from myapp.src.serializers.user import UserSlimSerializer
from rest_framework import serializers


class GroupProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupProjectsLink
        fields = ["GroupID", "ProjectID"]


class GroupScoreSerializer(serializers.ModelSerializer):
    markedBy = serializers.SerializerMethodField()

    class Meta:
        model = GroupScore
        fields = ["Id", "score", "feedback", "markedBy"]

    def get_markedBy(self, obj):
        marker = User.objects.get(UserID=obj.markers.UserID)
        return UserSlimSerializer(marker).data


class GroupAssessmentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupScore
        fields = ["score", "feedback", "group", "markers"]

    def create(self, validated_data):

        group_score = GroupScore.objects.filter(group=validated_data["group"])
        if group_score:
            group_score = group_score[0]
            group_score.score = validated_data.get("score", group_score.score)
            group_score.feedback = validated_data.get("feedback", group_score.feedback)
            group_score.markers = validated_data.get("markers", group_score.markers)
            group_score.save()
            return group_score

        group_score = GroupScore.objects.create(**validated_data)
        return group_score

    def update(self, instance, validated_data):
        instance.score = validated_data.get("score", instance.score)
        instance.feedback = validated_data.get("feedback", instance.feedback)
        instance.save()
        return instance


class GroupAssessmentFetchSerializer(serializers.ModelSerializer):
    Project = serializers.SerializerMethodField()
    GroupScore = serializers.SerializerMethodField()
    Submission = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "GroupName",
            "GroupID",
            "Project",
            "GroupScore",
            "Submission",
        ]

    def get_Submission(self, obj):
        # 返回小组的提交
        submission = Submission.objects.filter(Group=obj)
        if submission:
            return SubmissionFetchSerializer(submission[0]).data
        return None

    def get_GroupScore(self, obj):
        # 返回小组的评分
        group_score = GroupScore.objects.filter(group=obj)
        if group_score:
            return GroupScoreSerializer(group_score[0]).data
        return None

    def get_Project(self, obj):
        # 返回小组的项目
        group_project = GroupProjectsLink.objects.filter(GroupID=obj)
        if group_project:
            return ProjectSlimSerializer(group_project[0].ProjectID).data
        return None

    def retrieve(self, request, *args, **kwargs):
        # 返回小组的评分
        group = self.get_object()
        group_score = GroupScore.objects.filter(group=group)
        if group_score:
            return GroupScoreSerializer(group_score[0]).data
        return None
