# Generated by Django 3.2.4 on 2021-06-14 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0011_auto_20210416_0844'),
        ('client', '0013_auto_20210614_1329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='corporateclient',
            name='contact_persons',
            field=models.ManyToManyField(blank=True, to='crm.ContactManager'),
        ),
        migrations.AlterField(
            model_name='individualclient',
            name='contact_persons',
            field=models.ManyToManyField(blank=True, to='crm.ContactManager'),
        ),
    ]
