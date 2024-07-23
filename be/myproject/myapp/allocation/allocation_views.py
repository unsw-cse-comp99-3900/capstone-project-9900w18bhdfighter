from myapp.models import Allocation, Group, Project
from rest_framework import  status, mixins, serializers
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from .allocation import launch
from rest_framework.viewsets import GenericViewSet

class AllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allocation
        fields = "__all__"

    def validate(self, data):
        return data


class AllocationAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    queryset = Allocation.objects.all()
    serializer_class = AllocationSerializer
    
    def create(self, request, *args, **kwargs):
        #删除所有的allocation
        Allocation.objects.all().delete()
        #key是project的id，value是group的id的list
        proj_group_list_dict=launch()
        
        #存入数据库
        for proj_id,group_list in proj_group_list_dict.items():
            for group_id in group_list:
                proj=Project.objects.get(pk=proj_id)
                group=Group.objects.get(pk=group_id)
                Allocation.objects.create(Project=proj,Group=group)
        
        
     
        
        return JsonResponse({"message": "Allocation is created"}, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        
        launch()
        
        return JsonResponse({"message": "This is the allocation list"})