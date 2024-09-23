import graphene
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import DomesticPackage, DomesticPackageDetail


class DomesticPackageDetailsInput(graphene.InputObjectType):
    """
    Create Domestic Package Details Input Object Types
    """
    buildings = graphene.List(graphene.String)
    contents = graphene.List(graphene.String)
    all_risks = graphene.List(graphene.String)
    work_man_injury = graphene.List(graphene.String)
    owner_liability = graphene.List(graphene.String)
    occupiers_liability = graphene.List(graphene.String)


class DomesticPackageInput(GeneralInsInput):
    """
    Create Domestic Package Input Object Types
    """
    package_details = graphene.Field(DomesticPackageDetailsInput)


class DomesticPackageDetailsType(DjangoObjectType):
    """
    Create a GraphQL type for the DomesticPackage model
    """

    class Meta:
        '''Defines the fields to be serialized in the Domestic Package Detail model'''
        model = DomesticPackageDetail


class DomesticPackageType(DjangoObjectType):
    """
    Create a GraphQL type for the DomesticPackage model
    """
    transaction_type = graphene.String()
    premium_type = graphene.String()

    def resolve_transaction_type(self, *args):
        return dict(
            self.TransactionType.choices).get(
                self.transaction_type, "")

    def resolve_premium_type(self, *args):
        return dict(
            self.PremiumType.choices).get(
                self.premium_type, "")

    class Meta:
        '''Defines the fields to be serialized in the Domestic Package model'''
        model = DomesticPackage


class DomesticPackagePaginatedType(GeneralInsPaginatedType):
    """
    Domestic Package Client pagination input types
    """
    items = graphene.List(DomesticPackageType)
