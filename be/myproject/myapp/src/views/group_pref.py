from click import Group
from myapp.src.models.models import GroupPreference
from myapp.src.serializers.group_seria import (
    GroupPreferenceSerializer,
    GroupUpdatePreferencesSerializer,
    GroupWithPreferencesSerializer,
)
from myapp.src.utils.permission import ForValidToken
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class GroupPreferenceAPIView(GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupWithPreferencesSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy", "update_preferences"]:
            return [ForValidToken()]
        else:
            return []

    @action(detail=True, methods=["put"], url_path="preferences")
    def update_preferences(self, request, pk=None):
        group = self.get_object()
        preferences_data = request.data.get("Preferences", [])
        print("preferences_data", preferences_data)
        # 删除现有的偏好
        GroupPreference.objects.filter(Group=group).delete()

        # 添加新的偏好
        for preference_data in preferences_data:
            preference_serializer = GroupUpdatePreferencesSerializer(
                data=preference_data
            )
            if preference_serializer.is_valid():
                preference_serializer.save(Group=group)
            else:
                return Response(
                    preference_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            {"message": "Preferences updated successfully"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"], url_path="preferences")
    def list_preferences(self, request, pk=None):
        group = self.get_object()

        current_preferences = GroupPreference.objects.filter(Group=group)
        current_preferences_serializer = GroupPreferenceSerializer(
            current_preferences, many=True
        )

        return Response(
            {"Preferences": current_preferences_serializer.data},
            status=status.HTTP_200_OK,
        )
