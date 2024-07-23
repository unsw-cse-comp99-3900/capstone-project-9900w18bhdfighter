from . import views, groups_views
from .allocation import allocation_views
from rest_framework.routers import SimpleRouter
from django.urls import path
from .allocation.allocation_views import AllocationAPIView
url = SimpleRouter(trailing_slash=False)
url.register(r'api/users', views.UserAPIView)
url.register(r'api/areas', views.AreaAPIView)
url.register(r'api/messages', views.MessageAPIView)
url.register(r'api/contacts', views.ContactAPIView)
url.register(r'api/group-messages', views.GroupMessageAPIView)
url.register(r'api/groups', groups_views.GroupsAPIView)
url.register(r'api/group-projects', views.GroupProjectsLinkAPIView)
url.register(r'api/time-rules', views.TimeRuleAPIView)
url.register(r'api/courses', views.CourseAPIView)
url.register(r'api/allocations',allocation_views.AllocationAPIView)
urlpatterns = [
    path("api/login", views.student_login, name="student_login"),
    path("api/project_creation/", views.project_creation, name="project_creation"),
    path("api/student_signup/", views.student_signup, name="student_signup"),
    path("api/project_update/<int:id>/", views.project_update, name="project_update"),
    path("api/group_creation/", views.group_creation, name="group_creation"),
    path("api/projects/", views.get_projects_list, name="get_projects_list"),
    path("api/projects/createdBy/<str:email>/", views.get_project_list_creator, name="get_project_list_creator"),
    path("api/projects/ownBy/<str:email>/", views.get_project_list_owner, name="get_project_list_owner"),
    path("api/projects/own_and_create/<str:creator>/<str:owner>/", views.get_project_list_owner_creator, name="get_project_list_owner"),
    path("api/projects/<int:id>/", views.get_project, name="get_project_detail"),
    path("api/project_delete/<int:id>/", views.project_delete, name="project_delete"),
    path("api/group_join/", views.group_join, name="group_join"),
    path("api/group_leave/", views.group_leave, name="group_leave"),
    path("api/groups/projects/<int:id>/", views.get_groups_list_by_project, name="get_group_detail"),
    path('api/notifications', views.create_notification, name='create_notification'),
    path('api/notifications/', views.fetch_notifications, name='fetch_notifications'),
    path('api/notifications/<int:notificationId>/status', views.update_notification_status,name='update_notification_status'),
    path('api/notifications/<int:notificationReceiverId>/delete', views.delete_notification,name='delete_notification'),
    path('api/group-projects/<int:projectID>/<int:groupID>/', views.GroupProjectsLinkAPIView.as_view({'delete': 'destroy'})),
    path("api/projects/users/<int:id>/", views.get_projects_by_participant,name="get_projects_by_participant"),
    path("api/groups/users/<int:id>/", views.get_groups_by_participant,name="get_groups_by_participant"),
    path("api/groups/autocomplete-name", groups_views.GroupsAPIView.as_view({'get': 'autocomplete_groups'}), name="autocomplete_groups"),
    path("api/projects/autocomplete-name", views.autocomplete_projects, name="autocomplete_projects"),
    path("api/groups/<int:GroupID>/preferences/evaluation", groups_views.GroupsAPIView.as_view({'put':"skills_evaluation"}), name="skills_evaluation"),
    path("api/groups/<int:GroupID>/preferences/evaluation-group", groups_views.GroupsAPIView.as_view({'get':"get_skills_evaluation_by_group"}), name="get_skills_evaluation_by_group"),
    path('api/allocations/get/', AllocationAPIView.as_view({'get': 'get_allocations'}), name='get_allocations'),
    path('api/allocations/approve/', AllocationAPIView.as_view({'post': 'approve'}), name='approve_allocations'),
    path('api/allocations/<int:pk>/', AllocationAPIView.as_view({'put': 'update_allocation'}), name='update_allocation'),
]


urlpatterns += url.urls