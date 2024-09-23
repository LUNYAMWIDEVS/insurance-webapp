import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import BurglaryPolicy, Property


class BurglaryPropertyInput(graphene.InputObjectType):
    """
    Create Burglary Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class BurglaryPolicyInput(GeneralInsInput):
    """
    Create Burglary Policy Input Object Types
    """
    burglary_properties = graphene.List(BurglaryPropertyInput)


class BurglaryPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the BurglaryPolicy model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the Burglary Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class BurglaryPolicyType(DjangoObjectType):
    """
    Create a GraphQL type for the BurglaryPolicy model
    """
    # properties = graphene.List(BurglaryPropertyType)
    transaction_type = graphene.String()
    premium_type = graphene.String()
    history = graphene.List(GenericScalar)

    def resolve_history(self, info):
        return get_history(self)

    def resolve_transaction_type(self, *args):
        return dict(
            self.TransactionType.choices).get(
                self.transaction_type, "")

    def resolve_premium_type(self, *args):
        return dict(
            self.PremiumType.choices).get(
                self.premium_type, "")

    class Meta:
        '''Defines the fields to be serialized in the Burglary Policy model'''
        model = BurglaryPolicy


class BurglaryPolicyPaginatedType(GeneralInsPaginatedType):
    """
    Burglary Policy Client pagination input types
    """
    items = graphene.List(BurglaryPolicyType)
