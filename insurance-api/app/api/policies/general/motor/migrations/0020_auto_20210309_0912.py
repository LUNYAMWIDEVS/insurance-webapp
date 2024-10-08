# Generated by Django 3.1.7 on 2021-03-09 06:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0011_auto_20210309_0845'),
        ('motor', '0019_auto_20210216_0935'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalmotorpolicy',
            name='corporate_client',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='client.corporateclient'),
        ),
        migrations.AddField(
            model_name='motorpolicy',
            name='corporate_client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='motor_motorpolicy_related', to='client.corporateclient'),
        ),
    ]
