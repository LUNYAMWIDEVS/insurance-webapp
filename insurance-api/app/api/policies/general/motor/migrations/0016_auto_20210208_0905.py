# Generated by Django 3.1.6 on 2021-02-08 06:05

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def make_many_vehicles(apps, schema_editor):
    """
        Adds the VehicleDetails object in MotorPolicy.vehicle_details to the
        many-to-many relationship in MotorPolicy.vehicles
    """
    MotorPolicy = apps.get_model('motor', 'MotorPolicy')

    for policy in MotorPolicy.objects.all():
        policy.vehicles.add(policy.vehicle_details)



class Migration(migrations.Migration):

    dependencies = [
        ('motor', '0015_motorpolicy_vehicles'),
    ]

    operations = [
            migrations.RunPython(make_many_vehicles),
    ]
