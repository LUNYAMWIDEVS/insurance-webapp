# Generated by Django 3.2.24 on 2024-09-24 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('policy_deletion', '0005_alter_policydeletion_insurance_class'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='historicaladditionalbenefit',
            options={'get_latest_by': ('history_date', 'history_id'), 'ordering': ('-history_date', '-history_id'), 'verbose_name': 'historical additional benefit', 'verbose_name_plural': 'historical additional benefits'},
        ),
        migrations.AlterField(
            model_name='historicaladditionalbenefit',
            name='history_date',
            field=models.DateTimeField(db_index=True),
        ),
    ]
