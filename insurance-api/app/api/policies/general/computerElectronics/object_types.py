import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import ComputerElectronic, Property


class ComputerElectronicPropertyInput(graphene.InputObjectType):
    """
    Create ComputerElectronic Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class ComputerElectronicInput(GeneralInsInput):
    """
    Create ComputerElectronic Policy Input Object Types
    """
    computer_electronic_properties = graphene.List(ComputerElectronicPropertyInput)


class ComputerElectronicPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the ComputerElectronic model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the ComputerElectronic Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class ComputerElectronicType(DjangoObjectType):
    """
    Create a GraphQL type for the ComputerElectronic model
    """
    # properties = graphene.List(ComputerElectronicPropertyType)
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
        '''Defines the fields to be serialized in the ComputerElectronic Policy model'''
        model = ComputerElectronic


class ComputerElectronicPaginatedType(GeneralInsPaginatedType):
    """
    ComputerElectronic Policy Client pagination input types
    """
    items = graphene.List(ComputerElectronicType)
