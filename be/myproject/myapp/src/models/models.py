# Create your models here.
from django.db import models
from django.utils import timezone


class Area(models.Model):
    AreaID = models.AutoField(primary_key=True)
    AreaName = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.AreaName


class TimeRule(models.Model):
    TimeNodeID = models.AutoField(primary_key=True)
    # 这个时间过后,学生不能再自行加入离开，学生不能选择小组偏好，不能进行自评
    GroupFreezeTime = models.DateTimeField(default=timezone.now)

    # 项目结束时间，这时候可以mark了
    ProjectDeadline = models.DateTimeField(default=timezone.now)

    # RuleRange
    RuleName = models.CharField(max_length=255)

    # 是否启用规则
    IsActive = models.BooleanField(default=False)

    # 只能有一个规则是active的
    def save(self, *args, **kwargs):
        if self.IsActive:
            # Deactivate other active rules
            TimeRule.objects.filter(IsActive=True).update(IsActive=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.RuleName


class User(models.Model):
    ROLE_CHOICES = [
        (1, "student"),
        (2, "client"),
        (3, "tut"),
        (4, "cord"),
        (5, "admin"),
    ]
    UserID = models.AutoField(primary_key=True)
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    EmailAddress = models.CharField(max_length=255, unique=True)
    Passwd = models.CharField(max_length=255)
    # 1: student, 2:client, 3:tut  4:cord 5:admin
    UserRole = models.IntegerField(
        choices=ROLE_CHOICES, default=1, null=True, blank=True
    )
    UserInformation = models.CharField(max_length=255)
    Areas = models.ManyToManyField(Area, through="StudentArea")
    Notifications = models.ManyToManyField(
        "Notification", through="NotificationReceiver"
    )
    Contacts = models.ManyToManyField("self", through="Contact", symmetrical=False)
    # COMP[39]900
    CourseCode = models.ForeignKey(
        "CourseCode", on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self):
        return str(self.UserID)


class CourseCode(models.Model):
    CourseCodeID = models.AutoField(primary_key=True)
    CourseName = models.CharField(max_length=10)

    def __str__(self):
        return self.CourseName


class Project(models.Model):
    ProjectID = models.AutoField(primary_key=True)
    ProjectName = models.CharField(max_length=255)
    ProjectDescription = models.TextField()
    ProjectOwner = models.CharField(max_length=255)
    CreatedBy = models.ForeignKey(
        User, related_name="created_projects", on_delete=models.CASCADE
    )
    MaxNumOfGroup = models.IntegerField(default=1)
    Groups = models.ManyToManyField("Group", through="GroupProjectsLink")

    def __str__(self):
        return str(self.ProjectID)


class Skill(models.Model):
    SkillID = models.AutoField(primary_key=True)
    SkillName = models.CharField(max_length=255)
    Area = models.ForeignKey(Area, on_delete=models.CASCADE)

    def __str__(self):
        return self.SkillName


class SkillProject(models.Model):
    SkillProjectID = models.AutoField(primary_key=True)
    Skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    Project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.SkillProjectID)


class Group(models.Model):
    GroupID = models.AutoField(primary_key=True)
    GroupName = models.CharField(max_length=255, unique=True)
    GroupDescription = models.TextField()
    CreatedBy = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="groups_created"
    )
    MaxMemberNumber = models.IntegerField(default=1)
    Preferences = models.ManyToManyField(Project, through="GroupPreference")
    GroupMembers = models.ManyToManyField(User, through="GroupUsersLink")
    CourseCode = models.ForeignKey(CourseCode, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.GroupID)


class GroupPreference(models.Model):
    PreferenceID = models.AutoField(primary_key=True)
    Preference = models.ForeignKey(Project, on_delete=models.CASCADE)
    Group = models.ForeignKey(Group, on_delete=models.CASCADE)
    Rank = models.IntegerField(choices=[(1, 1), (2, 2), (3, 3)])

    def __str__(self):
        return str(self.PreferenceID)


class GroupUsersLink(models.Model):
    GroupUsersLinkID = models.AutoField(primary_key=True)
    GroupID = models.ForeignKey(Group, on_delete=models.CASCADE)
    UserID = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.GroupUsersLinkID)

    class Meta:
        unique_together = ("UserID", "GroupID")


class GroupProjectsLink(models.Model):
    GroupProjectsLinkID = models.AutoField(primary_key=True)
    GroupID = models.ForeignKey(Group, on_delete=models.CASCADE)
    ProjectID = models.ForeignKey(Project, on_delete=models.CASCADE)

    # groupID 和 projectID 一起是唯一的
    class Meta:
        unique_together = ("GroupID", "ProjectID")

    def __str__(self):
        return str(self.GroupProjectsLinkID)


