import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import Money, Property


class MoneyPropertyInput(graphene.InputObjectType):
    """
    Create Money Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class MoneyInput(GeneralInsInput):
    """
    Create Money Policy Input Object Types
    """
    money_properties = graphene.List(MoneyPropertyInput)


class MoneyPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the Money model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the Money Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class MoneyType(DjangoObjectType):
    """
    Create a GraphQL type for the Money model
    """
    # properties = graphene.List(MoneyPropertyType)
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
        '''Defines the fields to be serialized in the Money Policy model'''
        model = Money


class MoneyPaginatedType(GeneralInsPaginatedType):
    """
    Money Policy Client pagination input types
    """
    items = graphene.List(MoneyType)
