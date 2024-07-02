import json
import datetime
import jwt
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Area, Group, GroupUsersLink, Skill, SkillProject, User as UserProfile, User, UserPreferencesLink, Project
from .serializers import GroupSerializer, ProjectSerializer, UserSerializer, UserPreferencesLinkSerializer, RegisterSerializer, UserUpdatePasswdSerializer, UserUpdateSerializer
from .permission import OnlyForAdmin
from rest_framework.viewsets import GenericViewSet

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
        

        if user_data['role'] == 2:
            if data['ProjectOwner'] == user_data['email']:
                project_owner_email = user_data['email']
            else:
                return JsonResponse({'error': 'Permission denied. Clients can only set their own email as ProjectOwner.'}, status=403)
        elif user_data['role'] in [4, 5]:
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
            required_skills = data.get('requiredSkills',[])

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

            return JsonResponse({'message': 'Project created successfully!', 'project': serializer.data}, status=201)
        return JsonResponse(serializer.errors, status=400)
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
            elif user_data['role'] in [2]:
                if project.CreatedBy.pk != user.pk:
                    return JsonResponse({'error': 'Permission denied. Clients can only update projects they created.'}, status=403)
            elif user_data['role'] in [5, 4]:
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

        if result['status'] == 'success':
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
                
                if user_data['role'] in [1]:
                    GroupUsersLink.objects.create(GroupID=group,UserID=user)
                    return JsonResponse({'message': 'Group created successfully!', 'group': serializer.data}, status=201)
                else:
                    return JsonResponse({'message': 'Group created successfully!', 'group': serializer.data}, status=201)
            except:
                return JsonResponse({'error': 'Error creating group. Please try again.'}, status=500)
        return JsonResponse(serializer.errors, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


############################################################################################
#                                     Group Operation                                      #
############################################################################################

@csrf_exempt
def group_join(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] == 'success':
            user_data = result['data']
            try:
                user = User.objects.get(pk=user_data['user_id'])
            except User.DoesNotExist:
                return JsonResponse({'error': 'Authentication failed'}, status=401)
        try:
            add_user = User.objects.get(UserID=data['student_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'User do not exists'}, status=404)
            
        if user_data['role'] not in [1, 3, 4, 5]:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        try:
            group = Group.objects.get(GroupID=data['group_id'])
        except Group.DoesNotExist:
            return JsonResponse({'error': 'Group do not exists'}, status=404)

        if GroupUsersLink.objects.filter(UserID=user).exists():
            return JsonResponse({'error': 'Student is already in a group'}, status=400)

        current_group_number = GroupUsersLink.objects.filter(GroupID=group).count()

        if current_group_number >= group.MaxMemberNumber:
            if user.UserRole in [3, 4, 5]:
                GroupUsersLink.objects.create(GroupID=group, UserID=add_user)
                return JsonResponse({'message': 'Added students to full group successfully!'}, status=201)
            return JsonResponse({'error': 'Group is full'}, status=400)
        else:
            if user_data['role'] == 1:
                if user == add_user:
                    GroupUsersLink.objects.create(GroupID=group, UserID=user)
                    return JsonResponse({'message': 'Joined group successfully!'}, status=201)
                else:
                    return JsonResponse({'error': 'You cannot add other studens into a group'}, status=403)
            return JsonResponse({'error': 'You cannot join a group'}, status=403)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


@csrf_exempt
def group_leave(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] == 'success':
            user_data = result['data']
            try:
                user = User.objects.get(pk=user_data['user_id'])
            except User.DoesNotExist:
                return JsonResponse({'error': 'Authentication failed'}, status=401)
        try:
            leave_user = User.objects.get(UserID=data['student_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'User do not exists'}, status=404)
            
        if user_data['role'] not in [1, 3, 4, 5]:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        try:
            group = Group.objects.get(GroupID=data['group_id'])
        except Group.DoesNotExist:
            return JsonResponse({'error': 'Group do not exists'}, status=404)

        if not GroupUsersLink.objects.filter(UserID=user).exists():
            return JsonResponse({'error': 'Student is not in this group'}, status=400)

        current_group_number = GroupUsersLink.objects.filter(GroupID=group).count()

       
        if user.UserRole in [3, 4, 5]:
            if current_group_number > 0:
                GroupUsersLink.objects.filter(GroupID=group, UserID=leave_user).delete()
                return JsonResponse({'message': 'delete user to from the group successfully!'}, status=201)
            return JsonResponse({'error': 'Group is empty'}, status=400)
    
        if user_data['role'] == 1:
            if current_group_number > 1:
                if user == leave_user:
                    GroupUsersLink.objects.filter(GroupID=group, UserID=user).delete()
                    return JsonResponse({'message': 'Leave group successfully!'}, status=201)
                else:
                    return JsonResponse({'error': 'You cannot remove other student from the group'}, status=403)
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
        return JsonResponse(serializer.data, safe=False)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
@csrf_exempt
def get_project_list_creator(request, email):
    if request.method == 'GET':
        try:
            user = User.objects.get(EmailAddress=email)
            projects = Project.objects.filter(CreatedBy=user)
            serializer = ProjectSerializer(projects, many=True)
            return JsonResponse(serializer.data, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
@csrf_exempt
def get_project_list_owner(request, email):
    if request.method == 'GET':
        try:
            projects = Project.objects.filter(ProjectOwner=email)
            serializer = ProjectSerializer(projects, many=True)
            return JsonResponse(serializer.data, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def get_project_list_owner_creator(request, creator, owner):
    if request.method == 'GET':
        try:
            user = User.objects.get(EmailAddress=creator)
            projects = Project.objects.filter(ProjectOwner=owner, CreatedBy=user)

            serializer = ProjectSerializer(projects, many=True)
            return JsonResponse(serializer.data, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_preferences(request):
    user = request.user

    if request.method == 'GET':
        preferences = UserPreferencesLink.objects.filter(UserID=user)
        serializer = UserPreferencesLinkSerializer(preferences, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        request.data['UserID'] = user.UserID
        serializer = UserPreferencesLinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_preference_detail(request, pk):
    user = request.user

    try:
        preference = UserPreferencesLink.objects.get(pk=pk, UserID=user)
    except UserPreferencesLink.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserPreferencesLinkSerializer(preference, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        preference.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def get_user_friendly_errors(serializer_errors):
    errors = {
        'errors':''
    }
    for _, value in serializer_errors.items():
        errors['errors'] += f'{value[0]}\n'
    
    return errors




class UserAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [OnlyForAdmin]
    lookup_field = "UserID"

    def get_serializer_class(self):
        dic = {
            'create': RegisterSerializer,
            'update': UserUpdateSerializer,
            'update_passwd': UserUpdatePasswdSerializer
        }
        return dic.get(self.action, self.serializer_class)

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
        serializer = self.get_serializer(instance, data=request.data, context={'UserID': instance.UserID}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        errors = get_user_friendly_errors(serializer.errors)
        return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return JsonResponse({'message': 'User deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


# Area CRUD

from .models import Area
from .serializers import AreaSerializer

class AreaAPIView(mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [OnlyForAdmin]
    
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
    
    
