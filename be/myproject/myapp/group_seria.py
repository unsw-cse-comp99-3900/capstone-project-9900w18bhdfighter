from myapp.serializers import SkillSerializer
from rest_framework import serializers
from .models import *


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GrouPostPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        return data

class GroupSkillEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupSkillEvaluation
        fields = ["Note","Score","Skill","EvaluateGroup"]

        
    def validate(self, data):
        #score不能小于1，不能大于10
        if data["Score"] < 1 or data["Score"] > 10:
            raise serializers.ValidationError("Score must be between 1 and 10")
        #只能对自己的组进行评分
        
        return data
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # 删除不需要的字段
        representation.pop('EvaluateGroup', None)
        return representation
class LgwGroupPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPreference
        fields = "__all__"


class GroupUpdatePreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPreference
        fields = ["Rank","Preference"]

    def validate(self, data):
        return data
