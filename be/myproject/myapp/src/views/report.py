from django.http import HttpResponse
from django.template.loader import render_to_string
from myapp.src.utils.report_utils import generate_group_report_data
from rest_framework.decorators import api_view, permission_classes
from xhtml2pdf import pisa


@api_view(["GET"])
@permission_classes([])
def generate_report(request):
    groups = generate_group_report_data()
    context = {"groups": groups}
    html_content = render_to_string("template.html", context)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="assessment_report.pdf"'

    pisa_status = pisa.CreatePDF(html_content, dest=response)

    if pisa_status.err:
        return HttpResponse("Shit happens <pre>" + html_content + "</pre>")

    return response


# @csrf_exempt
# def download_report(request):
#     if request.method == "GET":
#         token = request.headers.get("Authorization").split()[1]
#         result = decode_jwt(token)

#         if result["status"] != "success":
#             return JsonResponse({"error": "Invalid or Expired Token"}, status=401)

#         user_data = result["data"]
#         try:
#             user = User.objects.get(pk=user_data["user_id"])
#         except User.DoesNotExist:
#             return JsonResponse({"error": "Authentication failed"}, status=401)

#         if user.UserRole not in [3, 4, 5]:
#             return JsonResponse(
#                 {"error": "Permission denied, you cannot generate reports."}, status=403
#             )

#         group_id = request.GET.get("group_id")
#         if not group_id:
#             return JsonResponse({"error": "Group ID not provided"}, status=400)

#         report_url = global_report_urls.get(int(group_id))
#         if not report_url:
#             return JsonResponse(
#                 {"error": "No report URL found for the given group ID"}, status=404
#             )

#         report_path = os.path.join(
#             settings.MEDIA_ROOT, "reports", os.path.basename(report_url)
#         )
#         if not os.path.exists(report_path):
#             return JsonResponse({"error": "Report not found"}, status=404)

#         with open(report_path, "rb") as report_file:
#             response = HttpResponse(report_file.read(), content_type="application/pdf")
#             response["Content-Disposition"] = (
#                 f'attachment; filename="{os.path.basename(report_path)}"'
#             )
#             return response


# @csrf_exempt
# def view_report(request):
#     if request.method == "GET":
#         token = request.headers.get("Authorization").split()[1]
#         result = decode_jwt(token)

#         if result["status"] != "success":
#             return JsonResponse({"error": "Invalid or Expired Token"}, status=401)

#         user_data = result["data"]
#         try:
#             user = User.objects.get(pk=user_data["user_id"])
#         except User.DoesNotExist:
#             return JsonResponse({"error": "Authentication failed"}, status=401)

#         if user.UserRole not in [3, 4, 5]:
#             return JsonResponse(
#                 {"error": "Permission denied, you cannot generate reports."}, status=403
#             )

#         group_id = request.GET.get("group_id")
#         if not group_id:
#             return JsonResponse({"error": "Group ID not provided"}, status=400)

#         report_url = global_report_urls.get(int(group_id))
#         if not report_url:
#             return JsonResponse(
#                 {"error": "No report URL found for the given group ID"}, status=404
#             )

#         report_path = os.path.join(
#             settings.MEDIA_ROOT, "reports", os.path.basename(report_url)
#         )
#         if not os.path.exists(report_path):
#             return JsonResponse({"error": "Report not found"}, status=404)

#         with open(report_path, "rb") as report_file:
#             response = HttpResponse(report_file.read(), content_type="application/pdf")
#             return response
