# Generated by Django 3.1.3 on 2020-11-27 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('motor', '0010_motorpolicy_remarks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='motorpolicy',
            name='remarks',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
    ]
