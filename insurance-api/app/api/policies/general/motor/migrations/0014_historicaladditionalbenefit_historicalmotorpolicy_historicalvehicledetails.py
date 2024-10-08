# Generated by Django 3.1.5 on 2021-01-23 09:23

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0006_historicalcorporateclient_historicalindividualclient'),
        ('agency', '0004_historicalagency'),
        ('insurancecompany', '0005_historicalinsurancecompany'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('motor', '0013_auto_20201211_0857'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalVehicleDetails',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('registration_no', models.CharField(max_length=50)),
                ('make', models.CharField(max_length=50)),
                ('model', models.CharField(max_length=50)),
                ('body', models.CharField(max_length=50)),
                ('color', models.CharField(max_length=50)),
                ('chassel_no', models.CharField(max_length=50)),
                ('engine_no', models.CharField(max_length=50)),
                ('seating_capacity', models.IntegerField()),
                ('cc', models.BigIntegerField()),
                ('tonnage', models.BigIntegerField()),
                ('year_of_manufacture', models.PositiveSmallIntegerField()),
                ('history_change_reason', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=250, null=True), blank=True, null=True, size=None)),
                ('history_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical vehicle details',
                'db_table': 'history_vehicle',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalMotorPolicy',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('debit_note_no', models.CharField(blank=True, max_length=50)),
                ('policy_no', models.CharField(max_length=50)),
                ('transaction_date', models.DateField(max_length=8)),
                ('start_date', models.DateField(max_length=8)),
                ('end_date', models.DateField(max_length=8)),
                ('renewal_date', models.DateField(blank=True, max_length=8, null=True)),
                ('commission_rate', models.FloatField(blank=True, null=True)),
                ('minimum_premium_amount', models.FloatField(blank=True, null=True)),
                ('withholding_tax', models.FloatField(blank=True, null=True)),
                ('policy_commission_rate', models.FloatField(blank=True, null=True)),
                ('transaction_type', models.CharField(choices=[('NEW', 'New'), ('RENEW', 'Renewal'), ('ADD', 'Additional'), ('EXT', 'Extension'), ('DEL', 'Deletion'), ('CN', 'Credit Note')], default='NEW', max_length=5)),
                ('premium_type', models.CharField(choices=[('BASIC', 'Basic Premium'), ('POLICY', 'Policy Holder Compensation Fund Levy'), ('STAMPD', 'Stamp Duty'), ('IPHCFLEVY', 'Add IPHCF/Levy'), ('TLEVY', 'Add T/Levy'), ('GROSS', 'Gross premium'), ('COMM', 'Commission'), ('WITH', 'Withholding Tax')], default='BASIC', max_length=15)),
                ('value', models.FloatField()),
                ('insurance_class', models.CharField(choices=[('COMM_GEN', 'Motor Commercial Insurance – General Cartage'), ('COMM_OWN', 'Motor Commercial Insurance – Own Goods'), ('PRIV_COMP', 'Motor Private Insurance – Comprehensive'), ('PRIV_TPO', 'Motor Private Insurance – T.P.O'), ('PSV_COMP', 'Motor PSV – Comprehensive'), ('PSV_TPO', 'Motor PSV – T.P.O')], default='COMM_GEN', max_length=10)),
                ('remarks', models.CharField(blank=True, max_length=2000, null=True)),
                ('history_change_reason', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=250, null=True), blank=True, null=True, size=None)),
                ('history_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('agency', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='agency.agency')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('individual_client', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='client.individualclient')),
                ('insurance_company', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='insurancecompany.insurancecompany')),
                ('vehicle_details', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='motor.vehicledetails')),
            ],
            options={
                'verbose_name': 'historical motor policy',
                'db_table': 'history_motor_policy',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalAdditionalBenefit',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('benefit', models.CharField(choices=[('COURT', 'Courtesy car'), ('EXCESS', 'Excess Protection'), ('WIND', 'Windscreen extension'), ('MED', 'Medical expenses'), ('POLITICAL', 'Political violence and Terrorism cover')], default='COURT', max_length=15)),
                ('commission_rate', models.FloatField(null=True)),
                ('minimum_amount', models.FloatField(blank=True, null=True)),
                ('history_change_reason', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=250, null=True), blank=True, null=True, size=None)),
                ('history_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical additional benefit',
                'db_table': 'history_motor_additional_benefit',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
