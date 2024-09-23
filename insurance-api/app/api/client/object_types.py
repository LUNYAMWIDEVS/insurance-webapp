import graphene
from django_filters import OrderingFilter
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..history.views import get_history
from .models import CorporateClient, IndividualClient


class CorporateClientType(DjangoObjectType):
    """
    Create a GraphQL type for the client model
    """
    history = graphene.List(GenericScalar)
    status = graphene.String()

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = CorporateClient

    def resolve_history(self, info):
        return get_history(self)

    def resolve_status(self, *args):
        return self.get_status_display()


class IndividualClientType(DjangoObjectType):
    """
    Create a GraphQL type for the client model
    """
    description = " Type definition for a single client "
    history = graphene.List(GenericScalar)
    order_by = OrderingFilter(fields=(
        ('first_name', 'last_name'),
    ))
    gender = graphene.String()
    status = graphene.String()

    def resolve_gender(self, *args):
        return self.get_gender_display()

    def resolve_status(self, *args):
        return self.get_status_display()

    def resolve_history(self, info):
        return get_history(self)

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = IndividualClient


class IndividualClientInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    first_name = graphene.String()
    last_name = graphene.String()
    surname = graphene.String()
    email = graphene.String()
    kra_pin = graphene.String()
    id_number = graphene.Int()
    last_name = graphene.String()
    phone_number = graphene.String()
    gender = graphene.String()
    postal_address = graphene.String()
    contact_persons = graphene.List(graphene.String)
    date_of_birth = graphene.Date()
    occupation = graphene.String()
    town = graphene.String()
    status = graphene.String()


class CorporateClientInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    name = graphene.String()
    about = graphene.String()
    email = graphene.String()
    kra_pin = graphene.String()
    phone_number = graphene.String()
    postal_address = graphene.String()
    town = graphene.String()
    contact_persons = graphene.List(graphene.String)
    facebook_account = graphene.String()
    twitter_account = graphene.String()
    instagram_account = graphene.String()
    linkedin_account = graphene.String()
    status = graphene.String()


class CorporateClientPaginatedType(graphene.ObjectType):
    """
    Corporate Client pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(CorporateClientType)


class IndividualClientPaginatedType(graphene.ObjectType):
    """
    Individual Client pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(IndividualClientType)
