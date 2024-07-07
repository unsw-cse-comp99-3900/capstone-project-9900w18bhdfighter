from rest_framework.viewsets import GenericViewSet
from django.http import JsonResponse
from .models import *
from .group_seria import GroupSerializer, GrouPreferencesSerializer, \
    GrouPostPreferenceSerializer, GrouSkillEvaluationPreferenceSerializer, GrouSubmitPreferencesSerializer, \
    GrouSettingsSerializer
from rest_framework import viewsets, status, mixins
from myapp.views import get_user_friendly_errors
from rest_framework.decorators import action
from .permission import OnlyForAdmin, ForValidToken, PartialRole
from .serializers import ProjectSerializer


class GroupsAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin,
                    mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [ForValidToken]
    lookup_field = "GroupID"

    def get_serializer_class(self):
        dic = {
            'preferences': GrouPreferencesSerializer,
            'settings_uri': GrouSettingsSerializer,
            'post_preferences': GrouPostPreferenceSerializer,
            'skill_evaluation': GrouSkillEvaluationPreferenceSerializer,
            'submit_preferences': GrouSubmitPreferencesSerializer,
        }
        return dic.get(self.action, self.serializer_class)

    def get_permissions(self):
        # (1, 'student'), (2, 'client'), (3, 'tut'), (4, 'cord'), (5, 'admin')
        all_role = [tu[0] for tu in User.ROLE_CHOICES]
        dic = {
            "preferences": [3, 4, 5],
            "settings_uri": all_role,
        }
        self.request.permission_range = all_role
        for k, v in dic.items():
            if k in self.action_map.values():
                self.request.permission_range = v
        return [PartialRole()]

    @action(detail=True, methods=['get', 'post'], url_path='preferences', url_name='preferences')
    def preferences(self, request, *args, **kwargs):
        method = request.method.lower()
        if method == "post":
            return self.post_preferences(request, *args, **kwargs)
        instance = self.get_object()
        ProjectIDs = instance.grouppreferenceslink_set.all().values_list("ProjectID", flat=True)
        queryset = Project.objects.filter(ProjectID__in=ProjectIDs)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProjectSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ProjectSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    @action(detail=True, methods=['get'], url_path='settings', url_name='settings_uri')
    def settings_uri(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)

    def post_preferences(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)

    @action(detail=True, methods=['post'], url_path='skill-evaluation', url_name='skill_evaluation')
    def skill_evaluation(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)

    @action(detail=True, methods=['post'], url_path='submit-preferences', url_name='submit_preferences')
    def submit_preferences(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)
