from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models
from simple_history.models import HistoricalRecords


class InsuranceCompany(BaseModel):
    """
    Insurance company model
    """
    name = models.CharField(max_length=50, blank=False, unique=True)
    contact_person = models.CharField(max_length=50, blank=False,
                                      unique=False)
    postal_address = models.CharField(max_length=70, blank=False, unique=False)
    physical_address = models.CharField(max_length=250, blank=False, unique=False,
                                        default="default-location")
    mobile_number = ArrayField(models.CharField(
        max_length=50, blank=True,
        unique=False, null=True), blank=True,
        unique=False, null=True)
    telephone_number = ArrayField(models.CharField(
        max_length=50, blank=True,
        unique=False, null=True), blank=True,
        unique=False, null=True)
    email = models.CharField(max_length=50, blank=True, null=True, unique=False)
    image_url = models.CharField(
        max_length=250, blank=False, unique=False,
        default="https://res.cloudinary.com/dsw3onksq/image/upload/v1595314246/insurance-co_qr2qog.png")  # noqa
    is_active = models.BooleanField(default=True)
    history = HistoricalRecords(table_name="history_insurance_company",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])
