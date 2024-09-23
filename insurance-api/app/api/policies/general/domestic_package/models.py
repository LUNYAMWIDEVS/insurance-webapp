from app.api.agency.models import Agency
from app.api.client.models import IndividualClient,CorporateClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models

from ...models import BasePolicyModel


class DomesticPackageDetail(BaseModel):
    """
    Domestic Package Details model
    """
    buildings = ArrayField(models.CharField(db_index=True, max_length=100),
                        blank=True, unique=False, null=True)
    contents = ArrayField(models.CharField(db_index=True, max_length=100),
                        blank=True, unique=False, null=True)
    all_risks = ArrayField(models.CharField(db_index=True, max_length=100),
                        blank=True, unique=False, null=True)
    work_man_injury = ArrayField(models.CharField(db_index=True, max_length=100),
                                blank=True, unique=False, null=True)
    owner_liability = ArrayField(models.CharField(db_index=True, max_length=100),
                                blank=True, unique=False, null=True)
    occupiers_liability = ArrayField(models.CharField(db_index=True, max_length=100),
                                    blank=True, unique=False, null=True)


class DomesticPackage(BasePolicyModel):
    """
    Domestic package model
    """

    individual_client = models.ForeignKey(
        IndividualClient, on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=True, blank=True, unique=False)
    
    corporate_client = models.ForeignKey(
        CorporateClient, on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=True, blank=True, unique=False)

    insurance_company = models.ForeignKey(
        InsuranceCompany, on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=False, blank=False, unique=False)
    package_details = models.ForeignKey(
        DomesticPackageDetail, on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related",
        null=False, blank=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=False)

    def __str__(self):
        """
        Returns a string representation of this `DomesticPackage`.

        This string is used when a `DomesticPackage` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
