# Generated by Django 3.2.6 on 2021-11-24 13:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('motor', '0031_auto_20211124_1629'),
        ('policies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PolicyRenewal',
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
                ('transaction_type', models.CharField(choices=[('NEW', 'New Policy'), ('NORM', 'Existing Policy'), ('RENEW', 'Renewal')], default='NEW', max_length=50)),
                ('premium_type', models.CharField(choices=[('BASIC', 'Basic Premium'), ('POLICY', 'Policy Holder Compensation Fund Levy'), ('STAMPD', 'Stamp Duty'), ('IPHCFLEVY', 'Add IPHCF/Levy'), ('TLEVY', 'Add T/Levy'), ('GROSS', 'Gross premium'), ('COMM', 'Commission'), ('WITH', 'Withholding Tax')], default='BASIC', max_length=200)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('published', 'Published')], default='draft', max_length=50)),
                ('insurance_class', models.CharField(choices=[('COMM_GEN', 'Motor Commercial Insurance – GC - Comp'), ('COMM_OWN', 'Motor Commercial Insurance – Own Goods - Comprehensive'), ('COMM_OWN_TPO', 'Motor Commercial Insurance – Own Goods - T.P.O'), ('PRIV_COMP', 'Motor Private Insurance – Comprehensive'), ('PRIV_TPO', 'Motor Private Insurance – T.P.O'), ('PSV_COMP', 'Motor PSV – Comprehensive'), ('PSV_TPO', 'Motor PSV – T.P.O')], default='COMM_GEN', max_length=50)),
                ('remarks', models.TextField(blank=True, max_length=500, null=True)),
                ('additional_premiums', models.ManyToManyField(to='policies.AdditionalPremium')),
                ('policy_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='motor.motorpolicy')),
            ],
            options={
                'verbose_name': 'Policy Renewal',
                'verbose_name_plural': 'Policy Renewals',
                'db_table': 'policy_renewals',
            },
        ),
    ]
