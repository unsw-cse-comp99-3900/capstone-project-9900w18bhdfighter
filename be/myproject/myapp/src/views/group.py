from django.http import JsonResponse
from myapp.src.models.models import (
    CourseCode,
    Group,
    GroupPreference,
    GroupProjectsLink,
    GroupSkillEvaluation,
    GroupUsersLink,
    Project,
    User,
)
from myapp.src.serializers.group_seria import (
    GroupFetchSerializer,
    GroupPreferenceSerializer,
    GroupSerializer,
    GroupSkillEvaluationSerializer,
    GroupUpdatePreferencesSerializer,
)
from myapp.src.utils.notification import GroupNotification
from myapp.src.utils.utils import decode_jwt
from rest_framework import mixins, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.viewsets import GenericViewSet

from ..utils.permission import (
    ForGroupMemberOrManager,
    ForValidToken,
    GroupRegisterDeadlinePermission,
    OnlyForAdmin,
)


class GroupsAPIView(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = "GroupID"

    def get_serializer_class(self):
        dic = {
            "skills_evaluation": GroupSkillEvaluationSerializer,
            "get_skills_evaluation_by_group": GroupSkillEvaluationSerializer,
        }
        return dic.get(self.action, self.serializer_class)

    def get_permissions(self):
        base = [ForValidToken()]
        if self.action in ["update_preferences"]:
            return base + [ForGroupMemberOrManager(), GroupRegisterDeadlinePermission()]
        elif self.action in [
            "preferences",
            "settings_uri",
            "post_preferences",
            "skill_evaluation",
        ]:
            return base + []
        elif self.action in ["update"]:
            return base + [OnlyForAdmin()]
        else:
            return base + []

    @action(detail=True, methods=["get"], url_path="settings", url_name="settings_uri")
    def settings_uri(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)

    @action(
        detail=True,
        methods=["put"],
        url_path="preferences",
        url_name="post_preferences",
    )
    def update_preferences(self, request, *args, **kwargs):
        instance = self.get_object()
        group_preferences = GroupPreference.objects.filter(Group=instance)

        # Delete existing preferences
        group_preferences.delete()

        # Validate and sort new preferences
        serializer = GroupUpdatePreferencesSerializer(data=request.data, many=True)
        if serializer.is_valid():
            data_list = request.data

            try:
                data_list.sort(key=lambda x: x["Rank"])
            except Exception as e:
                return JsonResponse(
                    {"errors": "Wrong Rank field"}, status=status.HTTP_400_BAD_REQUEST
                )

            # Check for rank uniqueness and correct values
            preferences = []
            for index, item in enumerate(data_list):
                Rank = item.get("Rank")
                if not Rank == index + 1 or not Rank in [1, 2, 3]:
                    return JsonResponse(
                        {"errors": "Rank must be unique and one of 1, 2, or 3"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                preference_id = item.get("Preference")
                project = Project.objects.filter(ProjectID=preference_id).first()
                if not project:
                    return JsonResponse(
                        {"errors": "Project not found"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                preference = GroupPreference.objects.create(
                    Group=instance, Preference=project, Rank=item["Rank"]
                )
                preferences.append(preference)

            # Return the created preferences
            serializer = GroupPreferenceSerializer(preferences, many=True)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)

        else:
            return JsonResponse(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(
        detail=True,
        methods=["put"],
        url_path="preferences/evaluation",
        url_name="skills_evaluation",
    )
    def skills_evaluation(self, request, *args, **kwargs):
        instance = self.get_object()
        user_id = request.user_id

        try:
            role = User.objects.get(pk=user_id).UserRole
        except User.DoesNotExist:
            return JsonResponse(
                {"errors": "User not found"}, status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if the user is a member of the group
        if not instance.GroupMembers.filter(UserID=user_id).exists() and role not in [
            3,
            4,
            5,
        ]:
            return JsonResponse(
                {"errors": "You are not in this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        evaluate_group_id = instance.GroupID
        print(evaluate_group_id)
        print(request.data)
        skill_id = request.data.get("Skill")
        note = request.data.get("Note")
        score = request.data.get("Score")
        try:
            if score < 0 or score > 10:

                raise Exception
        except Exception as e:
            return JsonResponse(
                {"errors": "Score should be a number less than 10 and greater than 1"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the evaluation for the same group and skill already exists
        group_skill_evaluation = GroupSkillEvaluation.objects.filter(
            EvaluateGroup_id=evaluate_group_id, Skill_id=skill_id
        ).first()

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
                "EvaluateGroup": instance.GroupID,
                "Skill": skill_id,
                "Note": note,
                "Score": score,
            }
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

    @action(
        detail=True,
        methods=["get"],
        url_path="preferences/evaluation-group",
        url_name="get_skills_evaluation_by_group",
    )
    def get_skills_evaluation_by_group(self, request, *args, **kwargs):
        instance = self.get_object()
        queryset = GroupSkillEvaluation.objects.filter(EvaluateGroup=instance)
        serializer = GroupSkillEvaluationSerializer(queryset, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)

    @action(
        detail=True,
        methods=["get"],
        url_path="autocomplete-name",
        url_name="autocomplete_groups",
    )
    def autocomplete_groups(self, request, *args, **kwargs):
        print("autocomplete groups")
        group_substring = request.query_params.get("name_substring", None)
        only_groups_with_no_proj = request.query_params.get(
            "only_groups_with_no_proj", None
        )
        queryset = Group.objects.all()
        if only_groups_with_no_proj:
            # Get all groups with no projects
            queryset = GroupProjectsLink.objects.all().values_list("GroupID", flat=True)
            queryset = Group.objects.exclude(GroupID__in=queryset)

        if group_substring:
            queryset = queryset.filter(GroupName__icontains=group_substring)

        # 选取前10个
        queryset = queryset[:10]
        serializer = GroupFetchSerializer(queryset, many=True)
        return JsonResponse({"data": serializer.data}, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializers = GroupFetchSerializer(instance)
        return JsonResponse(serializers.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializers = GroupSerializer(instance, data=request.data, partial=True)
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
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)


@api_view(["POST"])
def group_creation(request):

    data = JSONParser().parse(request)
    token = request.headers.get("Authorization").split()[1]
    result = decode_jwt(token)

    if result["status"] != "success":
        return JsonResponse({"error": "Invalid or Expired Token"}, status=401)

    user_data = result["data"]
    try:
        user = User.objects.get(pk=user_data["user_id"])
    except User.DoesNotExist:
        return JsonResponse({"error": "Authentication failed"}, status=401)

    if user_data["role"] not in [1, 3, 4, 5]:
        return JsonResponse({"error": "Permission denied"}, status=403)

    if Group.objects.filter(GroupName=data["GroupName"]).exists():
        return JsonResponse({"error": "Group name already exists"}, status=400)

    if GroupUsersLink.objects.filter(UserID=user).exists():
        return JsonResponse({"error": "You are already in a group"}, status=400)

    course_id = data.get("CourseCode", None)
    try:
        course_code = CourseCode.objects.get(pk=course_id)
    except CourseCode.DoesNotExist:
        return JsonResponse({"error": "Course code not found"}, status=404)

    data["CourseCode"] = course_code.CourseCodeID
    request.user = user
    serializer = GroupSerializer(data=data, context={"request": request})
    if serializer.is_valid():
        group = serializer.save()
        if user_data["role"] == 1:
            GroupUsersLink.objects.create(GroupID=group, UserID=user)
        return JsonResponse(
            {"message": "Group created successfully!", "group": serializer.data},
            status=201,
        )

    return JsonResponse(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([GroupRegisterDeadlinePermission])
def group_join(request):

    data = JSONParser().parse(request)
    token = request.headers.get("Authorization").split()[1]
    result = decode_jwt(token)

    if result["status"] != "success":
        return JsonResponse({"error": "Invalid or Expired Token"}, status=401)
    user_data = result["data"]
    student_id = data.get("student_id", None)
    try:
        user = User.objects.get(pk=student_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)

    try:
        add_user = User.objects.get(UserID=student_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)

    if user_data["role"] not in [1, 3, 4, 5]:
        return JsonResponse({"error": "Permission denied"}, status=403)

    if user_data["role"] in [1]:
        # 如果学生。只能自己加入
        if user.UserID != add_user.UserID:
            return JsonResponse(
                {"error": "You cannot add other students into a group"}, status=403
            )
        # 如果学生没有courseCode，不能加入
        if not user.CourseCode:
            return JsonResponse(
                {"error": "You need to select a course code before joining a group"},
                status=403,
            )
        # 如果学生和group的courseCode不一样，不能加入
        try:
            group = Group.objects.get(GroupID=data["group_id"])
        except Group.DoesNotExist:
            return JsonResponse({"error": "Group does not exist"}, status=404)
        if user.CourseCode != group.CourseCode:
            return JsonResponse(
                {"error": "Your course code does not match the group course code"},
                status=403,
            )

    try:
        group = Group.objects.get(GroupID=data["group_id"])
    except Group.DoesNotExist:
        return JsonResponse({"error": "Group does not exist"}, status=404)

    if GroupUsersLink.objects.filter(UserID=user).exists():
        return JsonResponse({"error": "Student is already in a group"}, status=400)

    current_group_number = GroupUsersLink.objects.filter(GroupID=group).count()

    if current_group_number < group.MaxMemberNumber:

        # send notification to all other group members
        group_members = group.GroupMembers.all()
        group_name = group.GroupName
        receivers_id_list = []
        for member in group_members:
            receivers_id_list.append(member.UserID)

        msg = f"{user.FirstName} {user.LastName} has joined your group {group_name}"
        sender_id = user.UserID
        group_id = group.GroupID
        if receivers_id_list:
            noti = GroupNotification(
                msg=msg,
                sender_id=sender_id,
                receivers=receivers_id_list,
                group_id=group_id,
            )
            noti.save()
        if not user_data["role"] in [1]:
            # 如果不是学生自己加入的，msg通知当事人
            msg = f"You were added to group {group_name}"
            receivers_id_list = [user.UserID]
            GroupNotification(
                msg=msg,
                sender_id=sender_id,
                receivers=receivers_id_list,
                group_id=group_id,
            ).save()

        GroupUsersLink.objects.create(GroupID=group, UserID=add_user)
        return JsonResponse({"message": "Join group successfully!"}, status=201)
    return JsonResponse({"error": "Group is full"}, status=400)


@api_view(["POST"])
@permission_classes([GroupRegisterDeadlinePermission])
def group_leave(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        token = request.headers.get("Authorization").split()[1]
        result = decode_jwt(token)

        if result["status"] != "success":
            return JsonResponse({"error": "Invalid or Expired Token"}, status=401)

        user_data = result["data"]
        student_id = data.get("student_id", None)

        try:
            user = User.objects.get(pk=student_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)

        try:
            leave_user = User.objects.get(UserID=student_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)

        if user_data["role"] not in [1, 3, 4, 5]:
            return JsonResponse({"error": "Permission denied"}, status=403)

        if user_data["role"] in [1]:
            # 如果学生。只能自己退出
            if user.UserID != leave_user.UserID:
                return JsonResponse(
                    {"error": "You cannot remove other students from a group"},
                    status=403,
                )
        try:
            group = Group.objects.get(GroupID=data["group_id"])
        except Group.DoesNotExist:
            return JsonResponse({"error": "Group does not exist"}, status=404)

        if not GroupUsersLink.objects.filter(UserID=user).exists():
            return JsonResponse({"error": "Student is not in this group"}, status=400)

        GroupUsersLink.objects.filter(GroupID=group, UserID=leave_user).delete()
        # send notification to all left group members
        group_members = group.GroupMembers.all()
        group_name = group.GroupName
        receivers_id_list = []
        for member in group_members:
            receivers_id_list.append(member.UserID)
        msg = f"{user.FirstName} {user.LastName} has left your group {group_name}"
        sender_id = user.UserID
        group_id = group.GroupID
        if receivers_id_list:
            noti = GroupNotification(
                msg=msg,
                sender_id=sender_id,
                receivers=receivers_id_list,
                group_id=group_id,
            )
            noti.save()
        if not user_data["role"] in [1]:
            # 如果不是学生自己退出的，msg通知当事人
            msg = f"You were removed from group {group_name}"
            receivers_id_list = [user.UserID]
            GroupNotification(
                msg=msg,
                sender_id=sender_id,
                receivers=receivers_id_list,
                group_id=group_id,
            ).save()

        return JsonResponse({"message": "Leave group successfully!"}, status=200)

    return JsonResponse({"error": "Invalid request method."}, status=405)


# get group list by project
@api_view(["GET"])
def get_groups_list_by_project(request, id):
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)

    groups = project.Groups.all()
    serializer = GroupFetchSerializer(groups, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
def get_groups_by_participant(request, id):
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    groups = Group.objects.filter(groupuserslink__UserID=user)
    serializer = GroupFetchSerializer(groups, many=True)
    return JsonResponse(serializer.data, safe=False)
