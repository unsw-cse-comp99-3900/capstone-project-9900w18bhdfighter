from django.http import JsonResponse
from myapp.src.models.models import Allocation, Group, GroupProjectsLink, Project
from myapp.src.serializers.allocation import AllocationSerializer
from myapp.src.utils.notification import GroupNotification
from myapp.src.utils.permission import (
    AfterGroupFormationDeadline,
    ForPartialRole,
    ForValidToken,
)
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet

from ..utils.allocation import launch


class AllocationAPIView(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Allocation.objects.all()
    serializer_class = AllocationSerializer

    def get_permissions(self):

        if self.action in ["approve"]:
            return [
                ForValidToken(),
                ForPartialRole([3, 4, 5]),
                AfterGroupFormationDeadline(),
            ]
        else:
            return []

    def create(self, request, *args, **kwargs):
        # 删除所有的allocation
        Allocation.objects.all().delete()
        # key是project的id，value是group的id的list
        proj_group_list_dict = launch()

        # 存入数据库
        for proj_id, group_list in proj_group_list_dict.items():
            for group_id in group_list:
                proj = Project.objects.get(pk=proj_id)
                group = Group.objects.get(pk=group_id)
                Allocation.objects.create(Project=proj, Group=group)

        return JsonResponse(
            {"message": "Allocation is created"}, status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        allocations = Allocation.objects.select_related("Project", "Group").all()
        results = []
        for allocation in allocations:
            results.append(
                {
                    "allocationId": allocation.AllocationID,
                    "group": {
                        "groupId": allocation.Group.GroupID,
                        "groupName": allocation.Group.GroupName,
                        "groupDesc": allocation.Group.GroupDescription,
                    },
                    "project": {
                        "projectId": allocation.Project.ProjectID,
                        "projectName": allocation.Project.ProjectName,
                        "projectDesc": allocation.Project.ProjectDescription,
                    },
                }
            )
        return JsonResponse(results, safe=False, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="approve", url_name="approve")
    def approve(self, request):
        # 将所有的allocation应用到groupProjectLink
        allocations = Allocation.objects.all()
        # 删除所有的groupProjectLink
        GroupProjectsLink.objects.all().delete()
        for allocation in allocations:
            GroupProjectsLink.objects.create(
                ProjectID=allocation.Project, GroupID=allocation.Group
            )

        # send notification
        sender_id = request.user_id
        # 对于所有被分配的group，给group的所有成员发送通知
        for allocation in allocations:
            receivers = []
            group = allocation.Group
            project = allocation.Project

            group_users = group.GroupMembers.all()
            project_name = project.ProjectName
            for user in group_users:
                receivers.append(user.UserID)
            print(receivers)
            if not receivers:
                continue
            noti = GroupNotification(
                sender_id=sender_id,
                group_id=group.GroupID,
                receivers=receivers,
                msg=f"You are allocated to project {project_name} in group {group.GroupName}",
            )

            noti.save()
            # 删除所有的allocation
        Allocation.objects.all().delete()
        return JsonResponse(
            {"message": "Allocation is approved"}, status=status.HTTP_200_OK
        )

    def update(self, request, pk=None):
        try:
            allocation = Allocation.objects.get(pk=pk)
        except Allocation.DoesNotExist:
            return JsonResponse(
                {"message": "Allocation not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        group_id = data.get("group_id")
        project_id = data.get("project_id")
        if group_id:
            try:
                group = Group.objects.get(pk=group_id)
                allocation.Group = group
            except Group.DoesNotExist:
                return JsonResponse(
                    {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
                )

        if project_id:
            try:
                project = Project.objects.get(pk=project_id)
                allocation.Project = project
            except Project.DoesNotExist:
                return JsonResponse(
                    {"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND
                )

        allocation.save()
        return JsonResponse(
            {"message": "Allocation updated successfully"}, status=status.HTTP_200_OK
        )

    def destroy(self, request, pk=None):
        Allocation.objects.all().delete()
        return JsonResponse(
            {"message": "Allocation rejected"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["delete"], url_path="delete", url_name="delete")
    def delete_one(self, request, pk=None):
        try:
            allocation = Allocation.objects.get(pk=pk)
        except Allocation.DoesNotExist:
            return JsonResponse(
                {"message": "Allocation not found"}, status=status.HTTP_404_NOT_FOUND
            )
        allocation.delete()
        return JsonResponse(
            {"message": "Allocation removed"}, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["post"], url_path="add", url_name="add")
    def add_one(self, request):
        data = request.data
        group_id = data.get("groupId")
        project_id = data.get("projectId")
        if not group_id or not project_id:
            return JsonResponse(
                {"message": "Group ID and Project ID are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return JsonResponse(
                {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            return JsonResponse(
                {"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # if the group exists in the allocation table, delete it
        if Allocation.objects.filter(Group=group).exists():
            Allocation.objects.filter(Group=group).delete()

        Allocation.objects.create(Project=project, Group=group)
        return JsonResponse(
            {"message": "Allocation added successfully"}, status=status.HTTP_201_CREATED
        )
