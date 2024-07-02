from . import views
from rest_framework.routers import SimpleRouter
from django.urls import path, include

url = SimpleRouter(trailing_slash=False)
url.register(r'api/users', views.UserAPIView)
url.register(r'api/areas', views.AreaAPIView)

urlpatterns = [
    path("login/", views.student_login, name="student_login"),
    path("project_creation/", views.project_creation, name="project_creation"),
    path("student_signup/", views.student_signup, name="student_signup"),
    path("project_update/<int:id>/", views.project_update, name="project_update"),
    # path('test_db_connection/', views.test_db_connection, name='test_db_connection'),
    # 获取或更新用户个人资料接口
    path("api/profile/", views.user_profile, name="user_profile"),
]
urlpatterns += url.urls

