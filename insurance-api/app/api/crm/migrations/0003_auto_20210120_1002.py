# Generated by Django 3.1.5 on 2021-01-20 07:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0002_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='clients',
            new_name='individual_clients',
        ),
    ]
