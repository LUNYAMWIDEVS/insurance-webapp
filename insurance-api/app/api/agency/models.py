from django.db import models
from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from simple_history.models import HistoricalRecords


class Agency(BaseModel):
    """
    Insurance agency model
    """
    name = models.CharField(max_length=50, blank=False, unique=True)
    office_location = models.CharField(max_length=50, blank=True,
                                       unique=False, null=True)
    box_number = models.BigIntegerField(db_index=True, blank=True,
                                        unique=False, null=True)
    postal_code = models.BigIntegerField(db_index=True, blank=True,
                                         unique=False, null=True)
    phone_number = models.CharField(max_length=20, blank=False, unique=True)
    agency_email = models.CharField(max_length=50, blank=False, unique=True)
    image_url = models.CharField(max_length=250, blank=False, unique=False)
    is_active = models.BooleanField(default=False)
    debit_note = models.IntegerField(db_index=True, blank=True,
                                     unique=False, null=True, default=1)
    receipt = models.IntegerField(db_index=True, blank=True,
                                  unique=False, null=True, default=1)
    credit_note = models.IntegerField(db_index=True, blank=True,
                                      unique=False, null=True, default=1)
    client_number = models.IntegerField(db_index=True, blank=True,
                                        unique=False, null=True, default=1)
    history = HistoricalRecords(table_name="history_agency",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])
