import graphene
from graphene_django.types import DjangoObjectType
from graphene.types.generic import GenericScalar

from ..history.views import get_history
from .models import InsuranceCompany


class InsuranceCompanyInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    name = graphene.String()
    contact_person = graphene.String()
    postal_address = graphene.String()
    physicalAddress = graphene.String()
    mobile_number = graphene.List(graphene.String)
    telephone_number = graphene.List(graphene.String)
    email = graphene.String()
    image_url = graphene.String()


class InsuranceCompanyType(DjangoObjectType):
    """
    Create a GraphQL type for the InsuranceCompany model
    """
    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the agency model'''
        model = InsuranceCompany

    def resolve_history(self, info):
        return get_history(self)


class InsuranceCompanyPaginatedType(graphene.ObjectType):
    """
    Insurance Company Client pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(InsuranceCompanyType)
