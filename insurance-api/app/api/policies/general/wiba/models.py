from app.api.agency.models import Agency
from app.api.client.models import IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from django.db import models

from ...models import BasePolicyModel


class WibaPolicy(BasePolicyModel):
    """
    Wiba Policy model
    """

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="individual_client_wiba_policy",
        null=True, blank=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="wiba_policy_insurance_co",
        null=False, blank=False, unique=False)
    no_of_staff = models.BigIntegerField(db_index=True, blank=False)
    estimate_annual_earning = models.FloatField(db_index=True, blank=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="wiba_policy_agency", null=False)

    def __str__(self):
        """
        Returns a string representation of this `WibaPolicy`.

        This string is used when a `WibaPolicy` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
