from rest_framework.viewsets import GenericViewSet
from django.http import JsonResponse
from .models import *
from . import group_seria
from rest_framework import viewsets, status, mixins
from myapp.views import get_user_friendly_errors
from rest_framework.decorators import action
from .permission import ForGroupMemberOrManager, ForValidToken, PartialRole
from .serializers import *


class GroupsAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin,
                    mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = "GroupID"

    def get_serializer_class(self):
        dic = {
            'settings_uri': group_seria.GrouSettingsSerializer,
            'skill_evaluation': group_seria.GroupSkillEvaluationSerializer,
        }
        return dic.get(self.action, self.serializer_class)
    
    def get_permissions(self):
        base=[ForValidToken()]
        if self.action in ['submit_preferences','update_preferences']:
            return base+[ForGroupMemberOrManager()]
        elif self.action in ['preferences','settings_uri','post_preferences','skill_evaluation']:
            return base+[]
        else:
            return base+[]


    @action(detail=True, methods=['get'], url_path='settings', url_name='settings_uri')
    def settings_uri(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


    def grouppre_ference_many_update(self,data, instance):
        serializer = group_seria.LgwGroupPreferenceSerializer(data=data, instance=instance, partial=True)
        return serializer
    @action(detail=True, methods=['put'], url_path='preferences', url_name='post_preferences')
    def update_preferences(self, request, *args, **kwargs):
        instance = self.get_object()
        group_preferences = GroupPreference.objects.filter(Group=instance)

        # Check if any preferences are locked
        for item in group_preferences:
            if item.Lock:
                return JsonResponse({"errors": "Preferences are locked"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete existing preferences
        group_preferences.delete()

        # Validate and sort new preferences
        serializer = group_seria.GroupUpdatePreferencesSerializer(data=request.data, many=True)
        if serializer.is_valid():
            data_list = request.data

            try:
                data_list.sort(key=lambda x: x['Rank'])
            except Exception as e:
                return JsonResponse({"errors": "Wrong Rank field"}, status=status.HTTP_400_BAD_REQUEST)

            # Check for rank uniqueness and correct values
            preferences = []
            for index,item in enumerate(data_list):
                Rank = item.get("Rank")
                if not Rank==index+1 or not Rank in [1, 2, 3]:
                    return JsonResponse({"errors": "Rank must be unique and one of 1, 2, or 3"}, status=status.HTTP_400_BAD_REQUEST)
                preference_id = item.get("Preference")
                project = Project.objects.filter(ProjectID=preference_id ).first()
                if not project:
                    return JsonResponse({"errors": "Project not found"}, status=status.HTTP_400_BAD_REQUEST)
                preference = GroupPreference.objects.create(Group=instance, Preference=project, Rank=item["Rank"], Lock=False)
                preferences.append(preference)

            # Return the created preferences
            serializer = group_seria.LgwGroupPreferenceSerializer(preferences, many=True)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)

        else:
            return JsonResponse({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
        group_preferences = GroupPreference.objects.filter(Group_id=self.get_object().GroupID)
        for item in group_preferences:
            item.Lock = True
            item.save()

        serializers = group_seria.LgwGroupPreferenceSerializer(group_preferences, many=True)
        return JsonResponse(serializers.data, status=status.HTTP_200_OK,safe=False)
        
    @action(detail=True, methods=['get'], url_path='autocomplete-name', url_name='autocomplete_groups')
    def autocomplete_groups(self,request, *args, **kwargs):
        print("autocomplete groups")
        group_substring = request.query_params.get('name_substring', None)
        if group_substring:
            queryset = Group.objects.filter(GroupName__icontains=group_substring)
            #选取前10个
            queryset = queryset[:10]
            serializer = GroupFetchSerializer(queryset, many=True)
            return JsonResponse({'data': serializer.data}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'Group substring not provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializers=GroupFetchSerializer(instance)
        return JsonResponse(serializers.data, status=status.HTTP_200_OK)
    