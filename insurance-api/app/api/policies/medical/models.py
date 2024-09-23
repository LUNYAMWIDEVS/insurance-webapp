from django.db import models

from ..models import BaseModel


class MedicalInsurance(BaseModel):
    """
    The common field in all the medical models are defined here
    """
    first_name = models.CharField(
        null=True, blank=True, max_length=255, unique=False)

    last_name = models.CharField(
        null=True, blank=True, max_length=255, unique=False)
    age = models.IntegerField(db_index=True, blank=True, unique=False, null=True)
    inpatient_limit = models.FloatField(blank=True, unique=False, null=True)
    outpatient_limit = models.FloatField(blank=True, unique=False, null=True)
    family_size = models.IntegerField(db_index=True, blank=True, unique=False, null=True)
    dependants = models.JSONField(unique=False, null=True)
