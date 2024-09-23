from django.db import models
from app.api.insurancecompany.models import InsuranceCompany
from app.api.models import BaseModel
from app.api.policies.models import BasePolicyModel
from app.api.helpers.choices import InsuranceClasses
from app.api.policies.general.motor.models import MotorPolicy, PolicyTypeSet
from app.api.agency.models import Agency
from app.api.policies.general.helpers.premiums import (
    get_premiums,
    get_premiums_credit_note,
)
from simple_history.models import HistoricalRecords
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField


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
        table_name="history_policy_deletions",
        history_change_reason_field=ArrayField(
            models.CharField(max_length=250, blank=True, unique=False, null=True),
            blank=True,
            unique=False,
            null=True,
        ),
        excluded_fields=["updated_at"],
    )


# Create your models here.
class PolicyDeletion(BasePolicyModel):
    """
    Policy Deletion Model
    """

    policy = models.ForeignKey(MotorPolicy, on_delete=models.CASCADE)
    remarks = models.TextField(max_length=500, blank=True, null=True)
    additional_benefits = models.ManyToManyField(AdditionalBenefit)
    value = models.FloatField(blank=True, null=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany,
        on_delete=models.CASCADE,
        related_name="policy_deletion_insurance_co",
        null=True,
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="policy_deletion_agency",
        null=True,
    )
    insurance_class = models.CharField(
        max_length=50, choices=InsuranceClasses.choices, null=True
    )
    policy_detail_set = models.ManyToManyField(PolicyTypeSet)

    def __str__(self):
        return self.policy.policy_no

    @property
    def get_premiums(self, *args):
        policy_commission_rate = self.policy_commission_rate
        withholding_tax = self.withholding_tax
        net_commission = 0
        gross_commission = 0
        total_levies = 0
        basic = get_premiums_credit_note(
            self.minimum_premium_amount, self.commission_rate
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
                    "benefit": benefit.benefit,
                    "amount": get_premiums(
                        benefit.minimum_amount,
                        benefit.commission_rate,
                        self.value,
                    ),
                    "commissionRate": benefit.commission_rate,
                }
                additional_benefit_.append(ben_)
                total += ben_["amount"]
        net_premium = total
        for prem in additional_premiums:
            prem_ = {
                "name": str(dict(self.PremiumType.choices).get(prem.premium, "")),
                "amount": get_premiums_credit_note(
                    prem.minimum_amount, prem.commission_rate, total, prem.premium
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

    class Meta:
        verbose_name = "Policy Deletion"
        verbose_name_plural = "Policy Deletions"
        db_table = "policy_deletions"
        unique_together = [
            ["debit_note_no", "agency"],
        ]
