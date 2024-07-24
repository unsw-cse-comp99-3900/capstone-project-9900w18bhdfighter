from myapp.src.models.models import GroupProjectsLink
from rest_framework import serializers


class GroupProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupProjectsLink
        fields = ["GroupID", "ProjectID", "GroupProjectsLinkID"]
