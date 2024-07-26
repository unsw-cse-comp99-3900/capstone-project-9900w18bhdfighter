from myapp.src.models.models import Group, Submission
from myapp.src.serializers.proj import ProjectSlimSerializer
from rest_framework import serializers


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "Group",
            "Project",
            "SubmissionTime",
            "SubmissionDemoVideo",
            "SubmissionReport",
            "GithubLink",
            "SubmitBy",
        ]

    def create(self, validated_data):
        # 如果存在相同的group和project的submission，报错
        print(validated_data.get("SubmissionDemoVideo"))
        if Submission.objects.filter(
            Group=validated_data["Group"], Project=validated_data["Project"]
        ).exists():
            print("Submission already exists")
            # 那么更新这个submission
            submission = Submission.objects.get(
                Group=validated_data["Group"], Project=validated_data["Project"]
            )
            submission.SubmissionDemoVideo = validated_data.get(
                "SubmissionDemoVideo", submission.SubmissionDemoVideo
            )

            submission.SubmissionReport = validated_data.get(
                "SubmissionReport", submission.SubmissionReport
            )
            submission.GithubLink = validated_data.get(
                "GithubLink", submission.GithubLink
            )
            submission.save()

            return submission

        return Submission.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # 如果SubmissionDemoVideo存在，删除原来的文件
        if "SubmissionDemoVideo" in validated_data:
            if instance.SubmissionDemoVideo:
                instance.SubmissionDemoVideo.delete(save=False)

            instance.SubmissionDemoVideo = validated_data.get("SubmissionDemoVideo")

        if "SubmissionReport" in validated_data:
            if instance.SubmissionReport:
                instance.SubmissionReport.delete(save=False)

            instance.SubmissionReport = validated_data.get("SubmissionReport")
        instance.GithubLink = validated_data.get("GithubLink", instance.GithubLink)

        instance.save()
        return instance


class SubmissionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "SubmissionDemoVideo",
            "SubmissionReport",
            "GithubLink",
        ]

    def update(self, instance, validated_data):
        if "SubmissionDemoVideo" in validated_data:
            if instance.SubmissionDemoVideo:
                instance.SubmissionDemoVideo.delete(save=False)
            instance.SubmissionDemoVideo = validated_data.get("SubmissionDemoVideo")

        if "SubmissionReport" in validated_data:
            if instance.SubmissionReport:
                instance.SubmissionReport.delete(save=False)
            instance.SubmissionReport = validated_data.get("SubmissionReport")

        instance.GithubLink = validated_data.get("GithubLink", instance.GithubLink)
        instance.save()
        return instance


class GroupSlimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["GroupID", "GroupName"]


class SubmissionFetchSerializer(serializers.ModelSerializer):
    Group = GroupSlimSerializer()
    Project = ProjectSlimSerializer()
    FileNameReport = serializers.SerializerMethodField()
    FileNameDemo = serializers.SerializerMethodField()

    class Meta:
        model = Submission

        fields = [
            "SubmissionID",
            "Group",
            "Project",
            "SubmissionTime",
            "SubmissionDemoVideo",
            "SubmissionReport",
            "GithubLink",
            "SubmitBy",
            "FileNameReport",
            "FileNameDemo",
        ]

    def get_FileNameReport(self, obj):
        if not obj.SubmissionReport:
            return None
        return obj.SubmissionReport.name.split("/")[-1]

    def get_FileNameDemo(self, obj):
        if not obj.SubmissionDemoVideo:
            return None
        return obj.SubmissionDemoVideo.name.split("/")[-1]
