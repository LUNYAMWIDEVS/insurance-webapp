import graphene
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import FirePolicy, Property


class PropertyInput(graphene.InputObjectType):
    """
    Create Fire Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class FirePolicyInput(GeneralInsInput):
    """
    Create Fire Policy Input Object Types
    """
    properties = graphene.List(PropertyInput)
    


class PropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the FirePolicy model
    """

    class Meta:
        '''Defines the fields to be serialized in the Fire Policy Detail model'''
        model = Property


class FirePolicyType(DjangoObjectType):
    """
    Create a GraphQL type for the FirePolicy model
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
        '''Defines the fields to be serialized in the Fire Policy model'''
        model = FirePolicy


class FirePolicyPaginatedType(GeneralInsPaginatedType):
    """
    Fire Policy Client pagination input types
    """
    items = graphene.List(FirePolicyType)
