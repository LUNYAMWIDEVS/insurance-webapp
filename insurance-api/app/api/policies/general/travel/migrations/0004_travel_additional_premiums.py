# Generated by Django 3.1.3 on 2020-11-11 08:13

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0003_travel_minimum_premium_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='travel',
            name='additional_premiums',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=50, null=True), blank=True, null=True, size=None),
        ),
    ]
