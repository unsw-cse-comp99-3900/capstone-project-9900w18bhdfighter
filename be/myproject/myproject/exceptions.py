from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if "detail" in response.data:
            response.data["error"] = response.data.pop("detail", "An error occurred")
        if "non_field_errors" in response.data:
            response.data["error"] = response.data.pop(
                "non_field_errors", "An error occurred"
            )

    return response
