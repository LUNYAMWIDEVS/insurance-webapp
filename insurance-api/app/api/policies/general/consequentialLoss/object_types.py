import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import ConsequentialLoss, Property


class ConsequentialLossPropertyInput(graphene.InputObjectType):
    """
    Create ConsequentialLoss Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class ConsequentialLossInput(GeneralInsInput):
    """
    Create ConsequentialLoss Policy Input Object Types
    """
    consequential_loss_properties = graphene.List(ConsequentialLossPropertyInput)


class ConsequentialLossPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the ConsequentialLoss model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the ConsequentialLoss Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class ConsequentialLossType(DjangoObjectType):
    """
    Create a GraphQL type for the ConsequentialLoss model
    """
    # properties = graphene.List(ConsequentialLossPropertyType)
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
        '''Defines the fields to be serialized in the ConsequentialLoss Policy model'''
        model = ConsequentialLoss


class ConsequentialLossPaginatedType(GeneralInsPaginatedType):
    """
    ConsequentialLoss Policy Client pagination input types
    """
    items = graphene.List(ConsequentialLossType)
