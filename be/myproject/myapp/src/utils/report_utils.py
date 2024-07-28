from myapp.src.models.models import Group, GroupProjectsLink, GroupScore


def generate_group_report_data():
    groups = Group.objects.all()
    group_data = []

    for group in groups:
        group_members = group.groupuserslink_set.all()
        assigned_project = GroupProjectsLink.objects.filter(GroupID=group).first()
        group_pref = group.Preferences.all()
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
                "group_pref": group_pref,
            }
        )

    return group_data
