from myapp.src.models.models import Area
from rest_framework import serializers


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ["AreaID", "AreaName"]
