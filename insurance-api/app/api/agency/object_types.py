import graphene
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..history.views import get_history
from .models import Agency


class AgencyInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    name = graphene.String()
    office_location = graphene.String()
    box_number = graphene.Int()
    postal_code = graphene.Int()
    phone_number = graphene.String()
    agency_email = graphene.String()
    image_url = graphene.String()


class AgencyType(DjangoObjectType):
    """
    Create a GraphQL type for the Agency model
    """

    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the agency model'''
        model = Agency

    def resolve_history(self, info):
        return get_history(self)
