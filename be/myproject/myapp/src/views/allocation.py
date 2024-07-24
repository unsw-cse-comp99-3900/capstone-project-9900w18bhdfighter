from django.http import JsonResponse
from myapp.src.models.models import Allocation, Group, Project
from myapp.src.serializers.allocation import AllocationSerializer
from rest_framework import mixins, status
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
