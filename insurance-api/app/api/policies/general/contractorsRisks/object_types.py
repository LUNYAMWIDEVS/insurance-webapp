import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import ContractorsRisk, Property


class ContractorsRiskPropertyInput(graphene.InputObjectType):
    """
    Create ContractorsRisk Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class ContractorsRiskInput(GeneralInsInput):
    """
    Create ContractorsRisk Policy Input Object Types
    """
    contractor_properties = graphene.List(ContractorsRiskPropertyInput)


class ContractorsRiskPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the ContractorsRisk model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the ContractorsRisk Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class ContractorsRiskType(DjangoObjectType):
    """
    Create a GraphQL type for the ContractorsRisk model
    """
    # properties = graphene.List(ContractorsRiskPropertyType)
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
        '''Defines the fields to be serialized in the ContractorsRisk Policy model'''
        model = ContractorsRisk


class ContractorsRiskPaginatedType(GeneralInsPaginatedType):
    """
    ContractorsRisk Policy Client pagination input types
    """
    items = graphene.List(ContractorsRiskType)
