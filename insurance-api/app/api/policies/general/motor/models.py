from app.api.agency.models import Agency
from app.api.client.models import CorporateClient, IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords

from ...models import BasePolicyModel
from ..helpers.premiums import get_premiums
from app.api.helpers.choices import InsuranceClasses


class VehicleDetails(BaseModel):
    """
    Vehicle model
    """

    registration_no = models.CharField(max_length=50, blank=False, unique=False)
    make = models.CharField(max_length=50, blank=False, unique=False)
    model = models.CharField(max_length=50, blank=False, unique=False)
    body = models.CharField(max_length=50, blank=False, unique=False)
    color = models.CharField(max_length=50, blank=False, unique=False)
    chassis_no = models.CharField(max_length=50, blank=False, unique=False)
    engine_no = models.CharField(max_length=50, blank=False, unique=False)
    seating_capacity = models.IntegerField(blank=False, unique=False)
    cc = models.BigIntegerField(blank=False, unique=False)
    tonnage = models.BigIntegerField(blank=False, unique=False)
    year_of_manufacture = models.PositiveSmallIntegerField(blank=False, null=False)
    value = models.FloatField(blank=True, unique=False, null=True)
    history = HistoricalRecords(
        table_name="history_vehicle",
        history_change_reason_field=ArrayField(
            models.CharField(max_length=250, blank=True, unique=False, null=True),
            blank=True,
            unique=False,
            null=True,
        ),
        excluded_fields=["updated_at"],
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=True,
    )

    def __str__(self):
        """
        Returns a string representation of this `MotorPolicy`.

        This string is used when a `User` is printed in the console.
        """
        return "{} - {}".format(self.registration_no, self.agency.name)


class AdditionalBenefit(BaseModel):
    """
    Additional Benefits
    """

    class AdditionalBenefitOps(models.TextChoices):
        """
        Additional Benefit choices
        """

        COURT = "COURT", _("Courtesy car")
        EXCESS = "EXCESS", _("Excess Protection")
        WIND = "WIND", _("Windscreen extension")
        MED = "MED", _("Medical expenses")
        POLITICAL = "POLITICAL", _("Political violence and Terrorism cover")

    benefit = models.CharField(
        max_length=15,
        choices=AdditionalBenefitOps.choices,
        default=AdditionalBenefitOps.COURT,
    )
    commission_rate = models.FloatField(blank=False, unique=False, null=True)
    minimum_amount = models.FloatField(blank=True, unique=False, null=True)

    history = HistoricalRecords(
        table_name="history_motor_additional_benefit",
        history_change_reason_field=ArrayField(
            models.CharField(max_length=250, blank=True, unique=False, null=True),
            blank=True,
            unique=False,
            null=True,
        ),
        excluded_fields=["updated_at"],
    )


class PolicyDetails(BaseModel):
    field = models.CharField(max_length=255)
    value = models.TextField()

    def __str__(self):
        return self.field


class PolicyType(BaseModel):
    name = models.CharField(max_length=255)
    fields = models.ManyToManyField(PolicyDetails)

    def __str__(self):
        return self.name


class PolicyDetailsSet(BaseModel):
    field = models.ForeignKey(
        PolicyDetails, on_delete=models.CASCADE, null=True, blank=True
    )
    value = models.TextField()


class PolicyTypeSet(BaseModel):
    name = models.ForeignKey(
        PolicyType, on_delete=models.CASCADE, null=True, blank=True
    )
    fields = models.ManyToManyField(PolicyDetailsSet)


