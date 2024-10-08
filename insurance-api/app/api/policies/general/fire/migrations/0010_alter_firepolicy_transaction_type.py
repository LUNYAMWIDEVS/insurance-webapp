# Generated by Django 3.2.4 on 2021-08-17 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fire', '0009_firepolicy_corporate_client'),
    ]

    operations = [
        migrations.AlterField(
            model_name='firepolicy',
            name='transaction_type',
            field=models.CharField(choices=[('NEW', 'New'), ('RENEW', 'Renewal'), ('ADD', 'Additional'), ('EXT', 'Extension'), ('DEL', 'Deletion'), ('CN', 'Credit Note')], default='NEW', max_length=5),
        ),
    ]
