from django.http import JsonResponse
from myapp.src.models.models import Area, Group, Project, Skill, SkillProject, User
from myapp.src.serializers.proj import ProjectSerializer
from myapp.src.utils.notification import ProjectNotification
from myapp.src.utils.utils import decode_jwt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.views import csrf_exempt


@csrf_exempt
def project_creation(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        token = request.headers.get("Authorization").split()[1]
        result = decode_jwt(token)

        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found."}, status=404)

            if user_data["role"] not in [2, 4, 5]:
                return JsonResponse(
                    {"error": "Permission denied. Cannot create projects."}, status=403
                )
            try:
                project_owner = User.objects.get(EmailAddress=data["ProjectOwner"])
                project_owner_email = project_owner.EmailAddress
            except User.DoesNotExist:
                return JsonResponse({"error": "Project owner not found."}, status=404)

            if project_owner.UserRole not in [2, 4, 5]:
                return JsonResponse(
                    {"error": "Permission denied. Invalid project owner role."},
                    status=403,
                )

            data["ProjectOwner"] = project_owner_email

            serializer = ProjectSerializer(data=data)
            if serializer.is_valid():
                project = serializer.save(CreatedBy=user)
                required_skills = data.get("requiredSkills", [])

                for skill_data in required_skills:
                    interest_area = skill_data.get("area_id")
                    skill = skill_data.get("skill")

                    if not interest_area or not skill:
                        return JsonResponse(
                            {"error": "Area and skill are needed."}, status=400
                        )

                    try:
                        area = Area.objects.get(pk=interest_area)
                    except Area.DoesNotExist:
                        return JsonResponse({"error": "Area not found."}, status=404)

                    skill_object, _ = Skill.objects.get_or_create(
                        SkillName=skill, Area=area
                    )
                    SkillProject.objects.create(Skill=skill_object, Project=project)

                response_data = ProjectSerializer(project).data
                return JsonResponse(response_data, status=201)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({"error": "Invalid or Expired Token"}, status=401)
    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def project_update(request, id):
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)

    if request.method == "PUT":
        data = JSONParser().parse(request)
        token = request.headers.get("Authorization").split()[1]
        result = decode_jwt(token)

        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except User.DoesNotExist:
                return JsonResponse({"error": "Authentication failed"}, status=401)

            if user_data["role"] in [1, 3]:
                return JsonResponse(
                    {"error": "Permission denied. Cannot update projects."}, status=403
                )
            elif user_data["role"] == 2:
                if project.CreatedBy.pk != user.pk:
                    return JsonResponse(
                        {
                            "error": "Permission denied. Clients can only update projects they created."
                        },
                        status=403,
                    )
            elif user_data["role"] in [4, 5]:
                pass
            else:
                return JsonResponse({"error": "Permission denied."}, status=403)

            if user_data["role"] in [4, 5]:
                try:
                    project_owner = User.objects.get(EmailAddress=data["ProjectOwner"])
                    project_owner_email = project_owner.EmailAddress
                except User.DoesNotExist:
                    return JsonResponse(
                        {"error": "Project owner not found."}, status=404
                    )

                if project_owner.UserRole not in [2, 4]:
                    return JsonResponse(
                        {"error": "Permission denied. Invalid project owner role."},
                        status=403,
                    )
                data["ProjectOwner"] = project_owner_email

            elif user_data["role"] == 2:
                if data["ProjectOwner"] != user_data["email"]:
                    return JsonResponse(
                        {
                            "error": "Permission denied. Clients can only set their own email as ProjectOwner."
                        },
                        status=403,
                    )
                data["ProjectOwner"] = user_data["email"]
            data["CreatedBy"] = user_data["user_id"]

            serializer = ProjectSerializer(project, data=data, partial=True)
            skill_objects = []
            if serializer.is_valid():
                serializer.save(CreatedBy=user)
                required_skills = data.get("requiredSkills", [])

                for skill_data in required_skills:
                    interest_area = skill_data.get("area_id")
                    skill_name = skill_data.get("skill")
                    if not interest_area or not skill_name:
                        return JsonResponse(
                            {"error": "Area and skill are needed."}, status=400
                        )

                    try:
                        area = Area.objects.get(pk=interest_area)
                    except Area.DoesNotExist:
                        return JsonResponse({"error": "Area not found."}, status=404)

                    skill = Skill.objects.filter(
                        SkillName=skill_name, Area=area
                    ).first()

                    if not skill:
                        skill_object, _ = Skill.objects.get_or_create(
                            SkillName=skill_name, Area=area
                        )
                        skill_object, _ = Skill.objects.get_or_create(
                            SkillName=skill_name, Area=area
                        )
                    else:
                        skill_object = skill
                        skill_object = skill
                    skill_objects.append(skill_object)

                SkillProject.objects.filter(Project=project).delete()

                for skill_object in skill_objects:
                    SkillProject.objects.create(Skill=skill_object, Project=project)

                # send notification to all group members
                project_name = project.ProjectName
                msg = f"Your participating project {project_name} has been updated"
                sender_id = user_data["user_id"]
                groups = project.Groups.all()
                receivers_id_list = []
                for group in groups:
                    receivers = group.GroupMembers.all()
                    for receiver in receivers:
                        receivers_id_list.append(receiver.UserID)
                project_id = project.ProjectID
                if receivers_id_list:
                    noti = ProjectNotification(
                        msg=msg,
                        sender_id=sender_id,
                        receivers=receivers_id_list,
                        project_id=project_id,
                    )
                    noti.save()

                return JsonResponse(
                    {
                        "message": "Project updated successfully!",
                        "project": serializer.data,
                    },
                    status=200,
                )
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({"error": "Invalid or Expired Token"}, status=401)
    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def project_delete(request, id):
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)

    if request.method == "DELETE":
        token = request.headers.get("Authorization").split()[1]
        result = decode_jwt(token)

        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except User.DoesNotExist:
                return JsonResponse({"error": "Authentication failed"}, status=401)

            response_message = {
                "user_id": user_data["user_id"],
                "role": user_data["role"],
                "project_created_by": project.CreatedBy.pk,
            }
            if user_data["role"] in [1, 3]:
                return JsonResponse(
                    {"error": "Permission denied. Cannot delete projects."}, status=403
                )
            elif user_data["role"] == 2:
                if project.CreatedBy.pk != user.pk:
                    return JsonResponse(
                        {
                            "error": "Permission denied. Clients can only delete projects they created."
                        },
                        status=403,
                    )
            elif user_data["role"] in [4, 5]:
                Project.objects.filter(ProjectID=id).delete()
            else:
                return JsonResponse({"error": "Permission denied."}, status=403)
            return JsonResponse(
                {"message": "Project deleted successfully!"}, status=200
            )

    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def get_projects_list(request):
    if request.method == "GET":
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def get_project_list_creator(request, email):
    if request.method == "GET":
        try:
            user = User.objects.get(EmailAddress=email)
            projects = Project.objects.filter(CreatedBy=user)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def get_project_list_owner(request, email):
    if request.method == "GET":
        try:
            user = User.objects.get(EmailAddress=email)
            projects = Project.objects.filter(ProjectOwner=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def get_project_list_owner_creator(request, creator, owner):
    if request.method == "GET":
        try:
            user_creator = User.objects.get(EmailAddress=creator)
            user_owner = User.objects.get(EmailAddress=owner)
            projects = Project.objects.filter(
                ProjectOwner=user_owner.EmailAddress, CreatedBy=user_creator
            )
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)

        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
def get_project(request, id):
    if request.method == "GET":
        try:
            project = Project.objects.get(pk=id)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=404)

        serializer = ProjectSerializer(project)
        return JsonResponse(serializer.data, safe=False)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@api_view(["GET"])
def autocomplete_projects(request):
    project_name = request.query_params.get("name_substring", None)
    if project_name:
        queryset = Project.objects.filter(ProjectName__icontains=project_name)[:10]
        serializer = ProjectSerializer(queryset, many=True)
        return JsonResponse({"data": serializer.data}, status=status.HTTP_200_OK)
    return JsonResponse(
        {"error": "Project name not provided."}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
def get_projects_by_participant(request, id):
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    groups = Group.objects.filter(groupuserslink__UserID=user)
    projects = Project.objects.filter(Groups__in=groups)
    serializer = ProjectSerializer(projects, many=True)
    return JsonResponse(serializer.data, safe=False)
