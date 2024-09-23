from app.api.models import BaseModel

# from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _


class AdditionalPremium(BaseModel):
    """
    Additional premiums
    """

    premium = models.CharField(max_length=15, blank=True, null=True)
    commission_rate = models.FloatField(blank=False, unique=False, null=True)
    minimum_amount = models.FloatField(blank=True, unique=False, null=True)


class BasePolicyModel(BaseModel):
    """
    The common field in all the models are defined here
    """

    class TransactionType(models.TextChoices):
        """
        Transaction Type  choices
        """

        NEW = "NEW", _("New Policy")
        ADD = "NORM", _("Existing Policy")
        RENEW = "RENEW", _("Renewal")
        # EXT = 'EXT', _('Extension')
        # DEL = 'DEL', _('Deletion')
        # CN = 'CN', _('Credit Note')

    class PremiumType(models.TextChoices):
        """
        Premium Type Choices
        """

        BASIC = "BASIC", _("Basic Premium")
        POLICY = "POLICY", _("Policy Holder Compensation Fund Levy")
        STAMPD = "STAMPD", _("Stamp Duty")
        IPHCFLEVY = "IPHCFLEVY", _("Add IPHCF/Levy")
        TLEVY = "TLEVY", _("Add T/Levy")
        GROSS = "GROSS", _("Gross premium")
        COMM = "COMM", _("Commission")
        WITH = "WITH", _("Withholding Tax")

    additional_premiums = models.ManyToManyField(AdditionalPremium)
    debit_note_no = models.CharField(max_length=50, blank=True, null=True)
    policy_no = models.CharField(max_length=50, blank=False)
    transaction_date = models.DateField(max_length=8, null=False, blank=False)
    start_date = models.DateField(max_length=8, null=False, blank=False)
    end_date = models.DateField(max_length=8, null=False, blank=False)
    renewal_date = models.DateField(max_length=8, null=True, blank=True)
    commission_rate = models.FloatField(blank=True, unique=False, null=True)
    minimum_premium_amount = models.FloatField(blank=True, unique=False, null=True)
    withholding_tax = models.FloatField(blank=True, unique=False, null=True)
    policy_commission_rate = models.FloatField(blank=True, unique=False, null=True)

    transaction_type = models.CharField(
        max_length=50, choices=TransactionType.choices, default=TransactionType.NEW
    )
    premium_type = models.CharField(
        max_length=200, choices=PremiumType.choices, default=PremiumType.BASIC
    )

    class Meta:
        abstract = True  # Set this model as Abstract
