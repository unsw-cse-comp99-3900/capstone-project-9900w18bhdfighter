from myapp.src.models.models import TimeRule
from rest_framework import serializers


class TimeRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeRule
        # fields = [TimeNodeID,GroupFreezeTime,ProjectDeadline,IsActive]
        fields = [
            "TimeNodeID",
            "GroupFreezeTime",
            "ProjectDeadline",
            "IsActive",
            "RuleName",
        ]
        extra_kwargs = {"TimeRuleID": {"read_only": True}}
