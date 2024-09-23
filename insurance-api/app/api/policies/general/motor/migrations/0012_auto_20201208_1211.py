# Generated by Django 3.1.4 on 2020-12-08 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0001_initial'),
        ('motor', '0011_auto_20201127_1025'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='motorpolicy',
            name='additional_benefits',
        ),
        migrations.AddField(
            model_name='motorpolicy',
            name='additional_benefits',
            field=models.ManyToManyField(to='motor.AdditionalBenefit'),
        ),
        migrations.RemoveField(
            model_name='motorpolicy',
            name='additional_premiums',
        ),
        migrations.AddField(
            model_name='motorpolicy',
            name='additional_premiums',
            field=models.ManyToManyField(to='policies.AdditionalPremium'),
        ),
    ]
