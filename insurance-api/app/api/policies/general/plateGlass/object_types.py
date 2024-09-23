import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import PlateGlass, Property


class PlateGlassPropertyInput(graphene.InputObjectType):
    """
    Create PlateGlass Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class PlateGlassInput(GeneralInsInput):
    """
    Create PlateGlass Policy Input Object Types
    """
    plate_glass_properties = graphene.List(PlateGlassPropertyInput)


class PlateGlassPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the PlateGlass model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the PlateGlass Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class PlateGlassType(DjangoObjectType):
    """
    Create a GraphQL type for the PlateGlass model
    """
    # properties = graphene.List(PlateGlassPropertyType)
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
        '''Defines the fields to be serialized in the PlateGlass Policy model'''
        model = PlateGlass


class PlateGlassPaginatedType(GeneralInsPaginatedType):
    """
    PlateGlass Policy Client pagination input types
    """
    items = graphene.List(PlateGlassType)
