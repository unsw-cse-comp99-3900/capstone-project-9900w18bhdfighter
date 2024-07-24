from myapp.src.models.models import (
    Group,
    GroupPreference,
    GroupSkillEvaluation,
    Project,
    Skill,
    SkillProject,
)


class MatchScore:
    def __init__(self, group_id, score=0, areas=None):
        if areas is None:
            areas = set()
        self.group_id = group_id
        self.score = score
        self.areas = areas

    def __repr__(self):
        return f"MatchScore(group_id={self.group_id}, score={self.score}, areas={self.areas})"

    def to_dict(self):
        return {
            "groupID": self.group_id,
            "score": self.score,
            "areas": list(self.areas),
        }


class Preference:
    def __init__(self, project_id, as1=[], as2=[], as3=[], available_num=0, areas={}):
        self.project_id = project_id
        self.as1 = as1
        self.as2 = as2
        self.as3 = as3
        self.available_num = available_num
        self.areas = areas


def allocate_groups(group_preferences):
    def allocate_by_preference(gp, preferences, group_allocation, allocation_result):
        available_num = gp.available_num
        for pref in preferences:
            group_id = pref.group_id
            if (
                group_id not in group_allocation
                and len(allocation_result[gp.project_id]) < available_num
            ):
                allocation_result[gp.project_id].append(group_id)
                group_allocation.add(group_id)
                if len(allocation_result[gp.project_id]) >= available_num:
                    break

    allocation_result = {gp.project_id: [] for gp in group_preferences}
    group_allocation = set()

    # 处理第一志愿分配
    for gp in group_preferences:
        as1_prefs = sorted(gp.as1, key=lambda x: x.score, reverse=True)
        allocate_by_preference(gp, as1_prefs, group_allocation, allocation_result)

    # 处理第二志愿分配
    for gp in group_preferences:
        if len(allocation_result[gp.project_id]) < gp.available_num:
            as2_prefs = sorted(gp.as2, key=lambda x: x.score, reverse=True)
            allocate_by_preference(gp, as2_prefs, group_allocation, allocation_result)

    # 处理第三志愿分配
    for gp in group_preferences:
        if len(allocation_result[gp.project_id]) < gp.available_num:
            as3_prefs = sorted(gp.as3, key=lambda x: x.score, reverse=True)
            allocate_by_preference(gp, as3_prefs, group_allocation, allocation_result)

    return allocation_result, group_allocation


def allocate_remaining_groups(
    allocation_result, remaining_groups, remaining_projects, group_preferences
):

    def calculate_match_score(project_areas, group_areas):
        return len(project_areas & group_areas)

    while remaining_groups and remaining_projects:
        best_match = None
        best_score = -1

        for group in remaining_groups:
            group_areas = get_group_areas_set(group)
            for proj_id in remaining_projects:
                preference = next(
                    (gp for gp in group_preferences if gp.project_id == proj_id), None
                )
                if preference:
                    score = calculate_match_score(preference.areas, group_areas)
                    if score > best_score:
                        best_score = score
                        best_match = (group, proj_id)

        if best_match:
            group, proj_id = best_match
            allocation_result[proj_id].append(group.GroupID)
            remaining_groups.remove(group)
            preference = next(
                (gp for gp in group_preferences if gp.project_id == proj_id), None
            )
            if (
                preference
                and len(allocation_result[proj_id]) >= preference.available_num
            ):
                remaining_projects.remove(proj_id)
        else:
            break

    return allocation_result


def get_group_areas_set(group):
    group_members = group.GroupMembers.all()
    areas_set = set()
    for member in group_members:
        areas = member.Areas.all()
        for area in areas:
            areas_set.add(area.AreaID)
    return areas_set


def get_group_skills_score(group, proj):
    proj_skills = SkillProject.objects.filter(Project=proj)
    group_evaluation = GroupSkillEvaluation.objects.filter(EvaluateGroup=group)
    group_skills_score = {}
    for proj_skill in proj_skills:
        for evaluation in group_evaluation:
            if evaluation.Skill == proj_skill.Skill:
                group_skills_score[proj_skill.Skill] = evaluation.Score
    total_score = sum(group_skills_score.values())
    return total_score / len(group_skills_score) if group_skills_score else 0


def get_match_scores(proj, rank):
    group_preferences = GroupPreference.objects.filter(Preference=proj, Rank=rank)

    match_scores = []
    for group_preference in group_preferences:
        group = group_preference.Group
        areas_set = get_group_areas_set(group)
        skills_score = get_group_skills_score(group, proj)
        match_score = MatchScore(group.GroupID, score=skills_score, areas=areas_set)
        match_scores.append(match_score)
    return match_scores


def get_project_areas_set(proj):
    proj_skills = SkillProject.objects.filter(Project=proj)
    areas_set = set()
    for proj_skill in proj_skills:
        skill = Skill.objects.get(SkillID=proj_skill.Skill.SkillID)
        area = skill.Area
        areas_set.add(area.AreaID)
    return areas_set


def launch():
    projects = Project.objects.all()
    groups = Group.objects.all()

    group_preferences = []
    project_areas = {}

    remaining_groups = list(groups)

    for proj in projects:
        proj_id = proj.ProjectID
        available_num = proj.MaxNumOfGroup
        areas_set = get_project_areas_set(proj)
        project_areas[proj_id] = areas_set
        as1 = get_match_scores(proj, 1)
        as2 = get_match_scores(proj, 2)
        as3 = get_match_scores(proj, 3)
        preference = Preference(proj_id, as1, as2, as3, available_num, areas_set)
        group_preferences.append(preference)

    allocation_result, group_allocation = allocate_groups(group_preferences)

    # Remove allocated groups from remaining_groups
    remaining_groups = [
        group for group in remaining_groups if group.GroupID not in group_allocation
    ]

    remaining_projects = {
        gp.project_id
        for gp in group_preferences
        if len(allocation_result[gp.project_id]) < gp.available_num
    }

    # Update available_num for projects based on already allocated groups
    for gp in group_preferences:
        gp.available_num -= len(allocation_result[gp.project_id])

    final_allocation = allocate_remaining_groups(
        allocation_result, remaining_groups, remaining_projects, group_preferences
    )

    print(final_allocation)
    return final_allocation
