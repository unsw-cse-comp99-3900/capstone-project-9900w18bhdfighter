from django.db import migrations

def add_initial_data(apps, schema_editor):
    Area = apps.get_model('myapp', 'Area')
    initial_data = [
        {'AreaID': 1, 'AreaName': 'Programming Languages'},
        {'AreaID': 2, 'AreaName': 'Machine Learning & AI'},
        {'AreaID': 3, 'AreaName': 'Web Development'},
        {'AreaID': 4, 'AreaName': 'Frameworks & Libraries'},
        {'AreaID': 5, 'AreaName': 'Database Management'},
        {'AreaID': 6, 'AreaName': 'Mobile App Development'},
        {'AreaID': 7, 'AreaName': 'Data Processing & Visualization'},
        {'AreaID': 8, 'AreaName': 'Security & Privacy'},
        {'AreaID': 9, 'AreaName': 'DevOps & CI/CD'},
        {'AreaID': 10, 'AreaName': 'UI/UX Design'},
        {'AreaID': 11, 'AreaName': 'Cloud Platforms'},
        {'AreaID': 12, 'AreaName': 'Miscellaneous'},
    ]
    for data in initial_data:
        Area.objects.create(**data)

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_initial_data),
    ]
