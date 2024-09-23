from app.api.agency.models import Agency
from app.api.client.models import IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from django.db import models

from ...models import BasePolicyModel
from ..models import MedicalInsurance


class IndividualMedicalIns(BasePolicyModel):
    """
    Individual Medical Insurance model
    """

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="individual_client_medical_insurance",
        null=True, blank=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="individual_client_medical_insurance_insurance_co",
        null=False, blank=False, unique=False)
    medical_insurance = models.ForeignKey(
        MedicalInsurance, on_delete=models.CASCADE,
        related_name="individual_medical_insurance", null=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, null=False,
                               related_name="individual_medical_insurance_agency")

    def __str__(self):
        """
        Returns a string representation of this `IndividualMedicalIns`.

        This string is used when a `IndividualMedicalIns` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
