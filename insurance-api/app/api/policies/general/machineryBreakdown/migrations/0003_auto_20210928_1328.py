# Generated by Django 3.2 on 2021-09-28 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('machineryBreakdown', '0002_rename_burglary_properties_machinerybreakdown_machinery_breakdown_properties'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalmachinerybreakdown',
            name='premium_type',
            field=models.CharField(choices=[('BASIC', 'Basic Premium'), ('POLICY', 'Policy Holder Compensation Fund Levy'), ('STAMPD', 'Stamp Duty'), ('IPHCFLEVY', 'Add IPHCF/Levy'), ('TLEVY', 'Add T/Levy'), ('GROSS', 'Gross premium'), ('COMM', 'Commission'), ('WITH', 'Withholding Tax')], default='BASIC', max_length=200),
        ),
        migrations.AlterField(
            model_name='historicalmachinerybreakdown',
            name='transaction_type',
            field=models.CharField(choices=[('NEW', 'New Policy'), ('NORM', 'Exisintg Policy'), ('RENEW', 'Renewal'), ('DEL', 'Deletion')], default='NEW', max_length=50),
        ),
        migrations.AlterField(
            model_name='machinerybreakdown',
            name='premium_type',
            field=models.CharField(choices=[('BASIC', 'Basic Premium'), ('POLICY', 'Policy Holder Compensation Fund Levy'), ('STAMPD', 'Stamp Duty'), ('IPHCFLEVY', 'Add IPHCF/Levy'), ('TLEVY', 'Add T/Levy'), ('GROSS', 'Gross premium'), ('COMM', 'Commission'), ('WITH', 'Withholding Tax')], default='BASIC', max_length=200),
        ),
        migrations.AlterField(
            model_name='machinerybreakdown',
            name='transaction_type',
            field=models.CharField(choices=[('NEW', 'New Policy'), ('NORM', 'Exisintg Policy'), ('RENEW', 'Renewal'), ('DEL', 'Deletion')], default='NEW', max_length=50),
        ),
    ]
