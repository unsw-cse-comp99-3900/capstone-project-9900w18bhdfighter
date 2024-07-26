from myapp.src.models.models import Group
from myapp.src.serializers.group_score import (
    GroupAssessmentCreateSerializer,
    GroupAssessmentFetchSerializer,
)
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class GroupAssessmentViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Group.objects.all()
    serializer_class = GroupAssessmentFetchSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return GroupAssessmentCreateSerializer
        return GroupAssessmentFetchSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
