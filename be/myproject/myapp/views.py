
from django.contrib.auth.hashers import make_password
from django.shortcuts import render, HttpResponse
from rest_framework import status
from rest_framework import  status, mixins
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from .models import Contact, Group, GroupMessage, GroupPreference, Skill, SkillProject, User, StudentArea, Notification, \
    NotificationReceiver, GroupUsersLink
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
import json
import datetime
from django.conf import settings
from rest_framework.response import Response
from .models import User as UserProfile, User
from .models import User,Message
from .models import Project
from .permission import OnlyForAdmin,ForValidToken
from .serializers import ContactCreateSerializer, ContactSerializer, ContactUpdateSerializer, GroupMessageSerializer, \
    GroupPreferenceSerializer, GroupPreferenceUpdateSerializer, GroupSerializer, GroupWithPreferencesSerializer, MessageSerializer, \
    ProjectSerializer, UserSlimSerializer, UserWithAreaSerializer, NotificationSerializer
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
import jwt
from .serializers import ProjectSerializer, RegisterSerializer, UserUpdatePasswdSerializer
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
import logging
# from .utils import generate_auth_token 


# def generate_auth_token(user):
#     token, created = Token.objects.get_or_create(user=user)
#     return token.key

def decode_jwt(token):
    try:
        # Decode the token
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return {'status': 'success', 'data': decoded}
    except jwt.ExpiredSignatureError:
        # Token has expired
        return {'status': 'error', 'error_message': 'Token has expired.'}
    except jwt.InvalidTokenError:
        # Token is invalid
        return {'status': 'error', 'error_message': 'Invalid token.'}


# Usage example
def some_view_function(request):
    token = request.headers.get('Authorization').split()[1]  # Assuming token is sent as "Bearer <token>"
    result = decode_jwt(token)

    if result['status'] == 'success':
        # Perform actions based on the decoded data
        user_data = result['data']
        # Here you can access user_data and perform further actions or queries
        return JsonResponse({'message': 'Authenticated successfully.', 'user': user_data}, status=200)
    else:
        # Handle error scenario
        return JsonResponse({'error': result['error_message']}, status=401)


############################################################################################
#                                    Student Sign up                                       #
############################################################################################
@csrf_exempt
def student_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('FirstName')
            last_name = data.get('LastName')
            email = data.get('EmailAddress')
            password = data.get('Passwd')

            if not first_name or not last_name or not email or not password:
                return JsonResponse({'error': 'FirstName, LastName, EmailAddress, and Passwd are required.'},
                                    status=400)

            if User.objects.filter(EmailAddress=email).exists():
                return JsonResponse({'error': 'Email already exists.'}, status=400)

            user = User.objects.create(
                FirstName=first_name,
                LastName=last_name,
                EmailAddress=email,
                Passwd=make_password(password),
                UserRole=1,
                UserInformation=''
            )

            token = jwt.encode({
                'user_id': user.pk,
                'role': user.UserRole,
                'first_name': user.FirstName,
                'last_name': user.LastName,
                'email': user.EmailAddress,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7)  # Token expires in 24 * 7 hours
            }, settings.SECRET_KEY, algorithm='HS256')

            return JsonResponse({
                'token': token,
                'user': {
                    'UserID': user.pk,
                    'FirstName': user.FirstName,
                    'LastName': user.LastName,
                    'EmailAddress': user.EmailAddress,
                    'role': user.UserRole,
                    'description': user.UserInformation,
                    'interestAreas': []
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)


############################################################################################
#                                    Student Login                                         #
############################################################################################

@csrf_exempt
def student_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('EmailAddress')
            password = data.get('Passwd')
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)

            try:
                user = User.objects.get(EmailAddress=email)
                if check_password(password, user.Passwd):
                    token = jwt.encode({
                        'user_id': user.pk,
                        'role': user.UserRole,
                        'first_name': user.FirstName,
                        'last_name': user.LastName,
                        'email': user.EmailAddress,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7)
                        # Token expires in 24 * 7 hours
                    }, settings.SECRET_KEY, algorithm='HS256')

                    response_data = {
                        'user_profile': {
                            'UserID': user.pk,
                            'FirstName': user.FirstName,
                            'LastName': user.LastName,
                            'EmailAddress': user.EmailAddress,
                            'role': user.UserRole,
                            'description': user.UserInformation,
                            'interestAreas': []

                        },
                        'token': token
                    }
                    return JsonResponse(response_data, status=200)
                else:
                    if not User.objects.filter(EmailAddress=email).exists():
                        return JsonResponse({'error': 'E-mail not found.'}, status=404)
                    else:
                        return JsonResponse({'error': 'Incorrect password. Please try again.'}, status=401)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Email not found.'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)


