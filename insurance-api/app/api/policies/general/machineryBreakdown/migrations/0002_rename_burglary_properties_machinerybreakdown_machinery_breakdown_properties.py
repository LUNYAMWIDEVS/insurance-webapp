# Generated by Django 3.2 on 2021-08-31 11:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('machineryBreakdown', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='machinerybreakdown',
            old_name='burglary_properties',
            new_name='machinery_breakdown_properties',
        ),
    ]
