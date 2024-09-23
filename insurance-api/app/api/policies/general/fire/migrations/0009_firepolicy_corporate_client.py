# Generated by Django 3.2.4 on 2021-08-17 08:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0017_auto_20210614_1435'),
        ('fire', '0008_auto_20210817_1147'),
    ]

    operations = [
        migrations.AddField(
            model_name='firepolicy',
            name='corporate_client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='corporate_client_fire_policy', to='client.corporateclient'),
        ),
    ]
