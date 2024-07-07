from . import views, groups_views
from rest_framework.routers import SimpleRouter
from django.urls import path, include

url = SimpleRouter(trailing_slash=False)
url.register(r'api/users', views.UserAPIView)
url.register(r'api/areas', views.AreaAPIView)
url.register(r'api/messages', views.MessageAPIView)
url.register(r'api/groups', groups_views.GroupsAPIView)
url.register(r'api/groups', groups_views.GroupsAPIView)

urlpatterns = [
    path("login/", views.student_login, name="student_login"),
    path("project_creation/", views.project_creation, name="project_creation"),
    path("student_signup/", views.student_signup, name="student_signup"),
    path("project_update/<int:id>/", views.project_update, name="project_update"),


]
urlpatterns += url.urls

