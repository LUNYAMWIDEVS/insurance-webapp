# Generated by Django 3.0.7 on 2020-06-22 08:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_password_set',
            field=models.BooleanField(default=False),
        ),
    ]
