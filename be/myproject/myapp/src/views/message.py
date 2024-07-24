from django.http import JsonResponse
from myapp.src.models.models import Group, GroupMessage, Message
from myapp.src.serializers.msg import GroupMessageSerializer, MessageSerializer
from myapp.src.utils.permission import ForValidToken
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class MessageAPIView(
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy", "list", "mark_as_read"]:
            return [ForValidToken()]
        else:
            return []

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["requesterId"] = self.request.user_id
        return context

    def list(self, request, *args, **kwargs):
        user_id = self.get_serializer_context().get("requesterId")
        # 获取作为发送者或接收者的所有消息
        from django.db.models import Q

        queryset = self.queryset.filter(Q(Sender=user_id) | Q(Receiver=user_id))
        # 将这些消息标记为已读
        # 序列化数据
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["put"], url_path=r"mark-as-read/(?P<receiverId>\d+)")
    def mark_as_read(self, request, receiverId=None):
        user_id = self.get_serializer_context().get("requesterId")
        if receiverId:
            # 获取符合条件的消息
            messages = self.queryset.filter(
                Sender=receiverId, Receiver=user_id, IsRead=False
            )
            # 将消息标记为已读
            updated_count = messages.update(IsRead=True)
            return Response(
                {"message": f"{updated_count} messages marked as read."},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"error": "Invalid receiverId"}, status=status.HTTP_400_BAD_REQUEST
        )


class GroupMessageAPIView(mixins.CreateModelMixin, GenericViewSet):
    queryset = GroupMessage.objects.all()
    serializer_class = GroupMessageSerializer

    def get_permissions(self):
        if self.action in ["list", "mark_as_read", "get_group_contact"]:
            return [ForValidToken()]
        else:
            return []

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["requesterId"] = self.request.user_id
        return context

    def list(self, request, *args, **kwargs):
        user_id = self.request.user_id
        # find all groups that the user is a member
        groups = Group.objects.filter(groupuserslink__UserID=user_id)
        # get all group messages that are sent to these groups
        queryset = GroupMessage.objects.filter(ReceiverGroup__in=groups).distinct()
        serializer = self.serializer_class(queryset, many=True)
        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["put"], url_path=r"mark-as-read/(?P<groupId>\d+)")
    def mark_as_read(self, request, groupId=None):
        user_id = self.get_serializer_context().get("requesterId")
        if groupId:
            # 获取符合条件的消息
            messages = self.queryset.filter(ReceiverGroup=groupId)
            # 将自己加入到readby字段中
            for message in messages:
                message.ReadBy.add(user_id)
            return Response(
                {"message": f"Messages marked as read."}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Invalid groupId"}, status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=["put"], url_path=r"mark-as-read/(?P<groupId>\d+)")
    def mark_as_read(self, request, groupId=None):
        user_id = self.get_serializer_context().get("requesterId")
        if groupId:
            # 获取符合条件的消息
            messages = self.queryset.filter(ReceiverGroup=groupId)

            for message in messages:
                message.ReadBy.add(user_id)
            return Response(
                {"message": f"Messages marked as read."}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Invalid groupId"}, status=status.HTTP_400_BAD_REQUEST
        )
