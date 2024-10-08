# Generated by Django 3.1.4 on 2020-12-11 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medical', '0004_auto_20201105_1431'),
        ('group', '0006_auto_20201208_1211'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupmedicalins',
            name='policy_commission_rate',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='groupmedicalins',
            name='withholding_tax',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.RemoveField(
            model_name='groupmedicalins',
            name='medical_insurances',
        ),
        migrations.AddField(
            model_name='groupmedicalins',
            name='medical_insurances',
            field=models.ManyToManyField(to='medical.MedicalInsurance'),
        ),
    ]
