# Generated by Django 3.2 on 2021-04-14 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0009_whatsappmessages_agent_responses'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='whatsappmessages',
            name='agent_responses',
        ),
        migrations.AddField(
            model_name='whatsappmessages',
            name='previous_responses',
            field=models.ManyToManyField(blank=True, related_name='_crm_whatsappmessages_previous_responses_+', to='crm.WhatsappMessages'),
        ),
    ]
