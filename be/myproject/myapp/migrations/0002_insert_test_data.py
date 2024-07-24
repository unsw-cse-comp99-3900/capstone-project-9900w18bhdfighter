# Generated by Django 5.0.6 on 2024-07-12 16:23
from django.utils import timezone
from django.db import migrations, models
from django.contrib.auth.hashers import make_password
import random



    
def add_roles(apps, schema_editor):
    User = apps.get_model('myapp', 'User')
    stu=User.objects.create(FirstName='stu', LastName='stu',EmailAddress="stu@stu.com",Passwd=make_password("stu"),UserRole=1,UserInformation="")
    stu.save()
    cord=User.objects.create(FirstName='cord', LastName='cord',EmailAddress="cord@cord.com",Passwd=make_password("cord"),UserRole=4,UserInformation="")
    cord.save()
    cli=User.objects.create(FirstName='cli', LastName='cli',EmailAddress="cli@cli.com",Passwd=make_password("cli"),UserRole=2,UserInformation="")
    cli.save()
    admin=User.objects.create(FirstName='admin', LastName='admin',EmailAddress="admin@admin.com",Passwd=make_password("admin"),UserRole=5,UserInformation="")
    admin.save()
    tut=User.objects.create(FirstName='tut', LastName='tut',EmailAddress="tut@tut.com",Passwd=make_password("tut"),UserRole=3,UserInformation="")
    tut.save()
    
    
    print("=====================================")
    print("admin created")
    print("tut created")
    print("stu created")
    print("cord created")
    print("cli created")
    

def add_areas(apps, schema_editor):
    areas = [
    "Programming Languages",
    "Machine Learning & AI",
    "Web Development",
    "Frameworks & Libraries",
    "Database Management",
    "Mobile App Development",
    "Data Processing & Visualization",
    "Security & Privacy",
    "DevOps & CI/CD",
    "UI/UX Design",
    "Cloud Platforms",
    "Miscellaneous"
]
    Area = apps.get_model('myapp', 'Area')
    for area in areas:
        Area.objects.create(AreaName=area)
    print("=====================================")
    print("Areas created")
    
def add_course_code(apps, schema_editor):
    course= [
    "COMP9900",
    "COMP3900",
    ]
    CourseCode = apps.get_model('myapp', 'CourseCode')
    for c in course:
        CourseCode.objects.create(CourseName=c)
    print("=====================================")
    print("CourseCode created")
    

def create_test_users(apps, schema_editor):
    User = apps.get_model('myapp', 'User')
    CourseCode = apps.get_model('myapp', 'CourseCode')
    # Create additional students
    user_ls = []
    course_ls=list(CourseCode.objects.all())
    for i in range(100):
        email=f"stu{i}@stu.com"
        password = make_password("stu")
        user_ls.append(User(
            FirstName=f"stu{i}",
            LastName=f"stu{i}",
            EmailAddress=email,
            Passwd=password,
            UserRole=1,
            UserInformation=f"Information for stu{i}",
            CourseCode=course_ls[i%2] 
        ))
    User.objects.bulk_create(user_ls)
    # Create additional clients
    user_ls = []
    for i in range(10):
        email=f"cli{i}@cli.com"
        password = make_password("cli")
        user_ls.append(User(
            FirstName=f"cli{i}",
            LastName=f"cli{i}",
            EmailAddress=email,
            Passwd=password,
            UserRole=2,
            UserInformation=f"Information for cli{i}"
        ))
    User.objects.bulk_create(user_ls)

    print("Test users created successfully.")

def add_projects(apps, schema_editor):
    Project = apps.get_model('myapp', 'Project')
    User = apps.get_model('myapp', 'User')
    random.seed(42)
    users = list(User.objects.filter(UserRole=2))
    Project.objects.bulk_create([
        Project(
            ProjectName=f"Project {i}",
            ProjectDescription=f"Description for Project {i}",
            ProjectOwner=user.EmailAddress,
            CreatedBy=user,
            MaxNumOfGroup=random.randint(6, 10),
        )
        for i, user in enumerate(users)
    ])
    print("Test projects created successfully.")
 
     
