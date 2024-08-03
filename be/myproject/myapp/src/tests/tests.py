import datetime
import json

import jwt
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from myapp.src.models.models import User


@override_settings(AUTH_USER_MODEL="auth.User")
class StudentSignupTestCase(TestCase):
    def test_signup_student_success(self):
        url = reverse("student_signup")
        data = {
            "FirstName": "Test",
            "LastName": "Chen",
            "EmailAddress": "z5433108@ad.unsw.edu.au",
            "Passwd": "123123",
        }
        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn("token", response_data)
        self.assertIn("user", response_data)
        self.assertEqual(response_data["user"]["FirstName"], "Test")
        self.assertEqual(response_data["user"]["LastName"], "Chen")
        self.assertEqual(
            response_data["user"]["EmailAddress"], "z5433108@ad.unsw.edu.au"
        )
        self.assertEqual(response_data["user"]["role"], 1)

    def test_signup_student_missing_params(self):
        url = reverse("student_signup")
        data = {"FirstName": "Test", "LastName": "Chen"}
        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(
            response_data["error"],
            "FirstName, LastName, EmailAddress, and Passwd are required.",
        )

    def test_signup_student_exist_email(self):
        url = reverse("student_signup")
        data = {
            "FirstName": "Test",
            "LastName": "Chen",
            "EmailAddress": "stu@stu.com",
            "Passwd": "123123",
        }
        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Email already exists.")


