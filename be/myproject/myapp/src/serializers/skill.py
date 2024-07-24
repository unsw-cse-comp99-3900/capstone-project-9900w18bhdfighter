from myapp.src.models.models import Skill, SkillProject
from myapp.src.serializers.area import AreaSerializer
from rest_framework import serializers


class SkillSerializer(serializers.ModelSerializer):
    Area = AreaSerializer()

    class Meta:
        model = Skill
        fields = ["SkillID", "SkillName", "Area"]


class SkillProjectSerializer(serializers.ModelSerializer):
    Skill = SkillSerializer()

    class Meta:
        model = SkillProject
        fields = ["Skill"]
