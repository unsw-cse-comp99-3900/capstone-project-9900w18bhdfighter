from rest_framework.viewsets import GenericViewSet
from django.http import JsonResponse
from .models import *
from . import group_seria
from rest_framework import viewsets, status, mixins
from myapp.views import get_user_friendly_errors
from rest_framework.decorators import action
from .permission import ForGroupMemberOrManager, ForValidToken, OnlyForAdmin, PartialRole
from .serializers import *


class GroupsAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin,
                    mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = "GroupID"

    def get_serializer_class(self):
        dic = {
            'settings_uri': group_seria.GrouSettingsSerializer,
            'skills_evaluation': group_seria.GroupSkillEvaluationSerializer,
            'get_skills_evaluation_by_group': group_seria.GroupSkillEvaluationSerializer,
        }
        return dic.get(self.action, self.serializer_class)
    
    def get_permissions(self):
        base=[ForValidToken()]
        if self.action in ['submit_preferences','update_preferences']:
            return base+[ForGroupMemberOrManager()]
        elif self.action in ['preferences','settings_uri','post_preferences','skill_evaluation']:
            return base+[]
        elif self.action in ['update']:
            return base+[OnlyForAdmin()]
        else:
            return base+[]


    @action(detail=True, methods=['get'], url_path='settings', url_name='settings_uri')
    def settings_uri(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)

    
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
    
    @action(detail=True, methods=['put'], url_path='preferences/evaluation', url_name='skills_evaluation')
    def skills_evaluation(self, request, *args, **kwargs):
        instance = self.get_object()
        user_id = request.user_id

        try:
            role = User.objects.get(pk=user_id).UserRole
        except User.DoesNotExist:
            return JsonResponse({"errors": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)        
        
        # Check if the user is a member of the group
        if not instance.GroupMembers.filter(UserID=user_id).exists() and role not in [3, 4, 5]:
            return JsonResponse({"errors": "You are not in this group"}, status=status.HTTP_400_BAD_REQUEST)
        
        evaluate_group_id = instance.GroupID
        print(evaluate_group_id)
        print(request.data)
        skill_id = request.data.get('Skill')
        note = request.data.get('Note')
        score = request.data.get('Score')
        try:
            if score <0 or score >10:

                raise Exception
        except Exception as e:
            return JsonResponse({"errors": "Score should be a number less than 10 and greater than 1"}, status=status.HTTP_400_BAD_REQUEST)

        
        
        # Check if the evaluation for the same group and skill already exists
        group_skill_evaluation = GroupSkillEvaluation.objects.filter(EvaluateGroup_id=evaluate_group_id, Skill_id=skill_id).first()

        if group_skill_evaluation:
            # Update existing evaluation
            group_skill_evaluation.Note = note
            group_skill_evaluation.Score = score
            group_skill_evaluation.save()
            serializer = self.get_serializer(group_skill_evaluation)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create new evaluation
            
            data = {
                'EvaluateGroup': instance.GroupID,
                'Skill': skill_id,
                'Note': note,
                'Score': score,
            }
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['get'], url_path='preferences/evaluation-group', url_name='get_skills_evaluation_by_group')
    def get_skills_evaluation_by_group(self, request, *args, **kwargs):
        instance = self.get_object()
        queryset = GroupSkillEvaluation.objects.filter(EvaluateGroup=instance)
        serializer = group_seria.GroupSkillEvaluationSerializer(queryset, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)


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
        only_groups_with_no_proj = request.query_params.get('only_groups_with_no_proj', None)
        queryset = Group.objects.all()
        if only_groups_with_no_proj:
            # Get all groups with no projects
            queryset = GroupProjectsLink.objects.all().values_list('GroupID', flat=True)
            queryset = Group.objects.exclude(GroupID__in=queryset)
        
        if group_substring:
            queryset = queryset.filter(GroupName__icontains=group_substring)
            
        #选取前10个
        queryset = queryset[:10]
        serializer = GroupFetchSerializer(queryset, many=True)
        return JsonResponse({'data': serializer.data}, status=status.HTTP_200_OK)
    

    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializers=GroupFetchSerializer(instance)
        return JsonResponse(serializers.data, status=status.HTTP_200_OK)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializers=GroupSerializer(instance,data=request.data,partial=True)
        if serializers.is_valid():
            serializers.save()
            return JsonResponse(serializers.data, status=status.HTTP_200_OK)
        return JsonResponse(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return JsonResponse({"success": "Group deleted"}, status=status.HTTP_200_OK)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = GroupFetchSerializer(queryset, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK,safe=False)
    