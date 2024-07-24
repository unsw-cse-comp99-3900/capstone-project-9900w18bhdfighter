import pdfkit
from django.conf import settings
from myapp.src.models.models import GroupScore


def generate_pdf_from_html(html_content, output_path):
    pdfkit.from_string(html_content, output_path)
    return output_path


def generate_group_report(group):
    group_members = group.groupuserslink_set.all()
    assigned_project = (
        group.grouppreference_set.first().Preference
        if group.grouppreference_set.exists()
        else None
    )
    group_score = GroupScore.objects.filter(Group=group).first()
    score = group_score.Score if group_score else "N/A"
    feedback = group_score.Feedback if group_score else "N/A"
    marker = group_score.Marker if group_score else "N/A"

    html_content = f"""
    <html>
    <head><title>Report for Group {group.GroupName}</title></head>
    <body>
    <h1>Report for Group {group.GroupName}</h1>
    <p>Group ID: {group.GroupID}</p>
    <p>Group Name: {group.GroupName}</p>
    <p>Group Members:</p>
    <ul>
    """

    for member in group_members:
        html_content += f"<li>{member.UserID.FirstName} {member.UserID.LastName}</li>"

    html_content += f"""
    </ul>
    <p>Assigned Project: {assigned_project.ProjectName if assigned_project else 'None'}</p>
    <p>Score: {score}</p>
    <p>Feedback: {feedback}</p>
    <p>Marker: {marker.FirstName} {marker.LastName if marker else 'N/A'}</p>
    </body>
    </html>
    """

    output_path = f"{settings.MEDIA_ROOT}/reports/report_group_{group.GroupID}.pdf"

    return generate_pdf_from_html(html_content, output_path)
