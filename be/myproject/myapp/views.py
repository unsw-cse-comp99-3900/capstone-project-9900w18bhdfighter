from django.shortcuts import render, HttpResponse
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.contrib.auth import authenticate 
from django.views.decorators.csrf import csrf_exempt
from .models import User
import json

from .models import User as UserProfile
from .models import Project
from .serializers import ProjectSerializer
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password



# from .utils import generate_auth_token 


def generate_auth_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token.key



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
            # token = Token.objects.create(user=user)
            token_key = generate_auth_token(user)
            
            return JsonResponse({
                'token': token_key,
                'user': {
                    'UserID': user.pk,
                    'FirstName': user.FirstName,
                    'LastName': user.LastName,
                    'EmailAddress': user.EmailAddress,
                }
            }, status=status.HTTP_201_CREATED)
        
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
            # User Authentication
            data = json.loads(request.body)
            email = data.get('EmailAddress')
            password = data.get('Passwd')
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)
            
            try:
                user = User.objects.get(EmailAddress=email)
                print(user.Passwd)
                if check_password(password, user.Passwd):
                    auth_token = generate_auth_token(user)
                    response_data = {
                        'user_profile': {
                            'UserID': user.pk,
                            'FirstName': user.FirstName,
                            'LastName' : user.LastName,
                            'EmailAddress': user.EmailAddress,
                        },
                        'auth_token': auth_token
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

        
# #test
# def test_db_connection(request):
#     try:
#         user_count = User.objects.count()
#         return JsonResponse({'status': 'success', 'user_count': user_count}, status=200)
#     except Exception as e:
#         return JsonResponse({'status': 'error', 'message': str(e)}, status=500)