def add_groups(apps, schema_editor):
    User = apps.get_model('myapp', 'User')
    Group = apps.get_model('myapp', 'Group')    
    CourseCode = apps.get_model('myapp', 'CourseCode')

    cord = User.objects.get(EmailAddress="cord@cord.com")
    admin = User.objects.get(EmailAddress="admin@admin.com")
    tut = User.objects.get(EmailAddress="tut@tut.com")

    # Creating groups

    course=CourseCode.objects.get(CourseName="COMP9900")

    group1 = Group.objects.create(GroupName='Group 1', GroupDescription='Description for Group 1', CreatedBy=cord, MaxMemberNumber=6, CourseCode=course)
    group2 = Group.objects.create(GroupName='Group 2', GroupDescription='Description for Group 2', CreatedBy=admin, MaxMemberNumber=6, CourseCode=course)
    group3 = Group.objects.create(GroupName='Group 3', GroupDescription='Description for Group 3', CreatedBy=tut, MaxMemberNumber=6, CourseCode=course)

    group1.save()
    group2.save()
    group3.save()

    # create 10 more groups
    users9900=User.objects.filter(UserRole=1, CourseCode__CourseName="COMP9900")
    users3900=User.objects.filter(UserRole=1, CourseCode__CourseName="COMP3900")
    list=[users9900,users3900]
    for i in range(50):
        user=list[i%2][i]
        if not user:
            break
        group = Group.objects.create(
            GroupName=f"Group {i+4}",
            GroupDescription=f"Description for Group {i+4}",
            CreatedBy=user,
            MaxMemberNumber=random.randint(5,7),
            CourseCode=user.CourseCode
        )
        group.save()
    print("Groups created successfully.")
    
def assign_users_to_groups(apps, schema_editor):
    random.seed(42)

    User = apps.get_model('myapp', 'User')
    Group = apps.get_model('myapp', 'Group')
    GroupUsersLink = apps.get_model('myapp', 'GroupUsersLink')

    def assign_users_to_course(course_name):
        users = list(User.objects.filter(UserRole=1, CourseCode__CourseName=course_name))
        existing_groups = list(Group.objects.filter(CourseCode__CourseName=course_name))

        while users and existing_groups:
            for user in users[:]:  # 使用切片副本来安全地修改列表
                if not existing_groups:
                    break
                group = random.choice(existing_groups)
                if group.GroupMembers.count() >= group.MaxMemberNumber:
                    existing_groups.remove(group)
                    continue

                GroupUsersLink.objects.create(UserID=user, GroupID=group)
                users.remove(user)
                if group.GroupMembers.count() >= group.MaxMemberNumber:
                    existing_groups.remove(group)

    assign_users_to_course("COMP9900")
    assign_users_to_course("COMP3900")

    print("Assignment done")


def add_group_preferences(apps, schema_editor):
    Group = apps.get_model('myapp', 'Group')
    Project = apps.get_model('myapp', 'Project')
    GroupPreference = apps.get_model('myapp', 'GroupPreference')
    random.seed(42)
    projects = Project.objects.all()
    print(projects)
    groups = Group.objects.annotate(num_members=models.Count('groupuserslink')).filter(num_members__gt=0)

    for group in groups:
    
        for i in range(3):
            if projects.count() == 0:
                break
            project = random.choice(projects)
            GroupPreference.objects.create(Preference=project, Group=group, Rank=i+1)
            projects = projects.exclude(ProjectID=project.ProjectID)
    print("Group preferences added")

def assign_group_to_projects(apps, schema_editor):
    random.seed(42)
    Project = apps.get_model('myapp', 'Project')
    Group = apps.get_model('myapp', 'Group')
    GroupProjectsLink = apps.get_model('myapp', 'GroupProjectsLink')
    groups = Group.objects.annotate(num_members=models.Count('groupuserslink')).filter(num_members__gt=0)
    existing_projects = list(Project.objects.all())

    for project in existing_projects:
        if groups.count() == 0:
            break
        group = random.choice(groups)
        GroupProjectsLink.objects.create(GroupID=group, ProjectID=project)
        groups=groups.exclude(GroupID=group.GroupID)
    print("Groups assigned to projects")
    

def add_time_rule(apps, schema_editor):
    timerule= [
    "Test All Due",
    "Test All Active",
    ]
    TimeRule = apps.get_model('myapp', 'TimeRule')
    for t in timerule:
        if t=="Test All Active":
            projectDeadline= timezone.now()+timezone.timedelta(days=300)
            groupFreezeTime= timezone.now()+timezone.timedelta(days=300)
            TimeRule.objects.create(RuleName=t,ProjectDeadline=projectDeadline,GroupFreezeTime=groupFreezeTime,IsActive=True)
        
        if t=="Test All Due":
            projectDeadline= timezone.now()-timezone.timedelta(days=300)
            groupFreezeTime= timezone.now()-timezone.timedelta(days=300)
            TimeRule.objects.create(RuleName=t,ProjectDeadline=projectDeadline,GroupFreezeTime=groupFreezeTime,IsActive=False)
        
    print("=====================================")
    print("TimeRule created")
class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_roles),
        migrations.RunPython(add_areas),
        migrations.RunPython(add_course_code),
        migrations.RunPython(add_time_rule),
        migrations.RunPython(create_test_users),
        migrations.RunPython(add_projects),
        migrations.RunPython(add_groups),
        migrations.RunPython(assign_users_to_groups),
        migrations.RunPython(add_group_preferences),
        migrations.RunPython(assign_group_to_projects),
       
    ]