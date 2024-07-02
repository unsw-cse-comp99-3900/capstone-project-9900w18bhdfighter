from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


class DiyPermission(BasePermission):
    def has_permission(self, request, view):
        from myapp.views import decode_jwt
        from myapp.models import User

        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] == 'success':
            user_data = result['data']
            try:
                user = User.objects.get(pk=user_data['user_id'])
            except Exception as e:
                return False
            if user.UserRole != 5:
                raise PermissionDenied('You do not have permission to perform this action.')
            request.user = user
            return True
        return False
