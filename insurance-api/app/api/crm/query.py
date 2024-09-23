import graphene
from django.db.models import Q
from graphene.types.generic import GenericScalar
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required

from ..helpers.pagination_helper import pagination_helper
from ..helpers.permission_required import role_required, token_required
from ..helpers.validate_object_id import validate_object_id
from ..helpers.validation_errors import error_dict
from .helpers.user_helpers import get_default_message_options
from .models import ContactManager, Message, WhatsappMessages
from .object_types import (ContactPersonPaginatedType, ContactPersonType,
                           WhatsAppPaginatedType, MessagesPaginatedType, MessageType)


class Query(ObjectType):
    message_options = GenericScalar()
    contact_person = graphene.Field(ContactPersonType, id=graphene.String())
    whatsapp_messages = graphene.Field(WhatsAppPaginatedType,
                                       whatsapp_phone_number=graphene.String(),
                                       page=graphene.Int(),
                                       limit=graphene.Int())
    message = graphene.Field(MessageType, id=graphene.String())
    contact_persons = graphene.Field(ContactPersonPaginatedType,
                                     search=graphene.String(),
                                     page=graphene.Int(),
                                     limit=graphene.Int(),
                                     )
    messages = graphene.Field(MessagesPaginatedType,
                              search=graphene.String(),
                              page=graphene.Int(),
                              limit=graphene.Int(),
                              )

    @token_required
    @login_required
    def resolve_message_options(self, info, **kwargs):
        return get_default_message_options()

    @token_required
    @login_required
    def resolve_contact_person(self, info, **kwargs):
        error_msg = error_dict['permission_denied'].format("view", 'contact person')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        return validate_object_id(id, ContactManager, "Message", info.context.user.agency)

    @token_required
    @login_required
    def resolve_message(self, info, **kwargs):
        error_msg = error_dict['permission_denied'].format("view", 'message')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        return validate_object_id(id, Message, "Message", info.context.user.agency)

    @token_required
    @login_required
    def resolve_contact_persons(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        error_msg = error_dict['admin_only'].format('list contact persons')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        if search:
            filter = (
                Q(name__icontains=search) |
                Q(position__icontains=search) |
                Q(phone_number__icontains=search) |
                Q(email__icontains=search) |
                Q(phone_number__icontains=search)
            )
            contact_persons = ContactManager.objects.filter(
                filter, agency=info.context.user.agency).all()
        else:
            contact_persons = ContactManager.objects.filter(
                agency=info.context.user.agency).all()

        contact_persons = contact_persons.order_by('name')
        return pagination_helper(contact_persons, page, limit, ContactPersonPaginatedType)

    def resolve_messages(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        error_msg = error_dict['admin_only'].format('list messages')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        if search:
            filter = (
                Q(sms__icontains=search) |
                Q(email_body__icontains=search) |
                Q(email_subject__icontains=search)
            )
            messages = Message.objects.filter(
                filter, agency=info.context.user.agency).all()
        else:
            messages = Message.objects.filter(
                agency=info.context.user.agency).all()

        messages = messages.order_by('-created_at')
        return pagination_helper(messages, page, limit, MessagesPaginatedType)

    @token_required
    @login_required
    def resolve_whatsapp_messages(self, info, **kwargs):
        error_msg = error_dict['permission_denied'].format("view", 'message')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        page = 1
        limit = 1000
        whatsapp_phone_number = kwargs.get('whatsapp_phone_number', "")
        if whatsapp_phone_number:
            filter = (
                Q(whatsapp_phone_number__iexact=whatsapp_phone_number)
            )
            messages = WhatsappMessages.objects.filter(filter).order_by('created_at')
        else:
            messages = WhatsappMessages.objects.all().order_by(
                'whatsapp_phone_number', '-created_at').distinct('whatsapp_phone_number')
        return pagination_helper(messages, page, limit, WhatsAppPaginatedType)
