from myapp.src.models.models import GroupUsersLink, TimeRule
from myapp.src.utils.utils import decode_jwt
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission


class RoleBasedPermission(BasePermission):
    def __init__(self, allowed_roles=None):
        self.allowed_roles = allowed_roles if allowed_roles is not None else []

    def has_permission(self, request, view):
        from myapp.src.models.models import User

        try:
            token = request.headers.get("Authorization").split()[1]
        except Exception:
            return False

        result = decode_jwt(token)
        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except User.DoesNotExist:
                return False

            if user.UserRole not in self.allowed_roles:
                raise PermissionDenied(
                    "You do not have permission to perform this action."
                )

            request.user = user
            return True

        return False


class OnlyForAdmin(RoleBasedPermission):
    def __init__(self):
        super().__init__(allowed_roles=[5])


class ForPartialRole(RoleBasedPermission):
    def __init__(self, allowed_roles=[]):
        super().__init__(allowed_roles=allowed_roles)


class PartialRole(BasePermission):
    def has_permission(self, request, view):
        from myapp.src.models.models import User

        try:
            token = request.headers.get("Authorization").split()[1]
        except Exception as e:
            return False

        result = decode_jwt(token)
        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except Exception as e:
                return False
            if user.UserRole not in request.permission_range:
                raise PermissionDenied(
                    "You do not have permission to perform this action."
                )
            request.user = user
            return True
        return False


class ForValidToken(BasePermission):
    def has_permission(self, request, view):
        from myapp.src.models.models import User

        try:
            token = request.headers.get("Authorization").split()[1]
        except Exception as e:
            return False
        result = decode_jwt(token)
        if result["status"] == "success":
            request.user_id = result["data"]["user_id"]

            try:
                User.objects.get(pk=request.user_id)
            except Exception:
                return PermissionDenied("The user does not exist.")
            return True
        elif result["status"] == "error":
            raise PermissionDenied(result["error_message"])
        return False


class ForGroupMemberOrManager(BasePermission):
    def has_permission(self, request, view):
        from myapp.src.models.models import User

        try:
            token = request.headers.get("Authorization").split()[1]
        except Exception as e:
            return False
        result = decode_jwt(token)
        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except Exception as e:
                return False
            # Check if the user is a member of the group
            # or the manager
            if not GroupUsersLink.objects.filter(
                UserID=user, GroupID=view.get_object()
            ).exists() and not user.UserRole in [3, 4, 5]:
                raise PermissionDenied(
                    "You do not have permission to perform this action."
                )

            request.user = user
            return True
        return False


class GroupRegisterDeadlinePermission(BasePermission):
    def has_permission(self, request, view):
        from django.utils.timezone import now
        from myapp.src.models.models import User

        try:
            token = request.headers.get("Authorization").split()[1]
        except Exception:
            return False
        result = decode_jwt(token)
        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except User.DoesNotExist:
                return False

            request.user = user
            if user.UserRole in [5]:  # Admin role
                return True

            # 找到time rule 里面active的rule
            rule = TimeRule.objects.filter(IsActive=True).first()
            # 如果没有active的rule那么deadline就是无穷大
            if not rule:
                return True

            if rule.GroupFreezeTime < now():
                raise PermissionDenied(
                    "Deadline has passed. You cannot perform this action."
                )
            return True
        return False


class ProjectDeadlinePermission(BasePermission):
    def has_permission(self, request, view):
        from django.utils.timezone import now
        from myapp.src.models.models import User

        try:
            token = request.headers.get("Authorization").split()[1]
        except Exception:
            return False

        result = decode_jwt(token)
        if result["status"] == "success":
            user_data = result["data"]
            try:
                user = User.objects.get(pk=user_data["user_id"])
            except User.DoesNotExist:
                return False

            request.user = user
            if user.UserRole in [5]:  # Admin role
                return True

            # 找到time rule 里面active的rule
            rule = TimeRule.objects.filter(IsActive=True).first()
            # 如果没有active的rule那么deadline就是无穷大
            if not rule:
                return True

            if rule.ProjectDeadline < now():
                raise PermissionDenied(
                    "Deadline has passed. You cannot perform this action."
                )
            return True
        return False
