from rest_framework.viewsets import GenericViewSet
from django.http import JsonResponse
from .models import *
from .group_seria import GroupSerializer, GrouPreferencesSerializer
from rest_framework import viewsets, status, mixins
from myapp.views import get_user_friendly_errors

from rest_framework.decorators import action

from .permission import OnlyForAdmin


class GroupsAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [OnlyForAdmin]
    lookup_field = "UserID"

    def get_serializer_class(self):
        dic = {
            'preferences': GrouPreferencesSerializer
        }
        return dic.get(self.action, self.serializer_class)

    # def create(self, request, *args, **kwargs):
    #     serializer = RegisterSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    #     errors = get_user_friendly_errors(serializer.errors)
    #     return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)
    #
    @action(detail=True, methods=['put'], url_path='preferences', url_name='preferences')
    def preferences(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={'UserID': instance.UserID})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # def update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #
    #     serializer = self.get_serializer(instance, data=request.data, context={'UserID': instance.UserID}, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    #     errors = get_user_friendly_errors(serializer.errors)
    #     return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     instance.delete()
    #     return JsonResponse({'message': 'User deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
