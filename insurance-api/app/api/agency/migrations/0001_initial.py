# Generated by Django 3.0.7 on 2020-06-21 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Agency',
            fields=[
                ('deleted', models.DateTimeField(editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=50, unique=True)),
                ('office_location', models.CharField(blank=True, max_length=50, null=True)),
                ('box_number', models.BigIntegerField(blank=True, db_index=True, null=True)),
                ('postal_code', models.BigIntegerField(blank=True, db_index=True, null=True)),
                ('phone_number', models.CharField(max_length=20, unique=True)),
                ('agency_email', models.CharField(max_length=50, unique=True)),
                ('image_url', models.CharField(max_length=250, unique=True)),
                ('is_active', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
