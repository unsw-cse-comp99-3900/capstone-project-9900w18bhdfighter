from . import views
from rest_framework.routers import SimpleRouter

user_url = SimpleRouter(trailing_slash=False)
user_url.register(r'users', views.UserAPIView)

urlpatterns = [
]
urlpatterns += user_url.urls
