from myapp.src.models.models import Notification, NotificationReceiver, User
from rest_framework import serializers


class NotificationSerializer(serializers.ModelSerializer):
    Receivers = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()),
        write_only=True,
    )

    class Meta:
        model = Notification
        fields = [
            "NotificationID",
            "Type",
            "Message",
            "AdditionalData",
            "CreatedAt",
            "FromGroup",
            "FromUser",
            "Receivers",
        ]

    def validate(self, data):
        if data.get("FromGroup") and data.get("FromUser"):
            raise serializers.ValidationError(
                "A notification can only be from a group or a user, not both."
            )
        return data

    def create(self, validated_data):
        receivers = validated_data.pop("Receivers")
        notification = Notification.objects.create(**validated_data)
        for receiver in receivers:
            NotificationReceiver.objects.create(
                Notification=notification, Receiver=receiver
            )

        return notification


class NotificationFetchSerializer(serializers.ModelSerializer):
    Receivers = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()),
        write_only=True,
    )
    IsRead = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "NotificationID",
            "Type",
            "Message",
            "AdditionalData",
            "CreatedAt",
            "FromGroup",
            "FromUser",
            "Receivers",
            "IsRead",
        ]

    def get_IsRead(self, obj):
        user_id = self.context.get("user_id")
        User_obj = User.objects.get(UserID=user_id)
        notification_receiver = NotificationReceiver.objects.filter(
            Notification=obj, Receiver=User_obj
        ).first()
        if notification_receiver:
            return notification_receiver.IsRead
        return False


class NotificationReceiverSerializer(serializers.ModelSerializer):
    Notification = NotificationSerializer()
    IsRead = serializers.BooleanField(required=True)

    class Meta:
        model = NotificationReceiver
        fields = ["NotificationReceiverID", "Receiver", "Notification", "IsRead"]

    def validate(self, data):
        if "IsRead" not in data:
            raise serializers.ValidationError("IsRead is required.")
        return data

    def update(self, instance, validated_data):
        instance.IsRead = validated_data.get("IsRead", instance.IsRead)
        instance.save()
        return instance
