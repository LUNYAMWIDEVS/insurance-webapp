import graphene
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import WibaPolicy


class WibaPolicyInput(GeneralInsInput):
    """
    Create Wiba Policy Input Object Types
    """
    no_of_staff = graphene.Int()
    estimate_annual_earning = graphene.Float()


class WibaPolicyType(DjangoObjectType):
    """
    Create a GraphQL type for the WibaPolicy model
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
        '''Defines the fields to be serialized in the Wiba Policy model'''
        model = WibaPolicy


class WibaPolicyPaginatedType(GeneralInsPaginatedType):
    """
    Wiba Policy Client pagination input types
    """
    items = graphene.List(WibaPolicyType)
