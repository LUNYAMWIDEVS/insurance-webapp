# Generated by Django 3.1.6 on 2021-02-08 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('motor', '0014_historicaladditionalbenefit_historicalmotorpolicy_historicalvehicledetails'),
    ]

    operations = [
        migrations.AddField(
            model_name='motorpolicy',
            name='vehicles',
            field=models.ManyToManyField(related_name='motor_motorpolicy_related', to='motor.VehicleDetails'),
        ),
    ]
