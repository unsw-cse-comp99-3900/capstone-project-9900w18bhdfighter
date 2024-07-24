from django.http import JsonResponse
from django.utils import timezone
from myapp.src.models.models import Notification, NotificationReceiver
from myapp.src.serializers.notification import (
    NotificationFetchSerializer,
    NotificationSerializer,
)
from myapp.src.utils.permission import ForValidToken, OnlyForAdmin
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([OnlyForAdmin])
def create_notification(request):
    """
    创建新的通知，发送给指定的用户或群组
    """
    serializer = NotificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([ForValidToken])
def fetch_notifications(request):
    """
    获取指定用户的所有通知。
    """
    user_id = request.user_id
    #  # read_notifications = Notification.objects.filter(notificationreceiver__Receiver_id=user_id, notificationreceiver__IsRead=True).order_by('-CreatedAt')[:10]

    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    # 获取最近三十天通知
    notifications = Notification.objects.filter(
        notificationreceiver__Receiver_id=user_id, CreatedAt__gte=thirty_days_ago
    )

    # 序列化通知
    serializer = NotificationFetchSerializer(
        notifications, many=True, context={"user_id": user_id}
    )
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([ForValidToken])
def update_notification_status(request, notificationId):
    """
    更新通知状态（例如，标记为已读）
    """
    user_id = request.user_id
    # 找出notificationid=notificationId receiver=user_id的通知

    try:
        notification = Notification.objects.get(pk=notificationId)
        notificationReceiver = NotificationReceiver.objects.get(
            Notification=notification, Receiver=user_id
        )
    except NotificationReceiver.DoesNotExist:
        return JsonResponse(
            {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
        )
    try:
        isRead = request.data.get("IsRead")
        notificationReceiver.IsRead = isRead
        notificationReceiver.save()
    except:
        return JsonResponse(
            {"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
        )

    return JsonResponse(
        {"message": "Notification status updated successfully!"},
        status=status.HTTP_200_OK,
    )


@api_view(["DELETE"])
def delete_notification(request, notificationReceiverId):
    """
    删除用户的通知
    """
    try:
        notificationReceiver = NotificationReceiver.objects.get(
            NotificationReceiverID=notificationReceiverId
        )
        notificationReceiver.delete()
    except NotificationReceiver.DoesNotExist:
        return Response(
            {"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND
        )

    return Response(
        {"success": "Notification deleted successfully"}, status=status.HTTP_200_OK
    )
