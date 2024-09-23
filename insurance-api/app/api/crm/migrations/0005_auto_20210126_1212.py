# Generated by Django 3.1.5 on 2021-01-26 09:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0006_historicalcorporateclient_historicalindividualclient'),
        ('crm', '0004_historicalcontactmanager_historicalmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='corporate_clients',
            field=models.ManyToManyField(to='client.CorporateClient'),
        ),
        migrations.AlterField(
            model_name='historicalmessage',
            name='option',
            field=models.CharField(choices=[('M', 'Sent to multiple users'), ('S', 'Sent to a single user'), ('A', 'Sent to all users'), ('AC', 'Sent to all corporate clients'), ('AI', 'Sent to all individual clients'), ('ACP', 'Sent to all contact persons')], default='S', max_length=7),
        ),
        migrations.AlterField(
            model_name='message',
            name='option',
            field=models.CharField(choices=[('M', 'Sent to multiple users'), ('S', 'Sent to a single user'), ('A', 'Sent to all users'), ('AC', 'Sent to all corporate clients'), ('AI', 'Sent to all individual clients'), ('ACP', 'Sent to all contact persons')], default='S', max_length=7),
        ),
    ]
