from app.api.agency.models import Agency
from app.api.client.models import IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models

from ...models import BasePolicyModel


class TravelDetail(BaseModel):
    """
    Travel Details model
    """
    option = models.CharField(db_index=True, max_length=100)
    passport_no = models.BigIntegerField(db_index=True, blank=False,
                                         unique=False, null=True)
    date_of_travel = models.DateField(max_length=8, null=False, blank=False)
    countries_of_travel = ArrayField(models.CharField(db_index=True, max_length=100),
                                     blank=True, unique=False, null=True)
    modes_of_travel = ArrayField(models.CharField(db_index=True, max_length=100),
                                 blank=True, unique=False, null=True)
    reasons_of_travel = ArrayField(models.CharField(db_index=True, max_length=100),
                                   blank=True, unique=False, null=True)
    next_of_kin = ArrayField(models.JSONField(unique=False, null=False),
                             blank=True, unique=False, null=True)


class Travel(BasePolicyModel):
    """
    Travel model
    """

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="individual_client_travel",
        null=True, blank=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="travel_insurance_co",
        null=False, blank=False, unique=False)
    travel_details = models.ForeignKey(
        TravelDetail, on_delete=models.CASCADE,
        related_name="travel_details",
        null=False, blank=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="travel_agency", null=False)

    def __str__(self):
        """
        Returns a string representation of this `Travel`.

        This string is used when a `Travel` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
