from myapp.src.models.models import Contact, Group, GroupMessage, Message, User
from myapp.src.serializers.group_seria import GroupFetchSerializer
from myapp.src.serializers.user import UserSlimSerializer
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied


class ContactSerializer(serializers.ModelSerializer):
    Contact = UserSlimSerializer(read_only=True)
    UnreadMsgsCount = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = ["Contact", "ContactUser", "IsFixed", "ContactID", "UnreadMsgsCount"]

    def get_UnreadMsgsCount(self, obj):
        unread_count = Message.objects.filter(
            Sender=obj.Contact, Receiver=obj.ContactUser, IsRead=False
        ).count()
        return unread_count


class GroupContactSerializer(GroupFetchSerializer):
    UnreadMsgsCount = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = GroupFetchSerializer.Meta.fields + ["UnreadMsgsCount"]

    def get_UnreadMsgsCount(self, obj):
        user_id = self.context.get("requesterId")
        User_obj = User.objects.get(UserID=user_id)
        unread_count = (
            GroupMessage.objects.filter(
                ReceiverGroup=obj,
            )
            .exclude(ReadBy=User_obj)
            .count()
        )

        return unread_count


class ContactCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["Contact", "ContactUser", "IsFixed", "ContactID"]

    def validate(self, data):
        requester_id = self.context.get("requesterId")
        if requester_id != data["ContactUser"].UserID:
            raise PermissionDenied(
                "You do not have permission to create a contact for another user."
            )
        return data

    def create(self, validated_data):
        return Contact.objects.create(**validated_data)


class ContactUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"
        extra_kwargs = {
            "Contact": {"read_only": True},
            "ContactUser": {"read_only": True},
        }

    def validate(self, data):
        requester_id = self.context.get("requesterId")
        # check if the requester is the same as the contact user
        if requester_id != self.instance.ContactUser.UserID:
            raise PermissionDenied(
                "You do not have permission to update a contact for another user."
            )
        return data

    def update(self, instance, validated_data):
        instance.IsFixed = validated_data.get("IsFixed", instance.IsFixed)
        instance.save()
        return instance
