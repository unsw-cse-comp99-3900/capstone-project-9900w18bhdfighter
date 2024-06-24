from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
import json
# Create your tests here.

@override_settings(AUTH_USER_MODEL='auth.User')
class StudentSignupTestCase(TestCase):
     

     def test_signup_success(self):
        url = reverse('student_signup')  # Make sure this is the correct URL name
        data = {
            'FirstName': 'John',
            'LastName': 'Doe',
            'EmailAddress': 'z5433108@ad.unsw.edu.au',
            'Passwd': '123123'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn('token', response_data)
        self.assertIn('user', response_data)
        self.assertEqual(response_data['user']['FirstName'], 'John')
        self.assertEqual(response_data['user']['LastName'], 'Doe')
        self.assertEqual(response_data['user']['EmailAddress'], 'z5433108@ad.unsw.edu.au')
        #self.assertEqual(response_data['user']['UserID'], 'john.doe@example.com')