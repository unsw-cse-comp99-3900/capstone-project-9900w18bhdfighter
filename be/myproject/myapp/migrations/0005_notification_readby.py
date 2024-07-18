# Generated by Django 5.0.6 on 2024-07-18 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_remove_notification_sender_content_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='ReadBy',
            field=models.ManyToManyField(related_name='read_notifications', to='myapp.user'),
        ),
    ]
