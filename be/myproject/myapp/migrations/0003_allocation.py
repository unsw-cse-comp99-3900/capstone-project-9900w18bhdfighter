# Generated by Django 5.0.6 on 2024-07-23 14:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapp", "0002_insert_test_data"),
    ]

    operations = [
        migrations.CreateModel(
            name="Allocation",
            fields=[
                ("AllocationID", models.AutoField(primary_key=True, serialize=False)),
                (
                    "Group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="myapp.group"
                    ),
                ),
                (
                    "Project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="myapp.project"
                    ),
                ),
            ],
        ),
    ]
