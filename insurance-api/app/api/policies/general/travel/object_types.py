import graphene
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import Travel, TravelDetail
from graphene.types.generic import GenericScalar


class NextOfKinInput(graphene.InputObjectType):
    """
    Create Next of Kin Input Object Types
    """
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    relationship = graphene.String(required=True)
    email = graphene.String(required=True)
    phone_number = graphene.String(required=True)


class TravelDetailsInput(graphene.InputObjectType):
    """
    Create Travel Details Input Object Types
    """
    option = graphene.String()
    passport_no = graphene.Int()
    date_of_travel = graphene.Date()
    countries_of_travel = graphene.List(graphene.String)
    modes_of_travel = graphene.List(graphene.String)
    reasons_of_travel = graphene.List(graphene.String)
    next_of_kin = graphene.List(NextOfKinInput, required=True)


class TravelInput(GeneralInsInput):
    """
    Create Travel Input Object Types
    """
    travel_details = graphene.Field(TravelDetailsInput)


class TravelDetailsType(DjangoObjectType):
    """
    Create a GraphQL type for the Travel model
    """
    next_of_kin = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the Travel Detail model'''
        model = TravelDetail


class TravelType(DjangoObjectType):
    """
    Create a GraphQL type for the Travel model
    """
    travel_details = graphene.Field(TravelDetailsType)
    transaction_type = graphene.String()
    premium_type = graphene.String()

    def resolve_transaction_type(self, *args):
        return dict(
            self.TransactionType.choices).get(
                self.transaction_type, "")

    def resolve_premium_type(self, *args):
        return dict(
            self.PremiumType.choices).get(
                self.premium_type, "")

    class Meta:
        '''Defines the fields to be serialized in the Travel model'''
        model = Travel


class TravelPaginatedType(GeneralInsPaginatedType):
    """
    Travel Client pagination input types
    """
    items = graphene.List(TravelType)
