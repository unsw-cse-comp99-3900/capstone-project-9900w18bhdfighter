from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied


class OnlyForAdmin(BasePermission):
    def has_permission(self, request, view):
        from myapp.views import decode_jwt
        from myapp.models import User
        try:
            token = request.headers.get('Authorization').split()[1]
        except Exception as e:
            return False

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


class PartialRole(BasePermission):
    def has_permission(self, request, view):
        from myapp.views import decode_jwt
        from myapp.models import User
        try:
            token = request.headers.get('Authorization').split()[1]
        except Exception as e:
            return False

        result = decode_jwt(token)
        if result['status'] == 'success':
            user_data = result['data']
            try:
                user = User.objects.get(pk=user_data['user_id'])
            except Exception as e:
                return False
            print("permission_range: ", request.permission_range)
            if user.UserRole not in request.permission_range:
                raise PermissionDenied('You do not have permission to perform this action.')
            request.user = user
            return True
        return False


class ForValidToken(BasePermission):
    def has_permission(self, request, view):
        from myapp.views import decode_jwt
        from myapp.models import User

        try:
            token = request.headers.get('Authorization').split()[1]
        except Exception as e:
            return False
        result = decode_jwt(token)
        if result['status'] == 'success':
            request.user_id = result['data']['user_id']
            try:
                User.objects.get(pk=request.user_id)
            except Exception:
                return PermissionDenied('The user does not exist.')
            return True
        elif result['status'] == 'error':
            raise PermissionDenied(result['error_message'])
        return False