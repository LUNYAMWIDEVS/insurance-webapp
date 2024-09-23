import graphene
from django_filters import OrderingFilter
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType
from ..history.views import get_history
from .models import ContactManager, Message, WhatsappMessages
from ..client.object_types import IndividualClientType, CorporateClientType


class ContactPersonType(DjangoObjectType):
    """
    Create a GraphQL type for the user model
    """
    description = " Type definition for a single user "
    order_by = OrderingFilter(fields=(
        ('name'),
    ))
    gender = graphene.String()
    status = graphene.String()
    history = graphene.List(GenericScalar)
    individual_clients = graphene.List(IndividualClientType)
    corporate_clients = graphene.List(CorporateClientType)

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = ContactManager

    def resolve_gender(self, *args):
        return self.get_gender_display()

    def resolve_status(self, *args):
        return self.get_status_display()

    def resolve_history(self, info):
        return get_history(self)

    def resolve_individual_clients(self, info):
        return self.individualclient_set.all()

    def resolve_corporate_clients(self, info):
        return self.corporateclient_set.all()


class MessageType(DjangoObjectType):
    """
    Create a GraphQL type for the user model
    """
    option = graphene.String()
    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = Message

    def resolve_option(self, *args):

        return self.get_option_display()

    def resolve_history(self, info):
        return get_history(self)


class WhatsappMessageType(DjangoObjectType):
    """
    Create a GraphQL type for the user model
    """
    option = graphene.String()
    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = WhatsappMessages

    def resolve_option(self, *args):

        return self.get_option_display()

    def resolve_history(self, info):
        return get_history(self)


class SalesAgentType(DjangoObjectType):
    """
    Create a GraphQL type for the user model
    """
    option = graphene.String()
    history = graphene.List(GenericScalar)

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = WhatsappMessages

    def resolve_option(self, *args):

        return self.get_option_display()

    def resolve_history(self, info):
        return get_history(self)


class MessageInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    individual_clients = graphene.List(graphene.String)
    contact_persons = graphene.List(graphene.String)
    corporate_clients = graphene.List(graphene.String)
    email_subject = graphene.String()
    email_body = graphene.String()
    sms = graphene.String()
    message_option = graphene.String()


class WhatsappMessageInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    individual_clients = graphene.List(graphene.String)
    contact_persons = graphene.List(graphene.String)
    corporate_clients = graphene.List(graphene.String)
    whatsapp_sms = graphene.String()
    message_option = graphene.String()


class ContactPersonInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    name = graphene.String()
    email = graphene.String()
    position = graphene.String()
    gender = graphene.String()
    phone_number = graphene.String()
    individual_clients = graphene.List(graphene.String)
    corporate_clients = graphene.List(graphene.String)
    service_line = graphene.String()
    date_of_birth = graphene.Date()
    facebook_account = graphene.String()
    twitter_account = graphene.String()
    instagram_account = graphene.String()
    linkedin_account = graphene.String()


# Now we create a corresponding PaginatedType for that object type:
class ContactPersonPaginatedType(graphene.ObjectType):
    """
    User pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(ContactPersonType)


class MessagesPaginatedType(graphene.ObjectType):
    """
    Messages pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(MessageType)


class WhatsAppType(DjangoObjectType):
    """
    Create a GraphQL type for the whatsapp model
    """
    option = graphene.String()

    class Meta:
        '''Defines the fields to be serialized in the whatsapp model'''
        model = WhatsappMessages

    def resolve_option(self, *args):

        return self.get_option_display()


class WhatsAppInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    whatsapp_response = graphene.String()
    whatsapp_message_id = graphene.String()
    option = graphene.String()


class SalesAgentInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    sales_agent_assigned = graphene.String()
    whatsapp_phone_number = graphene.String()
    message_option = graphene.String()


class WhatsAppPaginatedType(graphene.ObjectType):
    """
    Messages pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(WhatsAppType)
