import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import IndustrialAllRisk, Property


class IndustrialAllRiskPropertyInput(graphene.InputObjectType):
    """
    Create IndustrialAllRisk Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class IndustrialAllRiskInput(GeneralInsInput):
    """
    Create IndustrialAllRisk Policy Input Object Types
    """
    industrial_all_risks_properties = graphene.List(IndustrialAllRiskPropertyInput)


class IndustrialAllRiskPropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the IndustrialAllRisk model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the IndustrialAllRisk Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class IndustrialAllRiskType(DjangoObjectType):
    """
    Create a GraphQL type for the IndustrialAllRisk model
    """
    # properties = graphene.List(IndustrialAllRiskPropertyType)
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
        '''Defines the fields to be serialized in the IndustrialAllRisk Policy model'''
        model = IndustrialAllRisk


class IndustrialAllRiskPaginatedType(GeneralInsPaginatedType):
    """
    IndustrialAllRisk Policy Client pagination input types
    """
    items = graphene.List(IndustrialAllRiskType)
