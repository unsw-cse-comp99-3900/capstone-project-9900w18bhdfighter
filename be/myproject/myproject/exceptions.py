from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if 'detail' in response.data:
            response.data['error'] = response.data.pop('detail', 'An error occurred')

    return response
