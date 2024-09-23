import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import GoodsTransit, Property


class GoodsTransitPropertyInput(graphene.InputObjectType):
    """
    Create GoodsTransit Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class GoodsTransitInput(GeneralInsInput):
    """
    Create GoodsTransit Policy Input Object Types
    """
    goods_transit_properties = graphene.List(GoodsTransitPropertyInput)


class GoodsTransitPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the GoodsTransit model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the GoodsTransit Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class GoodsTransitType(DjangoObjectType):
    """
    Create a GraphQL type for the GoodsTransit model
    """
    # properties = graphene.List(GoodsTransitPropertyType)
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
        '''Defines the fields to be serialized in the GoodsTransit Policy model'''
        model = GoodsTransit


class GoodsTransitPaginatedType(GeneralInsPaginatedType):
    """
    GoodsTransit Policy Client pagination input types
    """
    items = graphene.List(GoodsTransitType)
