import os
import subprocess

from django.conf import settings
from myapp.src.models.models import Group, GroupProjectsLink, GroupScore


def generate_pdf_from_html(html_content, output_path):
    temp_dir = settings.MEDIA_ROOT
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    html_file = os.path.join(temp_dir, "temp.html")
    with open(html_file, "w") as f:
        f.write(html_content)

    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        command = ["wkhtmltopdf", html_file, output_path]
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            print(f"Error generating PDF: {result.stderr}")
            raise IOError(
                f"wkhtmltopdf exited with non-zero code {result.returncode}. error:\n{result.stderr}"
            )

    finally:
        if os.path.exists(html_file):
            os.remove(html_file)

    return output_path


def generate_group_report_data():
    groups = Group.objects.all()
    group_data = []

    for group in groups:
        group_members = group.groupuserslink_set.all()
        assigned_project = GroupProjectsLink.objects.filter(GroupID=group).first()
        if assigned_project:
            assigned_project = assigned_project.ProjectID.ProjectName
        else:
            assigned_project = "N/A"

        group_score = GroupScore.objects.filter(group=group).first()
        score = group_score.score if group_score else "N/A"
        feedback = group_score.feedback if group_score else "N/A"
        marker = group_score.markers if group_score else None

        group_data.append(
            {
                "GroupID": group.GroupID,
                "GroupName": group.GroupName,
                "group_members": group_members,
                "assigned_project": assigned_project,
                "score": score,
                "feedback": feedback,
                "marker": marker,
            }
        )

    return group_data
