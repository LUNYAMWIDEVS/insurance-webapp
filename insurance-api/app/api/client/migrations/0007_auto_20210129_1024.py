# Generated by Django 3.1.5 on 2021-01-29 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0005_auto_20210126_1212'),
        ('client', '0006_historicalcorporateclient_historicalindividualclient'),
    ]

    operations = [
        migrations.AddField(
            model_name='corporateclient',
            name='contact_persons',
            field=models.ManyToManyField(to='crm.ContactManager'),
        ),
        migrations.AddField(
            model_name='individualclient',
            name='contact_persons',
            field=models.ManyToManyField(to='crm.ContactManager'),
        ),
    ]
