from django.shortcuts import render, HttpResponse
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.contrib.auth import authenticate 
from django.views.decorators.csrf import csrf_exempt
import json

from .models import UserProfile
from .models import Project
from .serializers import ProjectSerializer


# from .utils import generate_auth_token 


def generate_auth_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token.key

# def mock_authenticate(email, password):
#     test_email = 'test@example.com'
#     test_password = 'testpassword'
    
#     if email == test_email and password == test_password:

#         return {
#             'id': 1,
#             'username': 'testuser',
#             'email': test_email,
#         }
#     return None

# @csrf_exempt
# def student_login(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             email = data.get('email')
#             password = data.get('password')
#             print(f"email is {email}")
#             print(f"password is {password}")
#             if not email or not password:
#                 return JsonResponse({'error': 'Email and password are required.'}, status=400)
            
#             user = mock_authenticate(email, password)
#             print(user)
#             if user is not None:

#                 auth_token = 'mocktoken12345'
#                 response_data = {
#                     'user_profile': {
#                         'id': user['id'],
#                         'name': user['username'],
#                         'email': user['email'],
#                     },
#                     'auth_token': auth_token
#                 }
#                 return JsonResponse(response_data, status=200)
#             else:
#                 return JsonResponse({'error': 'Invalid email or password.'}, status=401)
                    
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
#     else:
#         return JsonResponse({'error': 'Only POST method is allowed.'}, status=405)


############################################################################################
#                                    Student Sign up                                       #
############################################################################################
# def student_signup(request):











############################################################################################
#                                    Student Login                                         #
############################################################################################
def student_login(request):
    if request.method == 'POST':
        try:
            # User Authentication
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                # Assuming the UserProfile model has a foreign key relationship with the User model
                user_profile = UserProfile.objects.get(user=user)
                auth_token = generate_auth_token(user)
                response_data = {
                    'user_profile': {
                        'id': user_profile.id,
                        'name': user_profile.name,
                        'email': user_profile.user.email,
                    },
                    'auth_token': auth_token
                }
                return JsonResponse(response_data, status=200)
            else:
                if not User.objects.filter(email=email).exists():
                    return JsonResponse({'error': 'E-mail not found.'}, status=404)
                else:
                    return JsonResponse({'error': 'Incorrect password. Please try again.'}, status=401)
                    
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
        #print(data)

    # User Authentication
    auth_token = data.get('auth_token')
    try:
        token = Token.objects.get(key=auth_token)
        user = token.user
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Authentication failed'}, status=401)

    serializer = ProjectSerializer(data=data)
    if serializer.is_valid():
        serializer.save(created_by=user)
        return JsonResponse({'message': 'Project created successfully!', 'project': serializer.data}, status=201)
    return JsonResponse(serializer.errors, status=400)


############################################################################################
#                                    Project Updating                                      #
############################################################################################
@csrf_exempt
def project_update(request, id):
    try:
        project = Project.objects.get(pk=id)
    except:
        return JsonResponse({'error': 'Project not found'}, status=404)
    
    if request.method == 'Put':
        data = JSONParser().parse(request)

    # User Authentication
    auth_token = data.get('auth_token')
    try:
        token = Token.objects.get(key=auth_token)
        user = token.user
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Authentication failed'}, status=401)
            
    serializer = ProjectSerializer(data=data)
    if serializer.is_vaild():
        serializer.save(created_by=user)
        return JsonResponse({'message': 'Project updated successfully!', 'project': serializer.data}, status=200)
    return JsonResponse(serializer.error, staus=400)

        
