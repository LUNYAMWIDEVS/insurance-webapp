import graphene
from app.api.history.views import get_history
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import PoliticalViolence, Property


class PoliticalViolencePropertyInput(graphene.InputObjectType):
    """
    Create PoliticalViolence Policy Details Input Object Types
    """
    name = graphene.String()
    description = graphene.String()
    value = graphene.Float()


class PoliticalViolenceInput(GeneralInsInput):
    """
    Create PoliticalViolence Policy Input Object Types
    """
    political_violence_properties = graphene.List(PoliticalViolencePropertyInput)


class PoliticalViolencePropertyType(DjangoObjectType):
    """
    Create a GraphQL type for the PoliticalViolence model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the PoliticalViolence Policy Detail model'''
        model = Property

    def resolve_history(self, info):
        return get_history(self)


class PoliticalViolenceType(DjangoObjectType):
    """
    Create a GraphQL type for the PoliticalViolence model
    """
    # properties = graphene.List(PoliticalViolencePropertyType)
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
        '''Defines the fields to be serialized in the PoliticalViolence Policy model'''
        model = PoliticalViolence


class PoliticalViolencePaginatedType(GeneralInsPaginatedType):
    """
    PoliticalViolence Policy Client pagination input types
    """
    items = graphene.List(PoliticalViolenceType)