class MotorPolicy(BasePolicyModel):
    """
    MotorPolicy model
    """

    individual_client = models.ForeignKey(
        IndividualClient,
        on_delete=models.CASCADE,
        related_name="individual_client_motor_policy",
        null=True,
        blank=True,
        unique=False,
    )
    corporate_client = models.ForeignKey(
        CorporateClient,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=True,
        blank=True,
        unique=False,
    )
    insurance_company = models.ForeignKey(
        InsuranceCompany,
        on_delete=models.CASCADE,
        related_name="motor_policy_insurance_co",
        null=False,
        blank=False,
        unique=False,
    )
    vehicles = models.ManyToManyField(
        VehicleDetails, related_name="%(app_label)s_%(class)s_related"
    )
    value = models.FloatField(blank=True, null=True, unique=False)
    insurance_class = models.CharField(
        max_length=50,
        choices=InsuranceClasses.choices,
        default=InsuranceClasses.COMM_GEN,
    )
    remarks = models.CharField(max_length=2000, unique=False, blank=True, null=True)
    additional_benefits = models.ManyToManyField(AdditionalBenefit)
    policy_details = models.ManyToManyField(PolicyType)
    policy_detail_set = models.ManyToManyField(PolicyTypeSet)
    history = HistoricalRecords(
        table_name="history_motor_policy",
        history_change_reason_field=ArrayField(
            models.CharField(max_length=250, blank=True, unique=False, null=True),
            blank=True,
            unique=False,
            null=True,
        ),
        excluded_fields=["updated_at"],
    )
    agency = models.ForeignKey(
        Agency, on_delete=models.CASCADE, related_name="motor_policy_agency", null=False
    )

    def __str__(self):
        """
        Returns a string representation of this `MotorPolicy`.

        This string is used when a `User` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ["debit_note_no", "agency"],
        ]

    @property
    def get_premiums(self, *args):
        policy_commission_rate = self.policy_commission_rate
        withholding_tax = self.withholding_tax
        net_commission = 0
        gross_commission = 0
        total_levies = 0
        basic = get_premiums(
            self.minimum_premium_amount, self.commission_rate, self.value
        )
        additional_benefits = []
        if self.additional_benefits:
            additional_benefits = self.additional_benefits.all()
        additional_premiums = []
        if self.additional_premiums:
            additional_premiums = self.additional_premiums.all()
        additional_benefit_ = []
        additional_premium_ = []
        total = basic
        for benefit in additional_benefits:
            if benefit.minimum_amount:
                ben_ = {
                    "name": str(
                        dict(AdditionalBenefit.AdditionalBenefitOps.choices).get(
                            benefit.benefit, ""
                        )
                    ),
                    "amount": get_premiums(
                        benefit.minimum_amount, benefit.commission_rate, self.value
                    ),
                    "commissionRate":benefit.commission_rate
                }
                additional_benefit_.append(ben_)
                total += ben_["amount"]
        net_premium = total
        for prem in additional_premiums:
            prem_ = {
                "name": str(dict(self.PremiumType.choices).get(prem.premium, "")),
                "amount": get_premiums(
                    prem.minimum_amount,
                    prem.commission_rate,
                    total,
                    total,
                    prem.premium,
                ),
            }
            additional_premium_.append(prem_)
            total_levies += prem_["amount"]
        total += total_levies
        if policy_commission_rate:
            gross_commission = net_premium * policy_commission_rate / 100
            net_commission = gross_commission * (100 - withholding_tax) / 100
        withholding_tax_amt = gross_commission * 0.1

        premiums = {
            "basicPremium": {
                "name": str(dict(self.PremiumType.choices).get(self.premium_type, "")),
                "amount": basic,
                "minimum_premium_amount":self.minimum_premium_amount,
            },
            "AdditionalBenefits": additional_benefit_,
            "AdditionalPremiums": additional_premium_,
            "netPremiums": net_premium,
            "withholdingTax": round(withholding_tax_amt),
            "totalLevies": round(total_levies),
            "grossCommission": round(gross_commission),
            "netCommission": round(net_commission),
            "totalPremiums": round(total),
        }
        return premiums

    @property
    def calculate_total(self):
        return sum(
            self.receipt_motorpolicyreceipt_related.all().values_list(
                "amount_figures", flat=True
            )
        )

    @property
    def calculate_balance(self):
        return self.get_premiums["totalPremiums"] - sum(
            self.receipt_motorpolicyreceipt_related.all().values_list(
                "amount_figures", flat=True
            )
        )
