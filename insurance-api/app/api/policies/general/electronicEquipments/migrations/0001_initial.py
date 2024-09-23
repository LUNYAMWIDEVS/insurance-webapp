# Generated by Django 3.2 on 2021-08-26 09:03

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('insurancecompany', '0005_historicalinsurancecompany'),
        ('policies', '0001_initial'),
        ('client', '0017_auto_20210614_1435'),
        ('agency', '0006_auto_20210309_0851'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
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
            name='HistoricalProperty',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('name', models.CharField(db_index=True, max_length=100)),
                ('description', models.CharField(db_index=True, max_length=250)),
                ('value', models.FloatField(db_index=True)),
                ('history_change_reason', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=250, null=True), blank=True, null=True, size=None)),
                ('history_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical property',
                'db_table': 'history_electronics_property',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalElectronicEquipment',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('debit_note_no', models.CharField(blank=True, max_length=50, null=True)),
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
                ('history_change_reason', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=250, null=True), blank=True, null=True, size=None)),
                ('history_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('agency', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='agency.agency')),
                ('corporate_client', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='client.corporateclient')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('individual_client', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='client.individualclient')),
                ('insurance_company', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='insurancecompany.insurancecompany')),
            ],
            options={
                'verbose_name': 'historical electronic equipment',
                'db_table': 'history_electronics_policy',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='ElectronicEquipment',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('debit_note_no', models.CharField(blank=True, max_length=50, null=True)),
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
                ('additional_premiums', models.ManyToManyField(to='policies.AdditionalPremium')),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='electronicequipments_electronicequipment_related', to='agency.agency')),
                ('burglary_properties', models.ManyToManyField(to='electronicEquipments.Property')),
                ('corporate_client', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='electronicequipments_electronicequipment_related', to='client.corporateclient')),
                ('individual_client', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='electronicequipments_electronicequipment_related', to='client.individualclient')),
                ('insurance_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='electronicequipments_electronicequipment_related', to='insurancecompany.insurancecompany')),
            ],
            options={
                'unique_together': {('policy_no', 'agency')},
            },
        ),
    ]
