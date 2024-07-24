import json

from django.db import transaction
from myapp.src.models.models import Notification, User
from rest_framework import serializers


def save_notification(
    type: str,
    msg: str,
    sender_id: int,
    receivers: list[int],
    additional_data: dict = None,
):
    print("type", type)
    print("msg", msg)
    print("sender_id", sender_id)
    print("receivers", receivers)
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
            AdditionalData=json.dumps(additional_data) if additional_data else None,
        )
        notification.Receivers.add(*receivers)

    return notification


class BaseNotification:
    def __init__(self, sender_id: int, receivers: list[int], msg: str = ""):
        self.sender_id = sender_id
        self.receivers = receivers
        self.msg = msg


class GroupNotification(BaseNotification):
    def __init__(
        self, sender_id: int, group_id: int, msg: str = "", receivers: list[int] = []
    ):
        self.group_id = group_id
        super().__init__(sender_id, receivers, msg)

    def save(self):
        return save_notification(
            "group",
            self.msg,
            self.sender_id,
            self.receivers,
            {"ObjectID": self.group_id},
        )


class ProjectNotification(BaseNotification):
    def __init__(
        self, sender_id: int, project_id: int, msg: str = "", receivers: list[int] = []
    ):
        self.project_id = project_id
        super().__init__(sender_id, receivers, msg)

    def save(self):
        return save_notification(
            "project",
            self.msg,
            self.sender_id,
            self.receivers,
            {"ObjectID": self.project_id},
        )


class PersonalNotification(BaseNotification):
    def __init__(self, sender_id: int, msg: str = "", receivers: list[int] = []):
        super().__init__(sender_id, receivers, msg)

    def save(self):
        return save_notification("personal", self.msg, self.sender_id, self.receivers)
