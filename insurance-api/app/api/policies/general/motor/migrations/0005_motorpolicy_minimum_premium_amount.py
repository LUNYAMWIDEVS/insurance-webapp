# Generated by Django 3.1.3 on 2020-11-05 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('motor', '0004_auto_20201105_1431'),
    ]

    operations = [
        migrations.AddField(
            model_name='motorpolicy',
            name='minimum_premium_amount',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
