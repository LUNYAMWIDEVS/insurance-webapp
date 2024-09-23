from app.api.models import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import IntegrityError, models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords

from ..agency.models import Agency
from ..authentication.helpers.user_helpers import create_username_slug
from ..authentication.models import User
# from ..crm.models import ContactManager


class Client(BaseModel):
    """
    Individual client model
    """
    STATUS_CHOICES = [
        ('P', 'Prospective'),
        ('A', 'Active'),
        ('D', 'Dormant'),

    ]
    status = models.CharField(max_length=10, null=True,
                              blank=True, choices=STATUS_CHOICES)
    email = models.CharField(db_index=True, max_length=255,
                             blank=True, null=True, unique=True)
    client_number = models.CharField(db_index=True, max_length=255, blank=True, null=True)
    postal_address = models.CharField(max_length=70, blank=True,
                                      unique=False, null=True)
    kra_pin = models.CharField(max_length=250, blank=True,
                               unique=False, null=True)
    phone_number = models.CharField(max_length=200, blank=True, null=True, unique=True)

    town = models.CharField(max_length=250, blank=True, null=True)
    location = models.CharField(max_length=250, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    facebook_account = models.URLField(blank=True, null=True)
    twitter_account = models.URLField(blank=True, null=True)
    instagram_account = models.URLField(blank=True, null=True)
    linkedin_account = models.URLField(blank=True, null=True)
    contact_persons = models.ManyToManyField('crm.ContactManager', blank=True)

    def __str__(self):
        """
        Returns a string representation of this `User`.

        This string is used when a `User` is printed in the console.
        """
        return "{} - {}".format(self.email, self.agency.name)

    class Meta:
        abstract = True  # Set this model as Abstract


class IndividualClient(Client):

    """
    Individual client model
    """
    class GenderOptions(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F', _('Female')
        OTHER = 'P', _('Prefer not to disclose')

    first_name = models.CharField(max_length=255, blank=True, unique=False, null=True)
    last_name = models.CharField(max_length=255, blank=True, unique=False, null=True)
    surname = models.CharField(max_length=255, blank=True, null=True, unique=False)
    id_number = models.BigIntegerField(db_index=True, blank=True,
                                       unique=False, null=True)
    gender = models.CharField(
        max_length=2,
        choices=GenderOptions.choices,
        default=GenderOptions.FEMALE,
        blank=True, unique=False, null=True
    )
    history = HistoricalRecords(table_name="history_individual_client",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])
    date_of_birth = models.DateField(max_length=8, null=True, blank=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=False)

    def __str__(self):
        """
        Returns a string representation of this `User`.

        This string is used when a `User` is printed in the console.
        """
        return "{} - {}".format(self.email, self.agency.name)

    class Meta:
        unique_together = [
            ['email', 'agency'],
            ['phone_number', 'agency'],
            ['kra_pin', 'agency'],
            ['id_number', 'agency'],
        ]


class CorporateClient(Client):

    """
    Corporate client model
    """
    kra_pin = models.CharField(max_length=255, blank=True,
                               unique=False, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    about = models.CharField(max_length=250, blank=True, null=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE,
                               related_name="%(app_label)s_%(class)s_related", null=False)

    history = HistoricalRecords(table_name="history_corporate_client",
                                history_change_reason_field=ArrayField(models.CharField(
                                    max_length=250, blank=True,
                                    unique=False, null=True), blank=True,
                                    unique=False, null=True),
                                excluded_fields=["updated_at"])

    def __str__(self):
        """
        Returns a string representation of this `CorporateClient`.

        This string is used when a `CorporateClient` is printed in the console.
        """
        return "{} - {}".format(self.name, self.agency.name)

    class Meta:
        unique_together = [
            ['email', 'agency'],
            ['phone_number', 'agency'],
        ]


@receiver(post_save, sender=IndividualClient)
def create_user_account(sender, instance, created, **kwargs):
    """
    Create user account after creating
    Args:
        sender (obj): model sender object
        instance (obj): IndividualClient model object
        created (bool): if object is created
    Returns:
        None
    """
    if instance.status != "P":
        data = {'username': create_username_slug(instance.first_name),
                'password': instance.first_name.lower() + "default-password",
                'email': instance.email,
                'first_name': instance.first_name,
                'last_name': instance.first_name,
                'phone_number': instance.phone_number,
                'agency': instance.agency}
        try:
            User.objects.create_user(**data)
        except IntegrityError:
            pass


@receiver(pre_save, sender=CorporateClient)
@receiver(pre_save, sender=IndividualClient)
def add_prospective_details(sender, instance, **kwargs):
    if not instance.email:
        instance.email = f"prospective{instance.id[:7]}-@gmail.com"
    if not instance.phone_number:
        instance.phone_number = f"+2547{instance.id[:7]}-"
