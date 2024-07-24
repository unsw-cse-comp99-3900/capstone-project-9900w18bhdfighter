from myapp.src.models.models import Allocation
from rest_framework import serializers


class AllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allocation
        fields = "__all__"

    def validate(self, data):
        return data
