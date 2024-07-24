import json

import jwt
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from myapp.src.models.models import User
from rest_framework.decorators import api_view
from rest_framework.exceptions import JsonResponse

from myproject import settings


@api_view(["POST"])
def student_signup(request):
    try:
        data = json.loads(request.body)
        first_name = data.get("FirstName")
        last_name = data.get("LastName")
        email = data.get("EmailAddress")
        password = data.get("Passwd")

        if not first_name or not last_name or not email or not password:
            return JsonResponse(
                {
                    "error": "FirstName, LastName, EmailAddress, and Passwd are required."
                },
                status=400,
            )

        if User.objects.filter(EmailAddress=email).exists():
            return JsonResponse({"error": "Email already exists."}, status=400)

        user = User.objects.create(
            FirstName=first_name,
            LastName=last_name,
            EmailAddress=email,
            Passwd=make_password(password),
            UserRole=1,
            UserInformation="",
        )

        token = jwt.encode(
            {
                "user_id": user.pk,
                "role": user.UserRole,
                "first_name": user.FirstName,
                "last_name": user.LastName,
                "email": user.EmailAddress,
                "exp": timezone.now() + timezone.timedelta(days=7),
                # Token expires in 24 * 7 hours
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        return JsonResponse(
            {
                "token": token,
                "user": {
                    "UserID": user.pk,
                    "FirstName": user.FirstName,
                    "LastName": user.LastName,
                    "EmailAddress": user.EmailAddress,
                    "role": user.UserRole,
                    "description": user.UserInformation,
                    "interestAreas": [],
                    "courseCode": None,
                },
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)


@api_view(["POST"])
def student_login(request):
    try:
        data = json.loads(request.body)
        email = data.get("EmailAddress")
        password = data.get("Passwd")
        if not email or not password:
            return JsonResponse(
                {"error": "Email and password are required."}, status=400
            )

        try:
            user = User.objects.get(EmailAddress=email)
            if check_password(password, user.Passwd):
                token = jwt.encode(
                    {
                        "user_id": user.pk,
                        "role": user.UserRole,
                        "first_name": user.FirstName,
                        "last_name": user.LastName,
                        "email": user.EmailAddress,
                        "exp": timezone.now() + timezone.timedelta(days=7),
                    },
                    settings.SECRET_KEY,
                    algorithm="HS256",
                )

                try:
                    course_code = user.CourseCode
                    course_code = {
                        "id": course_code.CourseCodeID,
                        "courseName": course_code.CourseName,
                    }
                except:
                    course_code = None

                response_data = {
                    "user_profile": {
                        "UserID": user.pk,
                        "FirstName": user.FirstName,
                        "LastName": user.LastName,
                        "EmailAddress": user.EmailAddress,
                        "role": user.UserRole,
                        "description": user.UserInformation,
                        "interestAreas": [],
                        "courseCode": course_code,
                    },
                    "token": token,
                }
                return JsonResponse(response_data, status=200)
            else:
                if not User.objects.filter(EmailAddress=email).exists():
                    return JsonResponse({"error": "E-mail not found."}, status=404)
                else:
                    return JsonResponse(
                        {"error": "Incorrect password. Please try again."},
                        status=400,
                    )
        except User.DoesNotExist:
            return JsonResponse({"error": "Email not found."}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
