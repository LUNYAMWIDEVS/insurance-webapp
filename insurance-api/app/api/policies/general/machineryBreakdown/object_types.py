import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import MachineryBreakdown, Property


class MachineryBreakdownPropertyInput(graphene.InputObjectType):
    """
    Create MachineryBreakdown Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class MachineryBreakdownInput(GeneralInsInput):
    """
    Create MachineryBreakdown Policy Input Object Types
    """
    machinery_breakdown_properties = graphene.List(MachineryBreakdownPropertyInput)


class MachineryBreakdownPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the MachineryBreakdown model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the MachineryBreakdown Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class MachineryBreakdownType(DjangoObjectType):
    """
    Create a GraphQL type for the MachineryBreakdown model
    """
    # properties = graphene.List(MachineryBreakdownPropertyType)
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
        '''Defines the fields to be serialized in the MachineryBreakdown Policy model'''
        model = MachineryBreakdown


class MachineryBreakdownPaginatedType(GeneralInsPaginatedType):
    """
    MachineryBreakdown Policy Client pagination input types
    """
    items = graphene.List(MachineryBreakdownType)
