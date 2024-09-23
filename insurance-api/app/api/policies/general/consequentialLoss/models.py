from app.api.agency.models import Agency
from app.api.client.models import IndividualClient,CorporateClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models
from simple_history.models import HistoricalRecords

from ...models import BasePolicyModel


class Property(BaseModel):
    """
    Consequential Loss Policy model
    """
    name = models.CharField(db_index=True, max_length=100, blank=False)
    description = models.CharField(db_index=True, max_length=250, blank=False)
    value = models.FloatField(db_index=True, blank=False)
    history = HistoricalRecords(table_name="history_consequential_property",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])


class ConsequentialLoss(BasePolicyModel):
    """
    Consequential Loss Policy model
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
    consequential_loss_properties = models.ManyToManyField(Property)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=False)

    history = HistoricalRecords(table_name="history_consequential_policy",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])

    def __str__(self):
        """
        Returns a string representation of this `Consequential LossPolicy`.

        This string is used when a `Consequential LossPolicy` is printed in the console.
        """
        return "{} - {}".format(self.policy_no, self.agency.name)

    class Meta:
        unique_together = [
            ['policy_no', 'agency']
        ]
