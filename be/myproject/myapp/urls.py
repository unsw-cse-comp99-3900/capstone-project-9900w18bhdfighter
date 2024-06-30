from . import views
from rest_framework.routers import SimpleRouter
from django.urls import path, include

user_url = SimpleRouter(trailing_slash=False)
user_url.register(r'api/users', views.UserAPIView)

urlpatterns = [
    path("login/", views.student_login, name="student_login"),
    path("project_creation/", views.project_creation, name="project_creation"),
    path("student_signup/", views.student_signup, name="student_signup"),
    path("project_update/<int:id>/", views.project_update, name="project_update"),
    # path('test_db_connection/', views.test_db_connection, name='test_db_connection'),
]
urlpatterns += user_url.urls
