from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Skill, User as UserProfile, User, UserPreferencesLink
from .models import Project
from .models import User
from .serializers import ProjectSerializer, UserSerializer, UserPreferencesLinkSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
import jwt
import json
import datetime


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
                return JsonResponse({'error': 'FirstName, LastName, EmailAddress, and Passwd are required.'}, status=400)
            
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
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7)  # Token expires in 24 * 7 hours
                    }, settings.SECRET_KEY, algorithm='HS256')
                    
                    response_data = {
                        'user_profile': {
                            'UserID': user.pk,
                            'FirstName': user.FirstName,
                            'LastName' : user.LastName,
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
            interest_areas = data.get('interestAreas',[])

            for interest_area, skill in interest_areas:
                try:
                    area = Area.objects.get(pk=interest_area)
                except Area.DoesNoExist:
                     return JsonResponse({'error': 'Area not found.'}, status=404)
                skill_object = Skill.objects.get_or_create(SkillName=skill)
                InterestArea.ojects.create(Area=area, Skill=skill_object, Project=project)

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
