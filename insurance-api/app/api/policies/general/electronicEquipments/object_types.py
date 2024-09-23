import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import ElectronicEquipment, Property


class ElectronicEquipmentPropertyInput(graphene.InputObjectType):
    """
    Create ElectronicEquipment Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class ElectronicEquipmentInput(GeneralInsInput):
    """
    Create ElectronicEquipment Policy Input Object Types
    """
    electronic_equipment_properties = graphene.List(ElectronicEquipmentPropertyInput)


class ElectronicEquipmentPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the ElectronicEquipment model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the ElectronicEquipment Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class ElectronicEquipmentType(DjangoObjectType):
    """
    Create a GraphQL type for the ElectronicEquipment model
    """
    # properties = graphene.List(ElectronicEquipmentPropertyType)
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
        '''Defines the fields to be serialized in the ElectronicEquipment Policy model'''
        model = ElectronicEquipment


class ElectronicEquipmentPaginatedType(GeneralInsPaginatedType):
    """
    ElectronicEquipment Policy Client pagination input types
    """
    items = graphene.List(ElectronicEquipmentType)
