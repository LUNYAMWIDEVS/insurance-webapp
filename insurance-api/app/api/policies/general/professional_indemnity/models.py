from django.db import models
from django.utils.translation import gettext_lazy as _

from app.api.client.models import IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.agency.models import Agency
from ...models import BasePolicyModel


class ProfessionalIndemnity(BasePolicyModel):
    """
    Professional Indemnity model
    """

    class SpecialtyClass(models.TextChoices):
        """
        Specialty Class choices
        """
        DENT = 'DENT', _('Dentists')
        RAD = 'RAD', _('Radiologists')
        PATH = 'PATH', _('Pathologists')
        DERM = 'DERM', _('Dermatologists')
        GEN_PRAC = 'GEN_PRAC', _('General Practitioners')
        GYN = 'GYN', _('Gynecologists')
        SURG = 'SURG', _('Surgeons')
        DEL = 'DEL', _('Deletion')

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="individual_client_professional_indemnity",
        null=True, blank=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="professional_indemnity_insurance_co",
        null=False, blank=False, unique=False)
    levies = models.FloatField(blank=True, unique=False)
    total_premium = models.FloatField(blank=True, unique=False)
    sum_insured = models.FloatField(blank=False, unique=False)
    excess_amount = models.FloatField(blank=True, unique=False)
    commission_amount = models.FloatField(blank=False, unique=False)
    specialty_class = models.CharField(
        max_length=10, choices=SpecialtyClass.choices,
        default=SpecialtyClass.GEN_PRAC)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="professional_indemnity_agency", null=False)

    def __str__(self):
        """
        Returns a string representation of this `ProfessionalIndemnity`.

        This string is used when a `ProfessionalIndemnity` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
