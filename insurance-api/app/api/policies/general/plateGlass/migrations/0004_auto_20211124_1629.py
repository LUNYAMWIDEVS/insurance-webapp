# Generated by Django 3.2.6 on 2021-11-24 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plateGlass', '0003_auto_20210928_1328'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalplateglass',
            name='transaction_type',
            field=models.CharField(choices=[('NEW', 'New Policy'), ('NORM', 'Existing Policy'), ('RENEW', 'Renewal')], default='NEW', max_length=50),
        ),
        migrations.AlterField(
            model_name='plateglass',
            name='transaction_type',
            field=models.CharField(choices=[('NEW', 'New Policy'), ('NORM', 'Existing Policy'), ('RENEW', 'Renewal')], default='NEW', max_length=50),
        ),
    ]
