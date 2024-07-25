import jwt
from django.conf import settings
from myapp.src.models.models import User


def decode_jwt(token):
    try:
        # Decode the token
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return {"status": "success", "data": decoded}
    except jwt.ExpiredSignatureError:
        # Token has expired
        return {"status": "error", "error_message": "Token has expired."}
    except jwt.InvalidTokenError:
        # Token is invalid
        return {"status": "error", "error_message": "Invalid token."}


def get_user_friendly_errors(serializer_errors):

    errors = {"errors": ""}
    if isinstance(serializer_errors, dict):
        for _, value in serializer_errors.items():
            errors["errors"] += f"{_}: {value}\n"
    elif isinstance(serializer_errors, list):
        for dic in serializer_errors:
            for _, value in dic.items():
                errors["errors"] += f"{_}: {value}\n"
    return errors


def clean_duplicate_users():
    unique_users = set()
    duplicates = []

    for user in User.objects.all():
        if user.EmailAddress in unique_users:
            duplicates.append(user)
        else:
            unique_users.add(user.EmailAddress)
    for duplicate in duplicates:
        duplicate.delete()
    return len(duplicates)
