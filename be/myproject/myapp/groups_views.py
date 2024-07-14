from rest_framework.viewsets import GenericViewSet
from django.http import JsonResponse
from .models import *
from . import group_seria
from rest_framework import viewsets, status, mixins
from myapp.views import get_user_friendly_errors
from rest_framework.decorators import action
from .permission import OnlyForAdmin, ForValidToken, PartialRole
from .serializers import *


class GroupsAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin,
                    mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [ForValidToken]
    lookup_field = "GroupID"

    def get_serializer_class(self):
        dic = {
            'preferences': group_seria.GrouPreferencesSerializer,
            'settings_uri': group_seria.GrouSettingsSerializer,
            'post_preferences': group_seria.GrouPostPreferenceSerializer,
            'skill_evaluation': group_seria.GroupSkillEvaluationSerializer,
            'submit_preferences': group_seria.GrouSubmitPreferencesSerializer,
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

    @action(detail=True, methods=['get', 'post', "put", "patch"], url_path='preferences', url_name='preferences')
    def preferences(self, request, *args, **kwargs):
        method = request.method.lower()
        if method == "post":
            return self.post_preferences(request, *args, **kwargs)
        elif method in ["put", "patch"]:
            return self.update_preferences(request, *args, **kwargs)
        instance = self.get_object()
        ProjectIDs = instance.grouppreference_set.all().values_list("Preference_id", flat=True)
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
        data = request.data
        if isinstance(data, dict):
            data["Group"] = instance.GroupID
            data["lock"] = False
            serializer = group_seria.LgwGroupPreferenceSerializer(data=data)
        elif isinstance(data, list):
            for item in data:
                item["Group"] = instance.GroupID
                item["lock"] = False
            serializer = group_seria.LgwGroupPreferenceSerializer(data=data, many=True)
        else:
            return JsonResponse({"errors": "Data structure not supported yet"}, status=status.HTTP_400_BAD_REQUEST)
        ret = serializer.is_valid()
        if ret:
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED, safe=False)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def grouppre_ference_many_update(self,data, instance):
        serializer = group_seria.LgwGroupPreferenceSerializer(data=data, instance=instance, partial=True)
        return serializer

    def update_preferences(self, request, *args, **kwargs):
        lock = kwargs.get("lock", False)
        instance = self.get_object()
        data = request.data
        if isinstance(data, dict):
            if not data.get("PreferenceID"):
                return JsonResponse({"errors": "PreferenceID: Required parameters are missing."},
                                    status=status.HTTP_400_BAD_REQUEST)
            data["Group"] = instance.GroupID
            data["lock"] = lock
            preference_instance = GroupPreference.objects.filter(PreferenceID=data["PreferenceID"]).first()
            if not preference_instance:
                return JsonResponse({"errors": "Preference not found."}, status=status.HTTP_404_NOT_FOUND)
            if preference_instance.lock:
                return JsonResponse({"errors": "This preference is locked by other users."}, status=status.HTTP_403_FORBIDDEN)
            serializer = self.grouppre_ference_many_update(data=data, instance=preference_instance)
            ret = serializer.is_valid()
            if ret:
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            errors = get_user_friendly_errors(serializer.errors)
            return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(data, list):
            for item in data:
                if not item.get("PreferenceID"):
                    return JsonResponse({"errors": "PreferenceID: Required parameters are missing."},
                                        status=status.HTTP_400_BAD_REQUEST)
                item["Group"] = instance.GroupID
                item["lock"] = lock
                preference_instance = GroupPreference.objects.filter(PreferenceID=item.get("PreferenceID")).first()
                if not preference_instance:
                    return JsonResponse({"errors": "Preference not found."}, status=status.HTTP_404_NOT_FOUND)
                if preference_instance.lock:
                    return JsonResponse({"errors": "This preference is locked by other users."},
                                        status=status.HTTP_403_FORBIDDEN)
                serializer = self.grouppre_ference_many_update(data=item, instance=preference_instance)
                ret = serializer.is_valid()
                if not ret:
                    errors = get_user_friendly_errors(serializer.errors)
                    return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
            return JsonResponse({}, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse({"errors": "Data structure not supported yet"}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['post'], url_path='skill-evaluation', url_name='skill_evaluation')
    def skill_evaluation(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        data = request.data
        groupUser_id = GroupUsersLink.objects.filter(GroupID_id=instance.id, UserID_id=user.id).first()
        data["groupUser_id"] = groupUser_id
        serializer = group_seria.GroupSkillEvaluationSerializer(data=request.data)
        ret = serializer.is_valid()
        if ret:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='preferences/submit', url_name='submit_preferences')
    def submit_preferences(self, request, *args, **kwargs):
        kwargs["lock"]= True
        return self.update_preferences(request, *args, **kwargs)
