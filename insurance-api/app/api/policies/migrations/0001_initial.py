# Generated by Django 3.1.3 on 2020-11-11 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdditionalPremium',
            fields=[
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('premium', models.CharField(blank=True, max_length=15, null=True)),
                ('commission_rate', models.FloatField(null=True)),
                ('minimum_amount', models.FloatField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
