from django.http import JsonResponse
from myapp.src.models.models import User
from myapp.src.serializers.user import (
    RegisterSerializer,
    UserSlimSerializer,
    UserUpdatePasswdSerializer,
    UserUpdateSerializer,
    UserWithAreaSerializer,
)
from myapp.src.utils.permission import ForValidToken, OnlyForAdmin
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet

from ..utils.utils import decode_jwt, get_user_friendly_errors


class UserAPIView(
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    lookup_field = "UserID"

    def get_permissions(self):
        if self.action in ["create", "destroy", "update_passwd"]:
            return [ForValidToken(), OnlyForAdmin()]
        elif self.action in ["list", "retrieve", "update"]:
            return [ForValidToken()]
        else:
            return []

    def get_serializer_class(self):
        dic = {
            "create": RegisterSerializer,
            "update": UserUpdateSerializer,
            "update_passwd": UserUpdatePasswdSerializer,
        }
        return dic.get(self.action, self.serializer_class)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            token = self.request.headers.get("Authorization").split()[1]
            result = decode_jwt(token)
            if result["status"] == "success":
                context["RequesterID"] = result["data"]["user_id"]
        except Exception as e:
            raise JsonResponse(
                {"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED
            )
        return context

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        errors = get_user_friendly_errors(serializer.errors)

        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["put"], url_path="password", url_name="update-passwd")
    def update_passwd(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True,
            context={"UserID": instance.UserID},
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        context = self.get_serializer_context()
        context["UserID"] = instance.UserID
        serializer = self.get_serializer(
            instance, data=request.data, context=context, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return JsonResponse(
            {"message": "User deleted successfully!"}, status=status.HTTP_204_NO_CONTENT
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = UserWithAreaSerializer(queryset, many=True)

        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False, methods=["get"], url_path="autocomplete", url_name="autocomplete"
    )
    def autocomplete(self, request, *args, **kwargs):
        role = request.query_params.get("role", None)
        email_substring = request.query_params.get("email_substring", None)
        name_substring = request.query_params.get("name_substring", None)
        not_in_group = request.query_params.get("not_in_group", None)
        queryset = self.get_queryset()
        if role:
            queryset = queryset.filter(UserRole=role)
        if email_substring:
            queryset = queryset.filter(EmailAddress__icontains=email_substring)
        if name_substring:
            queryset = queryset.filter(
                FirstName__icontains=name_substring
            ) | queryset.filter(LastName__icontains=name_substring)
        if not_in_group:
            print("not in group")
            queryset = queryset.exclude(groupuserslink__GroupID__isnull=False)

        queryset = queryset[:10]
        serializer = UserSlimSerializer(queryset, many=True)
        return JsonResponse({"data": serializer.data}, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserWithAreaSerializer(instance)
        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