############################################################################################
#                                    Project Creation                                      #
############################################################################################

@csrf_exempt
def project_creation(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] == 'success':
            user_data = result['data']
            try:
                user = User.objects.get(pk=user_data['user_id'])
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found.'}, status=404)
            
            if user_data['role'] in [2, 4, 5]:
                try:
                    project_owner = User.objects.get(EmailAddress=data['ProjectOwner'])
                    project_owner_email = project_owner.EmailAddress
                except User.DoesNotExist:
                    return JsonResponse({'error': 'Project owner not found.'}, status=404)
            else:
                return JsonResponse({'error': 'Permission denied. Cannot create projects.'}, status=403)
                
            data['ProjectOwner'] = project_owner_email  

            serializer = ProjectSerializer(data=data)
            if serializer.is_valid():
                project = serializer.save(CreatedBy=user)
                required_skills = data.get('requiredSkills', [])

                for skill_data in required_skills:
                    interest_area = skill_data.get('area_id')
                    skill = skill_data.get('skill')

                    if not interest_area or not skill:
                        return JsonResponse({'error': 'Area and skill are needed.'}, status=400)
                    
                    try:
                        area = Area.objects.get(pk=interest_area)
                    except Area.DoesNotExist:
                        return JsonResponse({'error': 'Area not found.'}, status=404)
                    
                    skill_object, _ = Skill.objects.get_or_create(SkillName=skill, defaults={'Area': area})
                    SkillProject.objects.create(Skill=skill_object, Project=project)

                response_data = ProjectSerializer(project).data
                return JsonResponse(response_data, status=201)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

############################################################################################
#                                    Project Updating                                      #
############################################################################################

@csrf_exempt
def project_update(request, id):
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)

    if request.method == 'PUT':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] == 'success':
            user_data = result['data']
            try:
                user = User.objects.get(pk=user_data['user_id'])
            except User.DoesNotExist:
                return JsonResponse({'error': 'Authentication failed'}, status=401)
            
            if user_data['role'] in [1, 3]:
                return JsonResponse({'error': 'Permission denied. Cannot update projects.'}, status=403)
            elif user_data['role'] == 2:
                if project.CreatedBy.pk != user.pk:
                    return JsonResponse({'error': 'Permission denied. Clients can only update projects they created.'}, status=403)
            elif user_data['role'] in [4, 5]:
                pass
            else:
                return JsonResponse({'error': 'Permission denied.'}, status=403)

            if user_data['role'] in [4, 5]:
                try:
                    project_owner = User.objects.get(EmailAddress=data['ProjectOwner'])
                    project_owner_email = project_owner.EmailAddress
                except User.DoesNotExist:
                    return JsonResponse({'error': 'Project owner not found.'}, status=404)
                data['ProjectOwner'] = project_owner_email  
            elif user_data['role'] == 2:
                if data['ProjectOwner'] != user_data['email']:
                    return JsonResponse({'error': 'Permission denied. Clients can only set their own email as ProjectOwner.'}, status=403)
                data['ProjectOwner'] = user_data['email']

            serializer = ProjectSerializer(project, data=data, partial=True)
            if serializer.is_valid():
                serializer.save(CreatedBy=user)
                return JsonResponse({'message': 'Project updated successfully!', 'project': serializer.data}, status=200)
            return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


############################################################################################
#                                     Group Creation                                       #
############################################################################################

