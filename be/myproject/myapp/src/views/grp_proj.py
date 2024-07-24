from django.http import JsonResponse
from myapp.src.models.models import Group, GroupProjectsLink, Project
from myapp.src.serializers.grp_proj import GroupProjectLinkSerializer
from myapp.src.utils.notification import GroupNotification, ProjectNotification
from myapp.src.utils.permission import ForPartialRole, ForValidToken
from rest_framework import mixins, status
from rest_framework.viewsets import GenericViewSet


class GroupProjectsLinkAPIView(
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    queryset = GroupProjectsLink.objects.all()
    serializer_class = GroupProjectLinkSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [ForValidToken(), ForPartialRole([3, 4, 5])]
        else:
            return []

    def create(self, request, *args, **kwargs):
        try:
            project_id = request.data.get("ProjectID")
            group_id = request.data.get("GroupID")
            if GroupProjectsLink.objects.filter(
                ProjectID=project_id, GroupID=group_id
            ).exists():
                return JsonResponse(
                    {"error": "Group already exists in this Project."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # 如果这个组已经有了项目，返回错误
            if GroupProjectsLink.objects.filter(GroupID=group_id).exists():
                return JsonResponse(
                    {"error": "Group already has a project."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except:
            return JsonResponse(
                {"error": "Invalid data."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = GroupProjectLinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            project_name = Project.objects.get(ProjectID=project_id).ProjectName
            # 通知组内成员
            msg = f"Your group has been added to the project {project_name}"
            sender_id = self.request.user_id
            receivers_id_list = Group.objects.get(
                GroupID=group_id
            ).groupuserslink_set.values_list("UserID", flat=True)
            project_id = project_id
            noti = ProjectNotification(
                msg=msg,
                sender_id=sender_id,
                receivers=receivers_id_list,
                project_id=project_id,
            )
            noti.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        project_id = kwargs.get("projectID")
        group_id = kwargs.get("groupID")
        try:
            instance = GroupProjectsLink.objects.get(
                ProjectID=project_id, GroupID=group_id
            )
            instance.delete()
            group_name = Group.objects.get(GroupID=group_id).GroupName
            project_name = Project.objects.get(ProjectID=project_id).ProjectName
            msg = f"Your group {group_name} has been removed from the project {project_name}"
            sender_id = self.request.user_id
            receivers_id_list = Group.objects.get(
                GroupID=group_id
            ).groupuserslink_set.values_list("UserID", flat=True)
            group_id = group_id
            noti = GroupNotification(
                msg=msg,
                sender_id=sender_id,
                receivers=receivers_id_list,
                group_id=group_id,
            )
            noti.save()
            return JsonResponse(
                {"message": "Group project link deleted successfully!"},
                status=status.HTTP_200_OK,
            )
        except GroupProjectsLink.DoesNotExist:
            return JsonResponse(
                {"error": "Group project link not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = GroupProjectLinkSerializer(queryset, many=True)
        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
