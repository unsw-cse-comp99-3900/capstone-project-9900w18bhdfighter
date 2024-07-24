from myapp.src.models.models import GroupMessage, Message
from rest_framework import serializers


class MessageSerializer(serializers.Serializer):
    class Meta:
        model = Message
        fields = ["message"]


class MessageSerializer(serializers.ModelSerializer):
    ChannelId = serializers.SerializerMethodField()

    def get_ChannelId(self, obj):
        if obj.Sender.UserID > obj.Receiver.UserID:
            return f"{obj.Receiver.UserID}_{obj.Sender.UserID}"
        return f"{obj.Sender.UserID}_{obj.Receiver.UserID}"

    class Meta:
        model = Message
        fields = [
            "MessageID",
            "Content",
            "Sender",
            "Receiver",
            "CreatedAt",
            "IsRead",
            "ChannelId",
        ]


class GroupMessageSerializer(serializers.ModelSerializer):
    ChannelId = serializers.SerializerMethodField()

    class Meta:
        model = GroupMessage
        fields = [
            "GroupMessageID",
            "Content",
            "Sender",
            "ReceiverGroup",
            "CreatedAt",
            "ReadBy",
            "ChannelId",
        ]

    def get_ChannelId(self, obj):
        return f"group_{obj.ReceiverGroup.GroupID}"
