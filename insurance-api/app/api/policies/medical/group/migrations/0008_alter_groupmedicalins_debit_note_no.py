# Generated by Django 3.2.4 on 2021-08-18 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0007_auto_20201211_0857'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groupmedicalins',
            name='debit_note_no',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
