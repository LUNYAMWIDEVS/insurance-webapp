# Generated by Django 3.1 on 2020-10-07 11:49

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('agency', '0002_auto_20200622_1409'),
        ('insurancecompany', '0003_auto_20200723_1610'),
        ('client', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('deleted', models.DateTimeField(editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(db_index=True, max_length=100)),
                ('description', models.CharField(db_index=True, max_length=250)),
                ('value', models.FloatField(db_index=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='BurglaryPolicy',
            fields=[
                ('deleted', models.DateTimeField(editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('debit_note_no', models.CharField(blank=True, max_length=50)),
                ('policy_no', models.CharField(max_length=50)),
                ('transaction_date', models.DateField(max_length=8)),
                ('start_date', models.DateField(max_length=8)),
                ('end_date', models.DateField(max_length=8)),
                ('renewal_date', models.DateField(blank=True, max_length=8, null=True)),
                ('commission_rate', models.FloatField(blank=True, null=True)),
                ('transaction_type', models.CharField(choices=[('NEW', 'New'), ('RENEW', 'Renewal'), ('ADD', 'Additional'), ('EXT', 'Extension'), ('DEL', 'Deletion'), ('CN', 'Credit Note')], default='NEW', max_length=5)),
                ('premium_type', models.CharField(choices=[('BASIC', 'Basic Premium'), ('POLICY', 'Policy Holder Compensation Fund Levy'), ('STAMPD', 'Stamp Duty'), ('STAMPL', 'Stamp Levy'), ('GROSS', 'Gross premium'), ('COMM', 'Commission'), ('WITH', 'Withholding Tax')], default='BASIC', max_length=8)),
                ('properties', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(db_index=True, max_length=100), size=None)),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='burglary_policy_agency', to='agency.agency')),
                ('individual_client', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='individual_client_burglary_policy', to='client.individualclient')),
                ('insurance_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='burglary_policy_insurance_co', to='insurancecompany.insurancecompany')),
            ],
            options={
                'unique_together': {('policy_no', 'agency')},
            },
        ),
    ]
