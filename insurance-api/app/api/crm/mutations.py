from app.api.client.models import CorporateClient, IndividualClient
import graphene
from graphql_extensions.auth.decorators import login_required
from ..helpers.validate_object_id import validate_object_id

from ..helpers.permission_required import role_required, token_required
from ..helpers.validation_errors import error_dict
from ..helpers.constants import SUCCESS_ACTION
from .models import ContactManager, Message, WhatsappMessages
from .helpers.message_helper import send_message
from .validators.validate_input import ContactPersonValidations
from .object_types import (ContactPersonType, ContactPersonInput,
                           MessageInput, MessageType, WhatsAppInput,
                           WhatsappMessageInput, WhatsappMessageType,
                           WhatsAppType, SalesAgentType, SalesAgentInput)
from copy import deepcopy
from .views import send_whatsapp_message, send_multi_whatsapp_message


class CreateContactPerson(graphene.Mutation):
    '''Handle creation of a user and saving to the db'''
    # items that the mutation will return
    contact_person = graphene.Field(ContactPersonType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the user creation'''
        input = ContactPersonInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for user creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format("create a contact person")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ContactPersonValidations()
        data_to_validate = kwargs.get("input", '')
        data_to_validate['agency'] = info.context.user.agency
        data = validator.validate_individual_contact_person_registration_data(
            data_to_validate)
        individual_clients = data.pop("individual_clients", [])
        corporate_clients = data.pop("corporate_clients", [])
        new_contact_person = ContactManager(**data)
        new_contact_person.status = 'A'
        new_contact_person.save()
        if individual_clients is not None:
            for client in individual_clients:
                new_contact_person.individualclient_set.add(client)
        if corporate_clients is not None:
            for client in corporate_clients:
                new_contact_person.corporateclient_set.add(client)
        return CreateContactPerson(status="Success", contact_person=new_contact_person,
                                   message=SUCCESS_ACTION.format(
                                       "Contact Person created"))


class SendWhatsappMessage(graphene.Mutation):
    '''Handle creation of a watsapp message and saving to the db'''
    # items that the mutation will return
    whatsapp_message = graphene.Field(WhatsAppType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the user creation'''
        input = WhatsAppInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for user creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format("create a contact person")
        role_required(info.context.user, ['admin', 'manager'], error_msg)

        input_data = kwargs.get("input", '')
        whatsapp_response = input_data.get("whatsapp_response", "")
        whatsapp_message_id = input_data.get("whatsapp_message_id", "")
        whatsapp_message = validate_object_id(
            whatsapp_message_id, WhatsappMessages, "Whatsapp Message")
        new_message = deepcopy(whatsapp_message)
        new_message.whatsapp_response = whatsapp_response
        new_message.created_at = None
        new_message.whatsapp_sms = None
        new_message.pk = None
        new_message.save()

        send_whatsapp_message(whatsapp_response, whatsapp_message.whatsapp_phone_number)
        new_message.previous_responses.add(whatsapp_message)
        return SendWhatsappMessage(status="Success", whatsapp_message=new_message,
                                   message=SUCCESS_ACTION.format(
                                       "Whatsapp Message"))


class UpdateContactPerson(graphene.Mutation):
    '''Handle update of a individual client details'''

    contact_person = graphene.Field(ContactPersonType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ContactPersonInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format("update contact person")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validator = ContactPersonValidations()
        data = validator.validate_contact_person_update_data(
            kwargs.get("input", ''), id,
            info.context.user)

        individual_clients = data.pop("individual_clients", [])
        corporate_clients = data.pop("corporate_clients", [])
        contact = ContactManager.objects.get(id=id)
        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `ContactManager` instance one at a time.
            setattr(contact, key, value)

        contact.save()

        for client in individual_clients:
            contact_ = IndividualClient.objects.get(id=client)
            contact.individualclient_set.add(contact_)
        for client in corporate_clients:
            contact_ = CorporateClient.objects.get(id=client)
            contact.corporateclient_set.add(contact_)
        status = "Success"
        message = SUCCESS_ACTION.format("Contact Person updated")

        return UpdateContactPerson(status=status, contact_person=contact,
                                   message=message)


class SendMessages(graphene.Mutation):
    '''Handle creation of a message and saving to the db'''
    # items that the mutation will return
    message = graphene.Field(MessageType)
    status = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the user creation'''
        input = MessageInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for message creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format("send messages")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ContactPersonValidations()
        data_to_validate = kwargs.get("input", '')
        data_to_validate['agency'] = info.context.user.agency
        data = validator.validate_send_message_data(
            data_to_validate)
        individual_clients = data.pop("individual_clients", [])
        corporate_clients = data.pop("corporate_clients", [])
        contact_persons = data.pop("contact_persons", [])
        option = data.pop("option", "")
        new_message = Message(**data)
        new_message.save()
        if option == 'A':
            clients_ = IndividualClient.objects.all()
            contact_persons_ = ContactManager.objects.all()
            corp_clients = CorporateClient.objects.all()
            new_message.individual_clients.add(*clients_)
            new_message.contact_persons.add(*contact_persons_)
            new_message.corporate_clients.add(*corp_clients)
            new_message.option = option
        elif option == 'AC':
            corp_clients = CorporateClient.objects.all()
            new_message.corporate_clients.add(*corp_clients)
            new_message.option = option
        elif option == 'AI':
            clients_ = IndividualClient.objects.all()
            new_message.individual_clients.add(*clients_)
            new_message.option = option
        elif option == 'ACP':
            contact_persons_ = ContactManager.objects.all()
            new_message.contact_persons.add(*contact_persons_)
            new_message.option = option
        else:
            for item in individual_clients:
                client = IndividualClient.objects.get(id=item)
                new_message.individual_clients.add(client)
            for item in corporate_clients:
                client = CorporateClient.objects.get(id=item)
                new_message.corporate_clients.add(client)
            for item in contact_persons:
                contact = ContactManager.objects.get(id=item)
                new_message.contact_persons.add(contact)
            total = individual_clients + corporate_clients + contact_persons
            if len(total) > 1:
                new_message.option = "M"
            else:
                new_message.option = "S"

        send_message(new_message)
        return SendMessages(status="Success", message=new_message)


class SendMultiWhatsAppMessages(graphene.Mutation):
    '''Handle creation of a message and saving to the db'''
    # items that the mutation will return
    message = graphene.Field(WhatsappMessageType)
    status = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the user creation'''
        input = WhatsappMessageInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for message creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format("send messages")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ContactPersonValidations()
        data_to_validate = kwargs.get("input", '')
        data_to_validate['agency'] = info.context.user.agency
        data = validator.validate_send_whatsapp_message_data(
            data_to_validate)
        individual_clients = data.pop("individual_clients", [])
        corporate_clients = data.pop("corporate_clients", [])
        contact_persons = data.pop("contact_persons", [])
        option = data.pop("option", "")
        new_message = WhatsappMessages(**data)
        new_message.save()
        if option == 'A':
            clients_ = IndividualClient.objects.all()
            corp_clients = CorporateClient.objects.all()
            new_message.individual_clients.add(*clients_)
            new_message.corporate_clients.add(*corp_clients)
            new_message.option = option
        elif option == 'AC':
            corp_clients = CorporateClient.objects.all()
            new_message.corporate_clients.add(*corp_clients)
            new_message.option = option
        elif option == 'AI':
            clients_ = IndividualClient.objects.all()
            new_message.individual_clients.add(*clients_)
            new_message.option = option
        else:
            for item in individual_clients:
                client = IndividualClient.objects.get(id=item)
                new_message.individual_clients.add(client)
            for item in corporate_clients:
                client = CorporateClient.objects.get(id=item)
                new_message.corporate_clients.add(client)
            for item in contact_persons:
                contact = ContactManager.objects.get(id=item)
                new_message.contact_persons.add(contact)
            total = individual_clients + corporate_clients + contact_persons
            if len(total) > 1:
                new_message.option = "M"
            else:
                new_message.option = "S"

        send_multi_whatsapp_message(new_message)
        return SendMultiWhatsAppMessages(status="Success", message=new_message)


class AssignSalesAgent(graphene.Mutation):
    '''Handle creation of a message and saving to the db'''
    # items that the mutation will return
    agent = graphene.Field(SalesAgentType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the user creation'''
        input = SalesAgentInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for user creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format("create a sales agent")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        input_data = kwargs.get("input", '')
        sales_agent = input_data.get("sales_agent_assigned", [])
        whatsapp_phone_number = input_data.get("whatsapp_phone_number", [])
        collect_individuals_messages = WhatsappMessages.objects.filter(
            whatsapp_phone_number=whatsapp_phone_number)
        for index in range(len(collect_individuals_messages)):
            collect_individuals_messages[index].sales_agent_assigned_id = sales_agent
            collect_individuals_messages[index].save()

        message = SUCCESS_ACTION.format("Sales Agent Assigned")
        return AssignSalesAgent(status="Success",
                                agent=collect_individuals_messages[len(
                                    collect_individuals_messages) - 1],
                                message=message)


class Mutation(graphene.ObjectType):
    create_contact_person = CreateContactPerson.Field()
    send_message = SendMessages.Field()
    update_contact_person = UpdateContactPerson.Field()
    send_whatsapp_message = SendWhatsappMessage.Field()
    send_multiple_whatsapp_messages = SendMultiWhatsAppMessages.Field()
    assign_sales_agent = AssignSalesAgent.Field()
