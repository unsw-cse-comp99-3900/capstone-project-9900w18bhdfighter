import os
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from myapp.src.models.models import Group, User
from myapp.src.utils.report_utils import generate_group_report
from myapp.src.utils.utils import decode_jwt
from rest_framework.parsers import JSONParser
from rest_framework.views import csrf_exempt



global_report_urls = {}

@csrf_exempt
def generate_report(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] != 'success':
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)

        user_data = result['data']
        try:
            user = User.objects.get(pk=user_data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'Authentication failed'}, status=401)
        
        if user.UserRole not in [3, 4, 5]:
            return JsonResponse({'error': 'Permission denied, you cannot generate reports.'}, status=403)

        group_id = data['group_id']
        group = get_object_or_404(Group, pk=group_id)

        report_path = generate_group_report(group)
        report_url = request.build_absolute_uri(f'/media/reports/{os.path.basename(report_path)}')
        
        global_report_urls[group_id] = report_url

        return JsonResponse({'message': 'Report generated successfully', 'report_url': report_url}, status=201)


@csrf_exempt
def download_report(request):
    if request.method == 'GET':
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] != 'success':
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)

        user_data = result['data']
        try:
            user = User.objects.get(pk=user_data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'Authentication failed'}, status=401)
        
        if user.UserRole not in [3, 4, 5]:
            return JsonResponse({'error': 'Permission denied, you cannot generate reports.'}, status=403)

        group_id = request.GET.get('group_id')
        if not group_id:
            return JsonResponse({'error': 'Group ID not provided'}, status=400)

        report_url = global_report_urls.get(int(group_id))
        if not report_url:
            return JsonResponse({'error': 'No report URL found for the given group ID'}, status=404)

        report_path = os.path.join(settings.MEDIA_ROOT, 'reports', os.path.basename(report_url))
        if not os.path.exists(report_path):
            return JsonResponse({'error': 'Report not found'}, status=404)

        with open(report_path, 'rb') as report_file:
            response = HttpResponse(report_file.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(report_path)}"'
            return response


@csrf_exempt
def view_report(request):
    if request.method == 'GET':
        token = request.headers.get('Authorization').split()[1]
        result = decode_jwt(token)

        if result['status'] != 'success':
            return JsonResponse({'error': 'Invalid or Expired Token'}, status=401)

        user_data = result['data']
        try:
            user = User.objects.get(pk=user_data['user_id'])
        except User.DoesNotExist:
            return JsonResponse({'error': 'Authentication failed'}, status=401)
        
        if user.UserRole not in [3, 4, 5]:
            return JsonResponse({'error': 'Permission denied, you cannot generate reports.'}, status=403)

        group_id = request.GET.get('group_id')
        if not group_id:
            return JsonResponse({'error': 'Group ID not provided'}, status=400)

        report_url = global_report_urls.get(int(group_id))
        if not report_url:
            return JsonResponse({'error': 'No report URL found for the given group ID'}, status=404)

        report_path = os.path.join(settings.MEDIA_ROOT, 'reports', os.path.basename(report_url))
        if not os.path.exists(report_path):
            return JsonResponse({'error': 'Report not found'}, status=404)

        with open(report_path, 'rb') as report_file:
            response = HttpResponse(report_file.read(), content_type='application/pdf')
            return response