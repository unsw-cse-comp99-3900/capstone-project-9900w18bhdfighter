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
        return {"groupID": self.group_id, "score": self.score, "areas": list(self.areas)}

class GroupPreference:
    def __init__(self, project_id, as1, as2, available_num, areas):
        self.project_id = project_id
        self.as1 = as1
        self.as2 = as2
        self.available_num = available_num
        self.areas = areas

# 生成可控的模拟数据
group_preferences = [
    # project id, 第一志愿的组及其分数, 第二志愿的组及其分数, project可分配的组数, areas集合
    GroupPreference(1, [MatchScore(1, 10, {'A', 'B'}), MatchScore(2, 8, {'A'})], [MatchScore(3, 7, {'B'}), MatchScore(4, 6, {'A'})], 6, {'A', 'B'}),
    GroupPreference(2, [MatchScore(2, 9, {'B', 'C'}), MatchScore(3, 8, {'B'})], [MatchScore(1, 7, {'A'}), MatchScore(5, 6, {'C'})], 5, {'B', 'C'}),
    GroupPreference(3, [MatchScore(3, 10, {'C', 'D'}), MatchScore(1, 8, {'C'})], [MatchScore(2, 7, {'B'}), MatchScore(4, 6, {'D'})], 7, {'C', 'D'}),
    GroupPreference(4, [MatchScore(4, 10, {'A', 'D'}), MatchScore(5, 8, {'D'})], [MatchScore(1, 7, {'A'}), MatchScore(2, 6, {'D'})], 6, {'A', 'D'}),
    GroupPreference(5, [MatchScore(5, 10, {'A', 'C'}), MatchScore(4, 8, {'C'})], [MatchScore(3, 7, {'D'}), MatchScore(1, 6, {'A'})], 5, {'A', 'C'})
]

def allocate_groups(group_preferences):
    # 初始化结果字典
    allocation_result = {gp.project_id: [] for gp in group_preferences}
    group_allocation = set()  # 用于记录已经分配的组

    # 处理第一志愿分配
    for gp in group_preferences:
        # 按照分数从高到低排序
        as1_prefs = sorted(gp.as1, key=lambda x: x.score, reverse=True)
        available_num = gp.available_num
        for pref in as1_prefs:
            group_id = pref.group_id
            if group_id not in group_allocation and len(allocation_result[gp.project_id]) < available_num:
                allocation_result[gp.project_id].append(group_id)
                group_allocation.add(group_id)
                if len(allocation_result[gp.project_id]) >= available_num:
                    break

    # 处理第二志愿分配
    for gp in group_preferences:
        if len(allocation_result[gp.project_id]) < gp.available_num:
            # 按照分数从高到低排序
            as2_prefs = sorted(gp.as2, key=lambda x: x.score, reverse=True)
            available_num = gp.available_num
            for pref in as2_prefs:
                group_id = pref.group_id
                if group_id not in group_allocation and len(allocation_result[gp.project_id]) < available_num:
                    allocation_result[gp.project_id].append(group_id)
                    group_allocation.add(group_id)
                    if len(allocation_result[gp.project_id]) >= available_num:
                        break

    return allocation_result, group_allocation

def allocate_remaining_groups(allocation_result, group_preferences, group_allocation):
    remaining_projects = {gp.project_id for gp in group_preferences if len(allocation_result[gp.project_id]) < gp.available_num}
    remaining_groups = {pref.group_id for gp in group_preferences for pref in gp.as1 + gp.as2 if pref.group_id not in group_allocation}

    def calculate_match_score(project_areas, group_areas):
        return len(project_areas & group_areas)

    while remaining_projects and remaining_groups:
        best_match = None
        best_score = -1

        for project_id in remaining_projects:
            project_preference = next(gp for gp in group_preferences if gp.project_id == project_id)
            for group_id in remaining_groups:
                group_preference = next(pref for gp in group_preferences for pref in gp.as1 + gp.as2 if pref.group_id == group_id)
                score = calculate_match_score(project_preference.areas, group_preference.areas)
                if score > best_score:
                    best_match = (project_id, group_id)
                    best_score = score

        if best_match:
            project_id, group_id = best_match
            allocation_result[project_id].append(group_id)
            group_allocation.add(group_id)
            remaining_groups.remove(group_id)
            if len(allocation_result[project_id]) >= next(gp for gp in group_preferences if gp.project_id == project_id).available_num:
                remaining_projects.remove(project_id)
        else:
            break

    return allocation_result

# 调用函数并打印结果
allocation_result, group_allocation = allocate_groups(group_preferences)
final_allocation = allocate_remaining_groups(allocation_result, group_preferences, group_allocation)
print(final_allocation)
