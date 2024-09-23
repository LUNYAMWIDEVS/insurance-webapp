# Generated by Django 3.0.7 on 2020-06-25 10:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('agency', '0002_auto_20200622_1409'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndividualClient',
            fields=[
                ('deleted', models.DateTimeField(editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('surname', models.CharField(blank=True, max_length=50, null=True)),
                ('email', models.CharField(db_index=True, max_length=50, unique=True)),
                ('postal_address', models.CharField(blank=True, max_length=70, null=True)),
                ('kra_pin', models.CharField(max_length=50)),
                ('id_number', models.BigIntegerField(blank=True, db_index=True, null=True)),
                ('phone_number', models.CharField(max_length=20, unique=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('P', 'Prefer not to disclose')], default='F', max_length=2)),
                ('date_of_birth', models.DateField(max_length=8)),
                ('occupation', models.CharField(blank=True, max_length=50, null=True)),
                ('town', models.CharField(blank=True, max_length=50, null=True)),
                ('is_active', models.BooleanField(default=False)),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='individual_client_agency', to='agency.Agency')),
            ],
            options={
                'unique_together': {('phone_number', 'agency'), ('kra_pin', 'agency'), ('email', 'agency'), ('id_number', 'agency')},
            },
        ),
    ]
