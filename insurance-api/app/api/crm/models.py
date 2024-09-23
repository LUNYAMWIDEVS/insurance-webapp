from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords
from app.api.authentication.models import User

from ..agency.models import Agency

# Create your models here.


class ContactManager(BaseModel):

    STATUS_CHOICES = (
        ('A', 'Active'),
        ('E', 'Exited'),
    )

    class GenderOptions(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F', _('Female')
        OTHER = 'P', _('Prefer not to disclose')

    # personal_details
    name = models.CharField(max_length=250)
    position = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    email = models.EmailField()
    facebook_account = models.URLField(null=True, blank=True)
    twitter_account = models.URLField(null=True, blank=True)
    instagram_account = models.URLField(null=True, blank=True)
    linkedin_account = models.URLField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    gender = models.CharField(
        max_length=2,
        choices=GenderOptions.choices,
        default=GenderOptions.FEMALE,
        blank=False, unique=False
    )
    corporate_clients = models.ManyToManyField(
        'client.CorporateClient')
    individual_clients = models.ManyToManyField(
        'client.IndividualClient')
    service_line = models.CharField(max_length=250)
    date_of_birth = models.DateField(max_length=8, null=True, blank=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=True)
    history = HistoricalRecords(table_name="history_crm",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])

    def __str__(self):
        """
        Returns a string representation of this model.

        This string is used when a model is printed in the console.
        """
        return "{} - {}".format(self.name, self.agency.name)

    class Meta:
        unique_together = [
            ['email', 'agency'],
            ['phone_number', 'agency']
        ]


class Message(BaseModel):
    """
    Message model
    """

    class MessageOptions(models.TextChoices):
        MULTIPLE = 'M', _('Sent to multiple users')
        SINGLE = 'S', _('Sent to a single user')
        ALL = 'A', _('Sent to all users')
        ALLCOR = 'AC', _('Sent to all corporate clients')
        ALLIND = 'AI', _('Sent to all individual clients')
        ALLCONT = 'ACP', _('Sent to all contact persons')

    sms = models.CharField(max_length=250, null=True, blank=True,
                           db_index=True, unique=False)
    email_body = models.CharField(max_length=500, null=True,
                                  blank=True, db_index=True, unique=False)
    email_subject = models.CharField(max_length=50, null=True,
                                     blank=True, db_index=True, unique=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    option = models.CharField(
        max_length=7,
        choices=MessageOptions.choices,
        default=MessageOptions.SINGLE,
        blank=False, unique=False
    )
    individual_clients = models.ManyToManyField("client.IndividualClient")
    corporate_clients = models.ManyToManyField("client.CorporateClient")
    contact_persons = models.ManyToManyField(ContactManager)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                            related_name="%(app_label)s_%(class)s_related", null=True)
    history = HistoricalRecords(table_name="history_message",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])

    def __str__(self):
        """
        Returns a string representation of this model.

        This string is used when a model is printed in the console.
        """
        return "{} - {}".format(self.id, self.agency.name)


class WhatsappMessages(BaseModel):
    """
    WhatsApp messages Model
    """

    class MessageOptions(models.TextChoices):
        MULTIPLE = 'M', _('Sent to multiple users')
        SINGLE = 'S', _('Sent to a single user')
        ALL = 'A', _('Sent to all users')
        ALLCOR = 'AC', _('Sent to all corporate clients')
        ALLIND = 'AI', _('Sent to all individual clients')
        ALLCONT = 'ACP', _('Sent to all contact persons')

    whatsapp_sms = models.CharField(max_length=1024, null=True, blank=True,
                                    db_index=True, unique=False)
    whatsapp_response = models.CharField(max_length=2156, null=True,
                                        blank=True, db_index=True, unique=False)
    whatsapp_phone_number = models.CharField(max_length=50, null=True,
                                            blank=True, db_index=True, unique=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    option = models.CharField(
        max_length=7,
        choices=MessageOptions.choices,
        default=MessageOptions.SINGLE,
        blank=True, null=True, unique=False
    )
    sales_agent_assigned = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        related_name="%(app_label)s_%(class)s_related", null=True, blank=True)
    previous_responses = models.ManyToManyField("self", blank=True)
    individual_clients = models.ManyToManyField("client.IndividualClient")
    corporate_clients = models.ManyToManyField("client.CorporateClient")
    history = HistoricalRecords(table_name="history_whatsapp_message",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])
    is_bot = models.BooleanField(default=False)

    def __str__(self):
        """
        Returns a string representation of this model.

        This string is used when a model is printed in the console.
        """
        return "{} - {}".format(self.id, self.whatsapp_sms)
