

from myapp.models import Notification, User
from rest_framework import serializers
from django.db import transaction
from rest_framework import serializers

def save_notification(type: str, msg: str, sender_id: int, receivers: list[int]):
    try:
        sender = User.objects.get(UserID=sender_id)
    except User.DoesNotExist:
        raise serializers.ValidationError("Sender does not exist")

    receivers = User.objects.filter(UserID__in=receivers)
    if not receivers.exists():
        raise serializers.ValidationError("One or more receivers do not exist")

    with transaction.atomic():
        notification = Notification.objects.create(
            Type=type,
            Message=msg,
            FromUser=sender,
        )
        notification.Receivers.add(*receivers)

    return notification