class StudentArea(models.Model):
    StudentAreaID = models.AutoField(primary_key=True)
    Area = models.ForeignKey(Area, on_delete=models.CASCADE)
    User = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.User} - {self.Area}"


class GroupSkillEvaluation(models.Model):
    # （需要新建这个table）：需要一个新的模型来存储每个组员对于特定项目所需技能的评分和理由。
    GroupSkillEvaluationID = models.AutoField(primary_key=True)
    Note = models.CharField(max_length=255, null=True, blank=True)
    Score = models.IntegerField(
        choices=[
            (1, 1),
            (2, 2),
            (3, 3),
            (4, 4),
            (5, 5),
            (6, 6),
            (7, 7),
            (8, 8),
            (9, 9),
            (10, 10),
        ]
    )
    EvaluateGroup = models.ForeignKey(Group, on_delete=models.CASCADE)
    Skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("EvaluateGroup", "Skill")

    def __str__(self):
        return self.notes


class GroupAssignProject(models.Model):
    GroupID = models.AutoField(primary_key=True)
    Project = models.ForeignKey(Project, on_delete=models.CASCADE)
    Allocated = models.ForeignKey(User, on_delete=models.CASCADE)
    AllocatedAt = models.DateTimeField(default=timezone.now)
    ProgressStatus = models.CharField(
        max_length=20,
        choices=[("To Do", "To Do"), ("In Progress", "In Progress"), ("Done", "Done")],
        default="To Do",
    )

    def __str__(self):
        return f"{self.Project} - {self.Allocated}"


class Notification(models.Model):
    NotificationID = models.AutoField(primary_key=True)
    # 1: personal, 2: group
    Type = models.CharField(
        max_length=255, choices=[("personal", "personal"), ("group", "group")]
    )
    Message = models.TextField()
    AdditionalData = models.JSONField(null=True, blank=True)
    CreatedAt = models.DateTimeField(default=timezone.now)
    FromGroup = models.ForeignKey(
        Group, on_delete=models.CASCADE, null=True, blank=True
    )
    FromUser = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications_sent",
    )
    Receivers = models.ManyToManyField(
        User, through="NotificationReceiver", related_name="notifications_received"
    )
    ReadBy = models.ManyToManyField(User, related_name="read_notifications")

    def __str__(self):
        return f"{self.Type} - {self.Message}"


class NotificationReceiver(models.Model):
    NotificationReceiverID = models.AutoField(primary_key=True)
    Notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    Receiver = models.ForeignKey(User, on_delete=models.CASCADE)
    IsRead = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.Notification} - {self.Receiver}"


class Message(models.Model):
    MessageID = models.AutoField(primary_key=True)
    Sender = models.ForeignKey(
        User, related_name="sent_messages", on_delete=models.CASCADE
    )
    Receiver = models.ForeignKey(
        User, related_name="received_messages", on_delete=models.CASCADE
    )
    Content = models.TextField()
    CreatedAt = models.DateTimeField(default=timezone.now)
    IsRead = models.BooleanField()

    def __str__(self):
        return f"{self.Sender} - {self.Content}"


class GroupMessage(models.Model):
    GroupMessageID = models.AutoField(primary_key=True)
    Sender = models.ForeignKey(
        User, related_name="sent_group_messages", on_delete=models.CASCADE
    )
    ReceiverGroup = models.ForeignKey(
        Group, related_name="received_group_messages", on_delete=models.CASCADE
    )
    Content = models.TextField()
    CreatedAt = models.DateTimeField(default=timezone.now)
    ReadBy = models.ManyToManyField(User, related_name="read_group_messages")

    def __str__(self):
        return f"{self.Sender} - {self.Content}"


class GroupScore(models.Model):
    Id = models.AutoField(primary_key=True)
    score = models.FloatField(default=0)
    feedback = models.TextField(default="")
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    markers = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.Id} - {self.score}"


class Contact(models.Model):
    ContactID = models.AutoField(primary_key=True)
    ContactUser = models.ForeignKey(User, on_delete=models.CASCADE)
    Contact = models.ForeignKey(User, related_name="contacts", on_delete=models.CASCADE)
    IsFixed = models.BooleanField(default=False)

    class Meta:
        unique_together = (("Contact", "ContactUser"),)

    def __str__(self):
        return f"{self.Contact} - {self.ContactUser}"


class Allocation(models.Model):
    AllocationID = models.AutoField(primary_key=True)
    Project = models.ForeignKey(Project, on_delete=models.CASCADE)
    Group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.Project} - {self.Group}"
