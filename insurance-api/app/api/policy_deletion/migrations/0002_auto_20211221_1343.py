# Generated by Django 3.2.6 on 2021-12-21 10:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('policy_deletion', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='policydeletion',
            name='insurance_class',
        ),
        migrations.RemoveField(
            model_name='policydeletion',
            name='status',
        ),
    ]
