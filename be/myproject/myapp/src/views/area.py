from django.http import JsonResponse
from myapp.src.models.models import Area
from myapp.src.serializers.area import AreaSerializer
from myapp.src.utils.permission import OnlyForAdmin
from myapp.src.utils.utils import get_user_friendly_errors
from rest_framework import mixins, status
from rest_framework.viewsets import GenericViewSet


class AreaAPIView(
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            return [OnlyForAdmin()]
        else:
            return []

    def create(self, request, *args, **kwargs):
        serializer = AreaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AreaSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return JsonResponse(
            {"message": "Area deleted successfully!"}, status=status.HTTP_204_NO_CONTENT
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = AreaSerializer(queryset, many=True)
        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
