import graphene
from graphene_django.types import DjangoObjectType
from .models import ProfessionalIndemnity


class ProfessionalIndemnityInput(graphene.InputObjectType):
    """
    Create Professional Indemnity Input Object Types
    """
    policy_no = graphene.String()
    debit_note_no = graphene.String()
    individual_client = graphene.String()
    insurance_company = graphene.String()
    transaction_date = graphene.Date()
    start_date = graphene.Date()
    end_date = graphene.Date()
    renewal_date = graphene.Date()
    sum_insured = graphene.Float()
    excess_amount = graphene.Float()
    levies = graphene.Float()
    total_premium = graphene.Float()
    commission_rate = graphene.Float()
    commission_amount = graphene.Float()
    transaction_type = graphene.String()
    premium_type = graphene.String()
    specialty_class = graphene.String()


class ProfessionalIndemnityType(DjangoObjectType):
    """
    Create a GraphQL type for the ProfessionalIndemnity model
    """

    class Meta:
        '''Defines the fields to be serialized in the Professional Indemnity model'''
        model = ProfessionalIndemnity


class ProfessionalIndemnityPaginatedType(graphene.ObjectType):
    """
    Professional Indemnity Client pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(ProfessionalIndemnityType)
