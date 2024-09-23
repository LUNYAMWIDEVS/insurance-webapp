# Generated by Django 3.1 on 2020-10-01 12:09

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('insurancecompany', '0003_auto_20200723_1610'),
        ('agency', '0002_auto_20200622_1409'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupMedicalIns',
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
                ('medical_insurances', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(db_index=True, max_length=50), blank=True, null=True, size=None)),
                ('inpatient_limit', models.FloatField(null=True)),
                ('outpatient_limit', models.FloatField(null=True)),
                ('principal_members', models.BigIntegerField(db_index=True)),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_medical_insurance_agency', to='agency.agency')),
                ('insurance_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_medical_insurance_insurance_co', to='insurancecompany.insurancecompany')),
            ],
            options={
                'unique_together': {('policy_no', 'agency')},
            },
        ),
    ]
