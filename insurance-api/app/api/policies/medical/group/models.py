from app.api.agency.models import Agency
from app.api.insurancecompany.models import InsuranceCompany
from django.db import models

from ...models import BasePolicyModel
from ..models import MedicalInsurance


class GroupMedicalIns(BasePolicyModel):
    """
    Group Medical Insurance model
    """

    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="group_medical_insurance_insurance_co",
        null=False, blank=False, unique=False)
    medical_insurances = models.ManyToManyField(MedicalInsurance)
    inpatient_limit = models.FloatField(blank=False, unique=False, null=True)
    outpatient_limit = models.FloatField(blank=False, unique=False, null=True)

    principal_members = models.BigIntegerField(db_index=True, blank=False, unique=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, null=False,
                               related_name="group_medical_insurance_agency")

    def __str__(self):
        """
        Returns a string representation of this `GroupMedicalIns`.

        This string is used when a `GroupMedicalIns` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
