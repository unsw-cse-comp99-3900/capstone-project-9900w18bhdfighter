from myapp.src.models.models import Group, GroupProjectsLink, Submission
from myapp.src.serializers.submission import (
    SubmissionFetchSerializer,
    SubmissionSerializer,
    SubmissionUpdateSerializer,
)
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


class SubmissionViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Submission.objects.all()
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update"]:
            return []
        else:
            return []

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return SubmissionUpdateSerializer
        if self.action in ["retrieve", "list", "group_submissions"]:
            return SubmissionFetchSerializer

        return SubmissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["GET"],
        url_path="groups/(?P<group_id>[^/.]+)",
        url_name="group_submissions",
    )
    def group_submissions(self, request, group_id=None):
        group = Group.objects.get(pk=group_id)

        # 这个group是否有参与project
        try:
            group_project = GroupProjectsLink.objects.get(GroupID=group)
        except GroupProjectsLink.DoesNotExist:
            return Response(
                {"message": "No project for this group"},
                status=status.HTTP_404_NOT_FOUND,
            )
        submission = Submission.objects.filter(Group=group)
        print(submission)
        serializer = self.get_serializer(submission, many=True)
        return Response(serializer.data)