@override_settings(AUTH_USER_MODEL="auth.User")
class UserloginTestCase(TestCase):
    def setUp(self):
        self.url = reverse("student_login")

    def test_login_success(self):
        data = {"EmailAddress": "stu@stu.com", "Passwd": "stu"}
        response = self.client.post(
            self.url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("token", response_data)
        self.assertIn("user_profile", response_data)
        self.assertEqual(response_data["user_profile"]["FirstName"], "stu")
        self.assertEqual(response_data["user_profile"]["LastName"], "stu")
        self.assertEqual(response_data["user_profile"]["EmailAddress"], "stu@stu.com")
        self.assertEqual(response_data["user_profile"]["role"], 1)

    def test_login_missing_params(self):
        # Missing email
        data = {"Passwd": "testpassword"}
        response = self.client.post(
            self.url, data=json.dumps(data), content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Email and password are required.")

        # Missing password
        data = {"EmailAddress": "test@example.com"}
        response = self.client.post(
            self.url, data=json.dumps(data), content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Email and password are required.")

    def test_login_email_not_found(self):
        url = reverse("student_login")
        data = {"EmailAddress": "z434124212@stu.com", "Passwd": "stu"}
        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Email not found.")

    def test_login_email_wrong_passwd(self):
        url = reverse("student_login")
        data = {"EmailAddress": "stu@stu.com", "Passwd": "stu1"}
        response = self.client.post(
            url, data=json.dumps(data), content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(
            response_data["error"], "Incorrect password. Please try again."
        )

    def test_login_email_invail_json(self):
        invalid_json_data = "invalid json"
        response = self.client.post(
            self.url, data=invalid_json_data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Invalid JSON format.")


class ProjectCreationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.client_user = User.objects.create(
            FirstName="Test",
            LastName="Client",
            EmailAddress="client@test.com",
            Passwd=make_password("testpassword"),
            UserRole=2,  # Client role
            UserInformation="Test Client Information",
        )
        self.coordinator_user = User.objects.create(
            FirstName="Test",
            LastName="Coordinator",
            EmailAddress="coordinator@test.com",
            Passwd=make_password("testpassword"),
            UserRole=4,  # Coordinator role
            UserInformation="Test Coordinator Information",
        )
        self.student_user = User.objects.create(
            FirstName="Test",
            LastName="Student",
            EmailAddress="student@test.com",
            Passwd=make_password("testpassword"),
            UserRole=1,  # Student role
            UserInformation="Test Student Information",
        )
        self.url = reverse("project_creation")

        self.client_token = jwt.encode(
            {
                "user_id": self.client_user.pk,
                "role": self.client_user.UserRole,
                "first_name": self.client_user.FirstName,
                "last_name": self.client_user.LastName,
                "email": self.client_user.EmailAddress,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        self.coordinator_token = jwt.encode(
            {
                "user_id": self.coordinator_user.pk,
                "role": self.coordinator_user.UserRole,
                "first_name": self.coordinator_user.FirstName,
                "last_name": self.coordinator_user.LastName,
                "email": self.coordinator_user.EmailAddress,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        self.student_token = jwt.encode(
            {
                "user_id": self.student_user.pk,
                "role": self.student_user.UserRole,
                "first_name": self.student_user.FirstName,
                "last_name": self.student_user.LastName,
                "email": self.student_user.EmailAddress,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

    def test_successful_project_creation_by_client(self):
        data = {
            "ProjectName": "Test Project",
            "ProjectDescription": "This is a test project.",
            "ProjectOwner": self.client_user.EmailAddress,
        }
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.client_token,
        )
        self.assertEqual(response.status_code, 201)

    def test_successful_project_creation_by_coordinator(self):
        data = {
            "ProjectName": "Test Project",
            "ProjectDescription": "This is a test project.",
            "ProjectOwner": self.client_user.EmailAddress,
        }
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.coordinator_token,
        )
        self.assertEqual(response.status_code, 201)

    def test_project_creation_by_student_denied(self):
        data = {
            "ProjectName": "Test Project",
            "ProjectDescription": "This is a test project.",
            "ProjectOwner": self.student_user.EmailAddress,
        }
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.student_token,
        )
        self.assertEqual(response.status_code, 403)

    def test_project_owner_not_found(self):
        data = {
            "ProjectName": "Test Project",
            "ProjectDescription": "This is a test project.",
            "ProjectOwner": "nonexistent@test.com",
        }
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.coordinator_token,
        )
        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Project owner not found.")

    def test_user_not_found(self):
        token = jwt.encode(
            {
                "user_id": 999,
                "role": self.client_user.UserRole,
                "first_name": self.client_user.FirstName,
                "last_name": self.client_user.LastName,
                "email": self.client_user.EmailAddress,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )
        data = {
            "ProjectName": "Test Project",
            "ProjectDescription": "This is a test project.",
            "ProjectOwner": self.client_user.EmailAddress,
        }
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + token,
        )
        self.assertEqual(response.status_code, 404)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "User not found.")

    def test_invalid_request_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Invalid request method.")


class ProjectUpdateTests(TestCase):
    def setUp(self):
        self.client = Client()

        self.client_user = User.objects.create(
            FirstName="Test",
            LastName="Client",
            EmailAddress="client@test.com",
            Passwd=make_password("testpassword"),
            UserRole=2,  # Client role
            UserInformation="Test Client Information",
        )

        # Create a coordinator user
        self.coordinator_user = User.objects.create(
            FirstName="Test",
            LastName="Coordinator",
            EmailAddress="coordinator@example.com",
            Passwd=make_password("testpassword"),
            UserRole=4,  # Coordinator role
            UserInformation="Test Coordinator Information",
        )

        # Generate JWT token for coordinator
        self.coordinator_token = jwt.encode(
            {
                "user_id": self.coordinator_user.pk,
                "role": self.coordinator_user.UserRole,
                "first_name": self.coordinator_user.FirstName,
                "last_name": self.coordinator_user.LastName,
                "email": self.coordinator_user.EmailAddress,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        project_create_url = reverse("project_creation")

        data = {
            "ProjectName": "Test Project",
            "ProjectDescription": "This is a test project.",
            "ProjectOwner": self.coordinator_user.EmailAddress,
        }
        response = self.client.post(
            project_create_url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.coordinator_token,
        )

        self.project = response.json()["project"]
        self.url = reverse("project_update", args=[self.project["ProjectID"]])

    # fail test
    """def test_authentication_failed(self):
        
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
        self.assertNotEqual(response.status_code, 200)"""


class UserProfileTests(TestCase):
    def setUp(self):
        self.login_url = f"/api/login"
        data = {"EmailAddress": "admin@admin.com", "Passwd": "admin"}
        response = self.client.post(
            self.login_url, data=json.dumps(data), content_type="application/json"
        )
        response_data = response.json()
        adm_id = response_data["user_profile"]["UserID"]
        self.adm_token = jwt.encode(
            {
                "user_id": adm_id,
                "role": response_data["user_profile"]["role"],
                "first_name": response_data["user_profile"]["FirstName"],
                "last_name": response_data["user_profile"]["LastName"],
                "email": response_data["user_profile"]["EmailAddress"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24 * 7),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        self.create_user_url = f"/api/users"
        self.userprofile_url = f"/api/users/1"
        self.user_passwd = f"/api/users/1/password"
        self.all_area_url = f"/api/areas"

    def test_get_user_profile(self):
        response = self.client.get(
            self.userprofile_url, HTTP_AUTHORIZATION="Bearer " + self.adm_token
        )
        self.assertEqual(response.status_code, 200)
        response_data = response.json()["data"]

        self.assertEqual(response_data["FirstName"], "stu")
        self.assertEqual(response_data["LastName"], "stu")
        self.assertEqual(response_data["EmailAddress"], "stu@stu.com")
        self.assertEqual(response_data["UserRole"], 1)
        self.assertEqual(response_data["UserInformation"], "")

    def test_put_user_profile(self):
        data = {"UserInformation": "Hi, i am stu."}

        response = self.client.put(
            self.userprofile_url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data["UserInformation"], "Hi, i am stu.")

    def test_change_user_passwd(self):
        data_passwd = {
            "Passwd": 111,
            "Passwd2": 111,
        }
        response_passwd = self.client.put(
            self.user_passwd,
            data=json.dumps(data_passwd),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )
        self.assertEqual(response_passwd.status_code, 200)
        response_passwd_data = response_passwd.json()
        self.assertIn("Passwd", response_passwd_data)

    def test_create_deleted_user(self):
        # create a new tut account
        data = {
            "Passwd": 123123,
            "Passwd2": 123123,
            "EmailAddress": "112@qq.com",
            "FirstName": "tut",
            "LastName": "test",
            "UserRole": 3,
        }
        response = self.client.post(
            self.create_user_url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )

        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertEqual(response_data["FirstName"], "tut")
        self.assertEqual(response_data["LastName"], "test")
        self.assertEqual(response_data["EmailAddress"], "112@qq.com")
        self.assertEqual(response_data["UserRole"], 3)
        self.assertEqual(response_data["UserInformation"], "")

        # delete the tut account
        user_id = response_data["UserID"]
        response_before_del = self.client.get(
            f"{self.create_user_url}/{user_id}",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )
        self.assertEqual(response_before_del.status_code, 200)

        response_del = self.client.delete(
            f"{self.create_user_url}/{user_id}",
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )
        self.assertEqual(response_del.status_code, 204)  # no content

        response_after_del = self.client.get(
            f"{self.create_user_url}/{user_id}",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )
        self.assertEqual(response_after_del.status_code, 404)

    def test_update_user_area(self):
        response = self.client.get(
            self.all_area_url, HTTP_AUTHORIZATION="Bearer " + self.adm_token
        )
        self.assertEqual(response.status_code, 200)

    def test_update_user_nonexist_areas(self):
        bad_data = {"Areas": [-1]}
        bad_response = self.client.put(
            self.userprofile_url,
            data=json.dumps(bad_data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )
        self.assertEqual(bad_response.status_code, 400)

    def test_update_user_exist_areas(self):

        response = self.client.get(
            self.userprofile_url, HTTP_AUTHORIZATION="Bearer " + self.adm_token
        )
        self.assertEqual(response.status_code, 200)
        response_data = response.json()["data"]
        self.assertEqual(response_data["Areas"], [])

        data = {"Areas": [4, 7]}
        self.client.put(
            self.userprofile_url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer " + self.adm_token,
        )

        response = self.client.get(
            self.userprofile_url, HTTP_AUTHORIZATION="Bearer " + self.adm_token
        )
        self.assertEqual(response.status_code, 200)
        response_data = response.json()["data"]
        self.assertEqual(
            response_data["Areas"][0],
            {"AreaID": 4, "AreaName": "Frameworks & Libraries"},
        )
        self.assertEqual(
            response_data["Areas"][1],
            {"AreaID": 7, "AreaName": "Data Processing & Visualization"},
        )
