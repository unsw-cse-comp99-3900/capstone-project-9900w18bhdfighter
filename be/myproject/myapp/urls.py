from django.urls import path
from myapp.src.views.allocation import AllocationAPIView
from myapp.src.views.area import AreaAPIView
from myapp.src.views.auth import student_login, student_signup
from myapp.src.views.contact import ContactAPIView
from myapp.src.views.course import CourseAPIView
from myapp.src.views.group_asses import GroupAssessmentViewSet
from myapp.src.views.grp_proj import GroupProjectsLinkAPIView
from myapp.src.views.message import GroupMessageAPIView, MessageAPIView
from myapp.src.views.notification import (
    create_notification,
    delete_notification,
    fetch_notifications,
    update_notification_status,
)
from myapp.src.views.project import (
    autocomplete_projects,
    get_project,
    get_project_list_creator,
    get_project_list_owner,
    get_project_list_owner_creator,
    get_projects_by_participant,
    get_projects_list,
    project_creation,
    project_delete,
    project_update,
)
from myapp.src.views.report import generate_report
from myapp.src.views.submition import SubmissionViewSet
from myapp.src.views.time_rule import TimeRuleAPIView
from myapp.src.views.user import UserAPIView
from rest_framework.routers import SimpleRouter

from .src.views.group import (
    GroupsAPIView,
    get_groups_by_creator,
    get_groups_by_participant,
    get_groups_list_by_project,
    group_creation,
    group_join,
    group_leave,
)

url = SimpleRouter(trailing_slash=False)
url.register(r"api/users", UserAPIView)
url.register(r"api/areas", AreaAPIView)
url.register(r"api/messages", MessageAPIView)
url.register(r"api/contacts", ContactAPIView)
url.register(r"api/group-messages", GroupMessageAPIView)
url.register(r"api/groups", GroupsAPIView)
url.register(r"api/group-projects", GroupProjectsLinkAPIView)
url.register(r"api/time-rules", TimeRuleAPIView)
url.register(r"api/courses", CourseAPIView)
url.register(r"api/allocations", AllocationAPIView)
url.register(r"api/submissions", SubmissionViewSet)
url.register(
    r"api/group-assessments", GroupAssessmentViewSet, basename="group-assessments"
)
urlpatterns = [
    path("api/login", student_login, name="student_login"),
    path("api/project_creation/", project_creation, name="project_creation"),
    path("api/student_signup/", student_signup, name="student_signup"),
    path("api/project_update/<int:id>/", project_update, name="project_update"),
    path("api/group_creation/", group_creation, name="group_creation"),
    path("api/projects/", get_projects_list, name="get_projects_list"),
    path(
        "api/projects/createdBy/<str:email>/",
        get_project_list_creator,
        name="get_project_list_creator",
    ),
    path(
        "api/projects/ownBy/<str:email>/",
        get_project_list_owner,
        name="get_project_list_owner",
    ),
    path(
        "api/projects/own_and_create/<str:creator>/<str:owner>/",
        get_project_list_owner_creator,
        name="get_project_list_owner",
    ),
    path("api/projects/<int:id>/", get_project, name="get_project_detail"),
    path("api/project_delete/<int:id>/", project_delete, name="project_delete"),
    path("api/group_join/", group_join, name="group_join"),
    path("api/group_leave/", group_leave, name="group_leave"),
    path(
        "api/groups/projects/<int:id>/",
        get_groups_list_by_project,
        name="get_group_detail",
    ),
    path("api/notifications", create_notification, name="create_notification"),
    path("api/notifications/", fetch_notifications, name="fetch_notifications"),
    path(
        "api/notifications/<int:notificationId>/status",
        update_notification_status,
        name="update_notification_status",
    ),
    path(
        "api/notifications/<int:notificationReceiverId>/delete",
        delete_notification,
        name="delete_notification",
    ),
    path(
        "api/group-projects/<int:projectID>/<int:groupID>/",
        GroupProjectsLinkAPIView.as_view({"delete": "destroy"}),
    ),
    path(
        "api/projects/users/<int:id>/",
        get_projects_by_participant,
        name="get_projects_by_participant",
    ),
    path(
        "api/groups/users/<int:id>/",
        get_groups_by_participant,
        name="get_groups_by_participant",
    ),
    path(
        "api/groups/creators/<int:id>/",
        get_groups_by_creator,
        name="get_groups_by_creator",
    ),
    path(
        "api/groups/autocomplete-name",
        GroupsAPIView.as_view({"get": "autocomplete_groups"}),
        name="autocomplete_groups",
    ),
    path(
        "api/projects/autocomplete-name",
        autocomplete_projects,
        name="autocomplete_projects",
    ),
    path(
        "api/groups/<int:GroupID>/preferences/evaluation",
        GroupsAPIView.as_view({"put": "skills_evaluation"}),
        name="skills_evaluation",
    ),
    path(
        "api/groups/<int:GroupID>/preferences/evaluation-group",
        GroupsAPIView.as_view({"get": "get_skills_evaluation_by_group"}),
        name="get_skills_evaluation_by_group",
    ),
    path("api/generate_report/", generate_report, name="generate_report"),
]


urlpatterns += url.urls
