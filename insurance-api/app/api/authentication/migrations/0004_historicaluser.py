# Generated by Django 3.1.5 on 2021-01-23 06:49

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('agency', '0003_auto_20201105_1431'),
        ('authentication', '0003_auto_20201105_1431'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('deleted_at', models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True)),
                ('id', models.CharField(db_index=True, max_length=255)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('first_name', models.CharField(db_index=True, max_length=255)),
                ('last_name', models.CharField(db_index=True, max_length=255)),
                ('username', models.CharField(db_index=True, max_length=255)),
                ('email', models.EmailField(db_index=True, max_length=254)),
                ('phone_number', models.CharField(db_index=True, max_length=15)),
                ('image', models.URLField(blank=True, db_index=True, max_length=255)),
                ('is_active', models.BooleanField(default=False)),
                ('is_password_set', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('history_change_reason', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=250, null=True), blank=True, null=True, size=None)),
                ('history_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('agency', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='agency.agency')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical user',
                'db_table': 'history_user',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
