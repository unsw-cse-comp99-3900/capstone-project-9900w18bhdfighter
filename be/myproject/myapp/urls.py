from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.student_login, name="student_login"),
    path("project_creation/", views.project_creation, name="project_creation"),
    path("student_signup/", views.student_signup, name="student_signup"),
    # path('test_db_connection/', views.test_db_connection, name='test_db_connection'),
]