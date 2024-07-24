from django.http import JsonResponse
from myapp.src.models.models import Contact, Group
from myapp.src.serializers.contact import (
    ContactCreateSerializer,
    ContactSerializer,
    ContactUpdateSerializer,
    GroupContactSerializer,
)
from myapp.src.utils.permission import ForValidToken
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet


class ContactAPIView(
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy", "list", "get_group_contact"]:
            return [ForValidToken()]
        else:
            return []

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["requesterId"] = self.request.user_id
        return context

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = ContactCreateSerializer(
            data=request.data, context=self.get_serializer_context()
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ContactUpdateSerializer(
            instance, data=request.data, context=self.get_serializer_context()
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        requester_id = self.get_serializer_context().get("requesterId")
        # get all contacts of the requester
        contacts = Contact.objects.filter(ContactUser=requester_id)

        serializer = ContactSerializer(contacts, many=True)
        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"], url_path="groups")
    def get_group_contact(self, request, *args, **kwargs):
        user_id = self.request.user_id
        # find all groups that the user is a member
        queryset = Group.objects.filter(groupuserslink__UserID=user_id)
        serializer = GroupContactSerializer(
            queryset, many=True, context=self.get_serializer_context()
        )

        return JsonResponse(
            {
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
