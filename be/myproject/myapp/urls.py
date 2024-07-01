from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.student_login, name="student_login"),
    path("project_creation/", views.project_creation, name="project_creation"),
    path("student_signup/", views.student_signup, name="student_signup"),
    path("project_update/<int:id>/", views.project_update, name="project_update"),
    path("group_creation/", views.group_creation, name="group_creation"),
    path("projects/", views.get_projects_list, name="get_projects_list"),
    # path('test_db_connection/', views.test_db_connection, name='test_db_connection'),
]