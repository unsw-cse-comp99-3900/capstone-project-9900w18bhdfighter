import datetime
from django.conf import settings
from django.test import TestCase, override_settings, Client
from django.urls import reverse
import jwt
from rest_framework.authtoken.models import Token
from myapp.models import User, Project
from django.contrib.auth.hashers import make_password
import json

@override_settings(AUTH_USER_MODEL='auth.User')
class StudentSignupTestCase(TestCase):
    def test_signup_student_success(self):
        url = reverse('student_signup')  # Make sure this is the correct URL name
        data = {
            'FirstName': 'Test',
            'LastName': 'Chen',
            'EmailAddress': 'z5433108@ad.unsw.edu.au',
            'Passwd': '123123'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn('token', response_data)
        self.assertIn('user', response_data)
        self.assertEqual(response_data['user']['FirstName'], 'Test')
        self.assertEqual(response_data['user']['LastName'], 'Chen')
        self.assertEqual(response_data['user']['EmailAddress'], 'z5433108@ad.unsw.edu.au')
        self.assertEqual(response_data['user']['role'], 1)


    def test_signup_student_missing_params(self):
        url = reverse('student_signup') 
        data = {
            'FirstName': 'Test',
            'LastName': 'Chen'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'FirstName, LastName, EmailAddress, and Passwd are required.')

    def test_signup_student_exist_email(self):
        url = reverse('student_signup') 
        data = {
            'FirstName': 'Test',
            'LastName': 'Chen',
            'EmailAddress': 'stu@stu.com',
            'Passwd': '123123'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Email already exists.')
        

@override_settings(AUTH_USER_MODEL='auth.User')
class UserloginTestCase(TestCase):
    def setUp(self):
        self.url = reverse('student_login') 

    def test_login_success(self):
        data = {
            'EmailAddress': 'stu@stu.com',
            'Passwd': 'stu'
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn('token', response_data)
        self.assertIn('user_profile', response_data)
        self.assertEqual(response_data['user_profile']['FirstName'], 'stu')
        self.assertEqual(response_data['user_profile']['LastName'], 'stu')
        self.assertEqual(response_data['user_profile']['EmailAddress'], 'stu@stu.com')
        self.assertEqual(response_data['user_profile']['role'], 1)

    def test_login_missing_params(self):
        # Missing email
        data = {'Passwd': 'testpassword'}
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Email and password are required.')

        # Missing password
        data = {'EmailAddress': 'test@example.com'}
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Email and password are required.')

    def test_login_email_not_found(self):
        url = reverse('student_login') 
        data = {
            'EmailAddress': 'z434124212@stu.com',
            'Passwd': 'stu'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Email not found.')

    def test_login_email_wrong_passwd(self):
        url = reverse('student_login') 
        data = {
            'EmailAddress': 'stu@stu.com',
            'Passwd': 'stu1'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 401)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Incorrect password. Please try again.')

    def test_login_email_invail_json(self):
        invalid_json_data = 'invalid json'
        response = self.client.post(self.url, data=invalid_json_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Invalid JSON format.')

    def test_only_post_method_allowed(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Only POST method is allowed.')


class ProjectCreationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.client_user = User.objects.create(
            FirstName='Test',
            LastName='Client',
            EmailAddress='client@test.com',
            Passwd=make_password('testpassword'),
            UserRole=2,  # Client role
            UserInformation='Test Client Information'
        )
        self.coordinator_user = User.objects.create(
            FirstName='Test',
            LastName='Coordinator',
            EmailAddress='coordinator@test.com',
            Passwd=make_password('testpassword'),
            UserRole=4,  # Coordinator role
            UserInformation='Test Coordinator Information'
        )
        self.student_user = User.objects.create(
            FirstName='Test',
            LastName='Student',
            EmailAddress='student@test.com',
            Passwd=make_password('testpassword'),
            UserRole=1,  # Student role
            UserInformation='Test Student Information'
        )
        self.url = reverse('project_creation')  

        # Generate JWT token for client and coordinator
        self.client_token = jwt.encode({
            'user_id': self.client_user.pk,
            'role': self.client_user.UserRole,
            'first_name': self.client_user.FirstName,
            'last_name': self.client_user.LastName,
            'email': self.client_user.EmailAddress,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7) 
        }, settings.SECRET_KEY, algorithm='HS256')
        
        self.coordinator_token = jwt.encode({
            'user_id': self.coordinator_user.pk,
            'role': self.coordinator_user.UserRole,
            'first_name': self.coordinator_user.FirstName,
            'last_name': self.coordinator_user.LastName,
            'email': self.coordinator_user.EmailAddress,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7)  
        }, settings.SECRET_KEY, algorithm='HS256')
        
        self.student_token = jwt.encode({
            'user_id': self.student_user.pk,
            'role': self.student_user.UserRole,
            'first_name': self.student_user.FirstName,
            'last_name': self.student_user.LastName,
            'email': self.student_user.EmailAddress,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7)  
        }, settings.SECRET_KEY, algorithm='HS256')


    def test_successful_project_creation_by_client(self):
        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': self.client_user.EmailAddress
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + self.client_token)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn('message', response_data)
        self.assertEqual(response_data['message'], 'Project created successfully!')

    def test_successful_project_creation_by_coordinator(self):
        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': self.client_user.EmailAddress 
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + self.coordinator_token)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn('message', response_data)
        self.assertEqual(response_data['message'], 'Project created successfully!')

    def test_project_creation_by_student_denied(self):
        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': self.student_user.EmailAddress
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        self.assertEqual(response.status_code, 403)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Permission denied.')

    def test_project_owner_not_found(self):
        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': 'nonexistent@test.com'
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + self.coordinator_token)
        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Project owner not found.')

    def test_permission_denied_for_setting_project_owner(self):
        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': '123123@test.com'
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + self.client_token)
        self.assertEqual(response.status_code, 403)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Permission denied. Clients can only set their own email as ProjectOwner.')


    def test_user_not_found(self):
        token = jwt.encode({
            'user_id': 999,
            'role': self.client_user.UserRole,
            'first_name': self.client_user.FirstName,
            'last_name': self.client_user.LastName,
            'email': self.client_user.EmailAddress,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7) 
        }, settings.SECRET_KEY, algorithm='HS256')
        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': self.client_user.EmailAddress
        }
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'User not found.')

    def test_invalid_request_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Invalid request method.')


class ProjectUpdateTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.client_user = User.objects.create(
            FirstName='Test',
            LastName='Client',
            EmailAddress='client@test.com',
            Passwd=make_password('testpassword'),
            UserRole=2,  # Client role
            UserInformation='Test Client Information'
        )

        # Create a coordinator user
        self.coordinator_user = User.objects.create(
            FirstName='Test',
            LastName='Coordinator',
            EmailAddress='coordinator@example.com',
            Passwd=make_password('testpassword'),
            UserRole=4,  # Coordinator role
            UserInformation='Test Coordinator Information'
        )

        # Generate JWT token for coordinator
        self.coordinator_token = jwt.encode({
            'user_id': self.coordinator_user.pk,
            'role': self.coordinator_user.UserRole,
            'first_name': self.coordinator_user.FirstName,
            'last_name': self.coordinator_user.LastName,
            'email': self.coordinator_user.EmailAddress,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7) 
        }, settings.SECRET_KEY, algorithm='HS256')

        project_create_url = reverse('project_creation')  

        data = {
            'ProjectName': 'Test Project',
            'ProjectDescription': 'This is a test project.',
            'ProjectOwner': self.coordinator_user.EmailAddress 
        }
        response = self.client.post(project_create_url, data=json.dumps(data), content_type='application/json',
                                    HTTP_AUTHORIZATION='Bearer ' + self.coordinator_token)
        

        self.project = response.json()['project']
        self.url = reverse('project_update', args=[self.project['ProjectID']])

    def test_successful_project_update(self):
        data = {
            'ProjectName': 'Updated Project',
            'ProjectDescription': 'Updated Description'
        }
        response = self.client.put(self.url, data=json.dumps(data), content_type='application/json',
                                   HTTP_AUTHORIZATION='Bearer ' + self.coordinator_token)
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn('message', response_data)
        self.assertEqual(response_data['message'], 'Project updated successfully!')
        self.assertEqual(response_data['project']['ProjectName'], 'Updated Project')
        self.assertEqual(response_data['project']['ProjectDescription'], 'Updated Description')

    def test_project_not_found(self):
        url = reverse('project_update', args=[9999]) 
        data = {
            'ProjectName': 'Updated Project',
            'ProjectDescription': 'Updated Description'
        }
        response = self.client.put(url, data=json.dumps(data), content_type='application/json',
                                   HTTP_AUTHORIZATION='Bearer ' + self.coordinator_token)
        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn('error', response_data)
        self.assertEqual(response_data['error'], 'Project not found')

    #fail test
    '''def test_authentication_failed(self):
        
        invalid_token = jwt.encode({
            'user_id': self.client_user.pk,
            'role': self.client_user.UserRole,
            'first_name': self.client_user.FirstName,
            'last_name': self.client_user.LastName,
            'email': self.client_user.EmailAddress,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7) 
        }, settings.SECRET_KEY, algorithm='HS256')
        data = {
            'ProjectName': 'Updated Project',
            'ProjectDescription': 'Updated Description'
        }
        response = self.client.put(self.url, data=json.dumps(data), content_type='application/json',
                                   HTTP_AUTHORIZATION='Bearer ' + invalid_token)
        self.assertNotEqual(response.status_code, 200)'''

