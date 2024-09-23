from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords

from ..agency.models import Agency
from ..authentication.models import User
from ..policies.general.motor.models import MotorPolicy


class Receipt(BaseModel):

    class PaymentOptions(models.TextChoices):
        MPESA = 'M', _('Mpesa')
        CHEQUE = 'CH', _('Cheque')
        BANK = 'B', _('Bank Transfer')
        CASH = 'CA', _('Cash')

    receipt_number = models.CharField(
        db_index=True, max_length=50, blank=True, null=True, unique=False)
    date = models.DateField(max_length=8, null=True, blank=True)
    transaction_date = models.DateField(max_length=8, null=False, blank=False)

    amount_figures = models.FloatField(blank=False, unique=False, null=False)
    amount_words = models.CharField(max_length=255)
    payment_mode = models.CharField(
        max_length=2,
        choices=PaymentOptions.choices,
        blank=False, unique=False
    )
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=True)
    issued_by = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name="%(app_label)s_%(class)s_related",
                                  blank=True, null=True)
    history = HistoricalRecords(table_name="history_receipt",
                                inherit=True,
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])

    def __str__(self):
        """
        Returns a string representation of this model.

        This string is used when a model is printed in the console.
        """
        return "{}".format(self.receipt_number)

    class Meta:
        abstract = True  # Set this model as Abstract


class MotorPolicyReceipt(BaseModel):
    """
    Motor Policy receipt
    """
    class PaymentOptions(models.TextChoices):
        MPESA = 'M', _('Mpesa')
        CHEQUE = 'CH', _('Cheque')
        BANK = 'B', _('Bank Transfer')
        CASH = 'CA', _('Cash')

    receipt_number = models.CharField(
        db_index=True, max_length=50, blank=True, null=True, unique=False)
    date = models.DateField(max_length=8, null=True, blank=True)
    transaction_date = models.DateField(max_length=8, null=False, blank=False)

    amount_figures = models.FloatField(blank=False, unique=False, null=False)
    amount_words = models.CharField(max_length=255)
    payment_mode = models.CharField(
        max_length=2,
        choices=PaymentOptions.choices,
        blank=False, unique=False
    )
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=True)
    issued_by = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name="%(app_label)s_%(class)s_related",
                                  blank=True, null=True)
    history = HistoricalRecords(table_name="history_receipt_policy",
                                inherit=True,
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])
    policy = models.ForeignKey(MotorPolicy, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=False)

    def __str__(self):
        return self.amount_words