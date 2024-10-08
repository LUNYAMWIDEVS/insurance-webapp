from __future__ import absolute_import

import os

from celery import Celery
from django.conf import settings

# set the default Django settings module for the 'celery' program.
if not os.getenv('DJANGO_SETTINGS_MODULE', ''):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings.development')

CELERY_TASKS = [
    'app.api.helpers.tasks',
    'app.api.crm.helpers.message_helper'
]

app = Celery('app', include=CELERY_TASKS)

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
