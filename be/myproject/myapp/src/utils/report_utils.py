from django.conf import settings
from myapp.src.models.models import Group, GroupScore
import os
from pyvirtualdisplay import Display
import subprocess

def generate_pdf_from_html(html_content, output_path):
    temp_dir = settings.MEDIA_ROOT
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    html_file = os.path.join(temp_dir, 'temp.html')
    with open(html_file, 'w') as f:
        f.write(html_content)

    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        command = ['wkhtmltopdf', html_file, output_path]
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            print(f"Error generating PDF: {result.stderr}")
            raise IOError(f"wkhtmltopdf exited with non-zero code {result.returncode}. error:\n{result.stderr}")

    finally:
        if os.path.exists(html_file):
            os.remove(html_file)

    return output_path

def generate_group_report(group):
    group_members = group.groupuserslink_set.all()
    assigned_project = group.grouppreference_set.first().Preference if group.grouppreference_set.exists() else None
    group_score = GroupScore.objects.filter(group=group).first()
    score = group_score.score if group_score else 'N/A'
    feedback = group_score.feedback if group_score else 'N/A'
    marker = group_score.markers if group_score else 'N/A'

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
    <p>Marker: {marker.FirstName if marker != 'N/A' else 'N/A'} {marker.LastName if marker != 'N/A' else 'N/A'}</p>
    </body>
    </html>
    """

    output_path = os.path.join(settings.MEDIA_ROOT, 'reports', f'report_group_{group.GroupID}.pdf')
    
    return generate_pdf_from_html(html_content, output_path)