@csrf_exempt
def group_creation(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] != 'success':
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)

        user_data = result['data']
        try:
            user = User.objects.get(pk=user_data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'Authentication failed'}, status=401)

        if user_data['role'] not in [1, 3, 4, 5]:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        if Group.objects.filter(GroupName=data['GroupName']).exists():
            return JsonResponse({'error': 'Group name already exists'}, status=400)

        if GroupUsersLink.objects.filter(UserID=user).exists():
            return JsonResponse({'error': 'You are already in a group'}, status=400)

        serializer = GroupSerializer(data=data)
        if serializer.is_valid():
            try:
                group = serializer.save(CreatedBy=user)
                
                if user_data['role'] == 1:
                    GroupUsersLink.objects.create(GroupID=group, UserID=user)
                
                return JsonResponse({'message': 'Group created successfully!', 'group': serializer.data}, status=201)
            except Exception as e:
                return JsonResponse({'error': 'Error creating group. Please try again.'}, status=500)
        return JsonResponse(serializer.errors, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


############################################################################################
#                                     Group Operation                                      #
############################################################################################

# Join Group 
@csrf_exempt
def group_join(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] != 'success':
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)

        user_data = result['data']
        try:
            user = User.objects.get(pk=user_data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'Authentication failed'}, status=401)

        try:
            add_user = User.objects.get(UserID=data['student_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)
            
        if user_data['role'] not in [1, 3, 4, 5]:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        try:
            group = Group.objects.get(GroupID=data['group_id'])
        except Group.DoesNotExist:
            return JsonResponse({'error': 'Group does not exist'}, status=404)

        if GroupUsersLink.objects.filter(UserID=user).exists():
            return JsonResponse({'error': 'Student is already in a group'}, status=400)

        current_group_number = GroupUsersLink.objects.filter(GroupID=group).count()

        if current_group_number >= group.MaxMemberNumber:
            if user.UserRole in [3, 4, 5]:
                GroupUsersLink.objects.create(GroupID=group, UserID=add_user)
                return JsonResponse({'message': 'Added student to full group successfully!'}, status=201)
            return JsonResponse({'error': 'Group is full'}, status=400)
        else:
            if user_data['role'] == 1:
                if user == add_user:
                    GroupUsersLink.objects.create(GroupID=group, UserID=user)
                    return JsonResponse({'message': 'Joined group successfully!'}, status=201)
                else:
                    return JsonResponse({'error': 'You cannot add other students into a group'}, status=403)
            return JsonResponse({'error': 'You cannot join a group'}, status=403)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

# Leave Group
@csrf_exempt
def group_leave(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] != 'success':
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)

        user_data = result['data']
        try:
            user = User.objects.get(pk=user_data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'Authentication failed'}, status=401)

        try:
            leave_user = User.objects.get(UserID=data['student_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)
            
        if user_data['role'] not in [1, 3, 4, 5]:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        try:
            group = Group.objects.get(GroupID=data['group_id'])
        except Group.DoesNotExist:
            return JsonResponse({'error': 'Group does not exist'}, status=404)

        if not GroupUsersLink.objects.filter(UserID=user).exists():
            return JsonResponse({'error': 'Student is not in this group'}, status=400)

        current_group_number = GroupUsersLink.objects.filter(GroupID=group).count()

        if user.UserRole in [3, 4, 5]:
            if current_group_number > 0:
                GroupUsersLink.objects.filter(GroupID=group, UserID=leave_user).delete()
                return JsonResponse({'message': 'Deleted user from the group successfully!'}, status=201)
            return JsonResponse({'error': 'Group is empty'}, status=400)
    
        if user_data['role'] == 1:
            if current_group_number > 1:
                if user == leave_user:
                    GroupUsersLink.objects.filter(GroupID=group, UserID=user).delete()
                    return JsonResponse({'message': 'Left group successfully!'}, status=201)
                else:
                    return JsonResponse({'error': 'You cannot remove other students from the group'}, status=403)
            return JsonResponse({'error': 'You are the last student in the group'}, status=403)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

############################################################################################
#                                     Get project list                                     #
############################################################################################

@csrf_exempt
def get_projects_list(request):
    if request.method == 'GET':
        
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)

        project_data = serializer.data

        for project in project_data:
            user = User.objects.get(EmailAddress=project['ProjectOwner']) 
            project['projectgOwner_id'] = user.UserID
        return JsonResponse(serializer.data, safe=False)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
@csrf_exempt
def get_project_list_creator(request, email):
    if request.method == 'GET':
        try:
            user = User.objects.get(EmailAddress=email)
            projects = Project.objects.filter(CreatedBy=user)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        
        serializer = ProjectSerializer(projects, many=True)
        project_data = serializer.data

        for project in project_data:
            project['projectOwner_id'] = user.UserID
        return JsonResponse(project_data, safe=False)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
@csrf_exempt
def get_project_list_owner(request, email):
    if request.method == 'GET':
        try:
            user = User.objects.get(EmailAddress=email)
            projects = Project.objects.filter(ProjectOwner=email)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        
        serializer = ProjectSerializer(projects, many=True)
        project_data = serializer.data

        for project in project_data:
            project['projectOwner_id'] = user.UserID
        return JsonResponse(project_data, safe=False)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def get_project_list_owner_creator(request, creator, owner):
    if request.method == 'GET':
        try:
            user = User.objects.get(EmailAddress=creator)
            projects = Project.objects.filter(ProjectOwner=owner, CreatedBy=user)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        
        serializer = ProjectSerializer(projects, many=True)
        project_data = serializer.data

        for project in project_data:
            project['projectOwner_id'] = user.UserID
        return JsonResponse(project_data, safe=False)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


















############################################################################################
#                                     User profile                                         #
############################################################################################
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'Passwd' in serializer.validated_data:
                serializer.validated_data['Passwd'] = make_password(serializer.validated_data['Passwd'])
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupPreferenceAPIView(GenericViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupWithPreferencesSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy',"update_preferences"]:
            return [ForValidToken()]
        else:
            return []

    @action(detail=True, methods=['put'], url_path='preferences')
    def update_preferences(self, request, pk=None):
        group = self.get_object()
        preferences_data = request.data.get('Preferences', [])
        print("preferences_data",preferences_data)
        # 删除现有的偏好
        GroupPreference.objects.filter(Group=group).delete()

        # 添加新的偏好
        for preference_data in preferences_data:
            preference_serializer = GroupPreferenceUpdateSerializer(data=preference_data)
            if preference_serializer.is_valid():
                preference_serializer.save(Group=group)
            else:
                return Response(preference_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Preferences updated successfully"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], url_path='preferences')
    def list_preferences(self, request, pk=None):
        group = self.get_object()
        

        current_preferences = GroupPreference.objects.filter(Group=group)
        current_preferences_serializer = GroupPreferenceSerializer(current_preferences, many=True)
        
        return Response({
            "Preferences": current_preferences_serializer.data
        }, status=status.HTTP_200_OK)
    

def get_user_friendly_errors(serializer_errors):
 
    errors = {
        'errors': ''
    }
    for _, value in serializer_errors.items():
        errors['errors'] += f'{value[0]}\n'
   
    return errors




class UserAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    lookup_field = "UserID"

    def get_permissions(self):
        if self.action in ['create', 'destroy','update_passwd']:
            return [ForValidToken(),OnlyForAdmin()]
        elif self.action in ['list', 'retrieve','update']:
            return [ForValidToken()]
        else:
            return []
    def get_serializer_class(self):
        dic = {
            'create': RegisterSerializer,
            'update': UserUpdateSerializer,
            'update_passwd': UserUpdatePasswdSerializer
        }
        return dic.get(self.action, self.serializer_class)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            token = self.request.headers.get('Authorization').split()[1]
            result = decode_jwt(token)
            if result['status'] == 'success':
                context['RequesterID'] = result['data']['user_id']
        except Exception as e:
            raise JsonResponse({'error': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
        return context
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        errors = get_user_friendly_errors(serializer.errors)

        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='password', url_name='update-passwd')
    def update_passwd(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={'UserID': instance.UserID})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        context = self.get_serializer_context()
        context['UserID'] = instance.UserID
        serializer = self.get_serializer(instance, data=request.data, context=context, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return JsonResponse({'message': 'User deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = UserWithAreaSerializer(queryset, many=True)
        
        return JsonResponse({
            'data': serializer.data,
        }, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=['get'], url_path='autocomplete-email', url_name='autocomplete-email')
    def autocomplete_email(self, request):
        email_substring = request.query_params.get('email_substring', None)
        if email_substring:
            queryset = self.get_queryset().filter(EmailAddress__icontains=email_substring)[:10]
            serializer = UserSlimSerializer(queryset, many=True)
            return JsonResponse({'data': serializer.data}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'Email substring not provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserWithAreaSerializer(instance)
        return  JsonResponse({
            'data': serializer.data,
        }, status=status.HTTP_200_OK)
        


# Area CRUD
from .models import Area
from .serializers import AreaSerializer


class AreaAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [OnlyForAdmin()]
        else:
            return []

    def create(self, request, *args, **kwargs):
        serializer = AreaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AreaSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return JsonResponse({'message': 'Area deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = AreaSerializer(queryset, many=True)
        return JsonResponse({
            'data': serializer.data,
        }, status=status.HTTP_200_OK)


class MessageAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset=Message.objects.all()
    serializer_class=MessageSerializer
    def create(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Message created successfully!'}, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

class ContactAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset=Contact.objects.all()
    serializer_class=ContactSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy','list']:
            return [ForValidToken()]
        else:
            return []
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["requesterId"] = self.request.user_id
        return context
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = ContactCreateSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data
                                , status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ContactUpdateSerializer(instance, data=request.data,context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        requester_id = self.get_serializer_context().get("requesterId")
        # get all contacts of the requester
        contacts = Contact.objects.filter(ContactUser=requester_id)
        
        serializer = ContactSerializer(contacts, many=True)
        return JsonResponse({
            'data': serializer.data,
        }, status=status.HTTP_200_OK)
        

class MessageAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy','list','mark_as_read']:
            return [ForValidToken()]
        else:
            return []
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["requesterId"] = self.request.user_id
        return context
    
    def list(self, request, *args, **kwargs):
        user_id = self.get_serializer_context().get("requesterId")
        # 获取作为发送者或接收者的所有消息
        from django.db.models import Q
        queryset = self.queryset.filter(Q(Sender=user_id) | Q(Receiver=user_id))
        # 将这些消息标记为已读
        # 序列化数据
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], url_path='mark-as-read/(?P<receiverId>\d+)')
    def mark_as_read(self, request, receiverId=None):
        user_id = self.get_serializer_context().get("requesterId")
        if receiverId:
            # 获取符合条件的消息
            messages = self.queryset.filter(Sender=receiverId, Receiver=user_id, IsRead=False)
            # 将消息标记为已读
            updated_count = messages.update(IsRead=True)
            return Response({"message": f"{updated_count} messages marked as read."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid receiverId"}, status=status.HTTP_400_BAD_REQUEST)
    
 
class GroupMessageAPIView( mixins.CreateModelMixin, GenericViewSet):
    queryset = GroupMessage.objects.all()
    serializer_class = GroupMessageSerializer
    def get_permissions(self):
        if self.action in ['list']:
            return [ForValidToken()]
        else:
            return []
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["requesterId"] = self.request.user_id
        return context
    
    def list(self, request, *args, **kwargs):
        user_id = self.request.user_id
        # find all groups that the user is a member
        groups = Group.objects.filter(groupuserslink__UserID=user_id)
        # get all group messages that are sent to these groups
        queryset = GroupMessage.objects.filter(ReceiverGroup__in=groups).distinct()
        serializer = self.serializer_class(queryset, many=True)
        return JsonResponse({
            'data': serializer.data,
        }, status=status.HTTP_200_OK)

############################################################################################
#                                    Notification                                         #
############################################################################################
@api_view(['POST'])
def create_notification(request):
    """
    创建新的通知，发送给指定的用户或群组
    """
    receivers = request.data.get('receivers', [])
    receiver_type = request.data.get('receiver_type')
    notification_type = request.data.get('type')
    message = request.data.get('message')
    additional_data = request.data.get('additionalData', {})

    if not receivers or not receiver_type or not notification_type or not message:
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    # 获取 ContentType
    contentType = ContentType.objects.get(model=receiver_type, app_label="myapp")
    sender_content_type_id = contentType.id

    try:
        if receiver_type == "user":
            # 检查所有用户是否存在
            users = User.objects.filter(UserID__in=receivers)
            if users.count() != len(receivers):
                return Response({"error": "One or more users do not exist"}, status=status.HTTP_400_BAD_REQUEST)

            # 为每个接收者创建通知
            for receiver in receivers:
                notification = Notification.objects.create(
                    sender_content_type_id=sender_content_type_id,
                    sender_object_id=receiver,
                    Type=notification_type,
                    Message=message,
                    AdditionalData=additional_data
                )
                NotificationReceiver.objects.create(
                    Notification_id=notification.NotificationID,
                    ReceiverUser_id=receiver,
                    IsRead=False
                )

        elif receiver_type == "group":
            # 检查所有群组是否存在
            groups = GroupUsersLink.objects.filter(GroupID__in=receivers).values('GroupID').distinct()
            if groups.count() != len(receivers):
                return Response({"error": "One or more groups do not exist"}, status=status.HTTP_400_BAD_REQUEST)

            # 为每个群组创建通知，并为群组中的每个用户创建通知接收记录
            for receiver in receivers:
                notification = Notification.objects.create(
                    sender_content_type_id=sender_content_type_id,
                    sender_object_id=receiver,
                    Type=notification_type,
                    Message=message,
                    AdditionalData=additional_data
                )
                groupUsersLinks = GroupUsersLink.objects.filter(GroupID=receiver)
                for group_user in groupUsersLinks:
                    NotificationReceiver.objects.create(
                        Notification_id=notification.NotificationID,
                        ReceiverUser_id=group_user.UserID_id,
                        IsRead=False
                    )

        else:
            return Response({"error": "Invalid receiver type"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"success": "Notifications created"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def fetch_notifications(request, user_id):
    """
    获取指定用户的所有通知。
    """
    try:
        user = get_object_or_404(User, UserID=user_id)
    except User.DoesNotExist:
        return Response({"error": "user does not exist"}, status=status.HTTP_404_NOT_FOUND)

    # 获取用户的所有通知接收者
    notification_receivers = NotificationReceiver.objects.filter(ReceiverUser_id=user.UserID)

    # 准备一个列表来存储序列化后的通知
    notifications_data = []

    # 遍历每个通知接收者，并获取对应的通知
    for notification_receiver in notification_receivers:
        notification_id = notification_receiver.Notification_id
        notification = get_object_or_404(Notification, NotificationID=notification_id)
        serializer = NotificationSerializer(notification)
        notification_data = serializer.data
        notification_data['IsRead'] = notification_receiver.IsRead  # 添加已读/未读状态字段
        notification_data['NotificationReceiverID'] = notification_receiver.NotificationReceiverID  # 添加已读/未读状态字段
        notifications_data.append(notification_data)

    return Response(notifications_data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_notification_status(request, notificationReceiverId):
    """
    更新通知状态（例如，标记为已读）
    """
    try:
        notificationReceiver = NotificationReceiver.objects.get(NotificationReceiverID=notificationReceiverId)
    except NotificationReceiver.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status is not None:
        notificationReceiver.IsRead = new_status
        notificationReceiver.save()

    return Response({"success": "Notification updated successfully"}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_notification(request, notificationReceiverId):
    """
    删除用户的通知
    """
    try:
        notificationReceiver = NotificationReceiver.objects.get(NotificationReceiverID=notificationReceiverId)
        notificationReceiver.delete()
    except NotificationReceiver.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"success": "Notification deleted successfully"}, status=status.HTTP_200_OK)

     