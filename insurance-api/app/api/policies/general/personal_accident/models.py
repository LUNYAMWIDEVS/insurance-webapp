from app.api.agency.models import Agency
from app.api.client.models import IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _

from ...models import BasePolicyModel


class PersonalAccident(BasePolicyModel):
    """
    Personal accident model
    """

    class BenefitsType(models.TextChoices):
        """
        Benefit choices
        """
        DEATH = 'DEATH', _('Accidental Death')
        PERMDISS = 'PERMDISS', _('Permanent Total Disablement')
        TEMPDISS = 'TEMPDISS', _('Temporary Total Disablement')
        HOSP = 'HOSP', _('Hospital cash')
        ACCMED = 'ACCMED', _('Accidental Medical Expenses')
        ACCDENT = 'ACCDENT', _('Accidental Dental Treatment ')
        ARTAPPL = 'ARTAPPL', _('Artificial Appliances')
        WHEEL = 'WHEEL', _('Wheel chair')
        OPTICAL = 'OPTICAL', _('Optical')
        HEARING = 'HEARING', _('Hearing Aids')
        LOCALEV = 'LOCALEV', _('Local Evacuation')
        FUNCOVER = 'FUNCOVER', _('Funeral Cover')

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="individual_client_personal_accident",
        null=True, blank=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="personal_accident_insurance_co",
        null=False, blank=False, unique=False)
    benefit_limits = ArrayField(models.CharField(
        db_index=True,
        max_length=100, choices=BenefitsType.choices,
        default=BenefitsType.DEATH),
        blank=True, unique=False, null=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="personal_accident_agency", null=False)

    def __str__(self):
        """
        Returns a string representation of this `PersonalAccident`.

        This string is used when a `PersonalAccident` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
