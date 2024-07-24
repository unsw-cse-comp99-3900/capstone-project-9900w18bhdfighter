from django.http import JsonResponse
from myapp.src.models.models import TimeRule
from myapp.src.serializers.time_rule import TimeRuleSerializer
from rest_framework import mixins, status
from rest_framework.viewsets import GenericViewSet


class TimeRuleAPIView(
    mixins.CreateModelMixin,
    GenericViewSet,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
):
    queryset = TimeRule.objects.all()
    serializer_class = TimeRuleSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return []
        else:
            return []

    def create(self, request, *args, **kwargs):
        serializer = TimeRuleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = TimeRuleSerializer(queryset, many=True)
        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # 如果这个规则active，不能删除
        if instance.IsActive:
            return JsonResponse(
                {"error": "Cannot delete active time rule."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance.delete()
        return JsonResponse(
            {"message": "Time rule deleted successfully!"},
            status=status.HTTP_204_NO_CONTENT,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = TimeRuleSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
