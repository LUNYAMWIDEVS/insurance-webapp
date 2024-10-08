# Generated by Django 3.1.6 on 2021-02-08 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency', '0004_historicalagency'),
    ]

    operations = [
        migrations.AddField(
            model_name='agency',
            name='credit_note',
            field=models.IntegerField(blank=True, db_index=True, default=1, null=True),
        ),
        migrations.AddField(
            model_name='agency',
            name='debit_note',
            field=models.IntegerField(blank=True, db_index=True, default=1, null=True),
        ),
        migrations.AddField(
            model_name='agency',
            name='receipt',
            field=models.IntegerField(blank=True, db_index=True, default=1, null=True),
        ),
        migrations.AddField(
            model_name='historicalagency',
            name='credit_note',
            field=models.IntegerField(blank=True, db_index=True, default=1, null=True),
        ),
        migrations.AddField(
            model_name='historicalagency',
            name='debit_note',
            field=models.IntegerField(blank=True, db_index=True, default=1, null=True),
        ),
        migrations.AddField(
            model_name='historicalagency',
            name='receipt',
            field=models.IntegerField(blank=True, db_index=True, default=1, null=True),
        ),
    ]
