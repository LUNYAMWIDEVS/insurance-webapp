from app.api.agency.models import Agency
from app.api.client.models import IndividualClient, CorporateClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.models import BaseModel
from django.db import models
from django.utils.translation import gettext_lazy as _
from ...models import BasePolicyModel


class Property(BaseModel):
    """
    Fire Policy model properties
    """
    name = models.CharField(db_index=True, max_length=100, blank=False)
    description = models.CharField(db_index=True, max_length=250, blank=False)
    value = models.FloatField(db_index=True, blank=False)


class FireInsuranceDetails(BaseModel):
    """
    this model comprises of the fireinsurance details
    """
    value = models.FloatField()
    basic_premium = models.FloatField()
    compensation_fund_levy = models.FloatField()
    training_levy = models.FloatField()
    stamp_duty = models.FloatField()
    gross_premium = models.FloatField()
    commission = models.FloatField()
    withholding_tax = models.FloatField()

    def __str__(self):
        """

        string represtantion of the fire 
        insurance details model

        """
        return str(basic_premium)


class FirePolicy(BasePolicyModel):
    """
    Fire Policy model
    """

    transaction_date = models.DateField(blank=False)

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="individual_client_fire_policy",
        null=True, blank=True, unique=False)
    corporate_client = models.ForeignKey(
        CorporateClient, on_delete=models.CASCADE,
        related_name="corporate_client_fire_policy",
        null=True, blank=True, unique=False)
    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="fire_policy_insurance_co",
        null=False, blank=False, unique=False)
    properties = models.ManyToManyField(Property)

    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="fire_policy_agency", null=False)
   
    def __str__(self):
        """
        Returns a string representation of this `FirePolicy`.

        This string is used when a `FirePolicy` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
