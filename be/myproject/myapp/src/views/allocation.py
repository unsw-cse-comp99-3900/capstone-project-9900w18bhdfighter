from django.http import JsonResponse
from myapp.src.models.models import Allocation, Group, Project
from myapp.src.serializers.allocation import AllocationSerializer
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

        launch()

        return JsonResponse({"message": "This is the allocation list"})

    @action(detail=False, methods=["get"])
    def get_allocations(self, request):
        allocations = Allocation.objects.select_related("Project", "Group").all()
        results = []
        for allocation in allocations:
            results.append(
                {
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

    @action(detail=False, methods=["post"])
    def approve(self, request):
        Allocation.objects.all().delete()
        return JsonResponse(
            {"message": "All allocations have been cleared upon approval"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["put"])
    def update_allocation(self, request, pk=None):
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
