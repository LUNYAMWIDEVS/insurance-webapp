# Third party imports
from app.api.client.models import CorporateClient, IndividualClient
import re

# Local imports
from django.core.exceptions import ObjectDoesNotExist
from graphql import GraphQLError

from ...helpers.constants import (CONTACT_PERSON_REQUIRED_FIELD,
                                  GENDER_OPTIONS,
                                  SEND_MESSAGE_REQUIRED_FIELD)
from ...helpers.validate_input import (check_email_validity,
                                       check_empty_fields,
                                       check_missing_fields)
from ...helpers.validation_errors import error_dict
from ...helpers.validate_object_id import validate_object_id
from ..models import ContactManager, Message, WhatsappMessages


class ContactPersonValidations:
    '''Validations for theclient information'''

    def validate_individual_contact_person_registration_data(self, kwargs):
        '''
        Runs all the individual client registration data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        check_missing_fields(kwargs, CONTACT_PERSON_REQUIRED_FIELD)

        input_data = {}
        input_data['name'] = kwargs.get('name', None)
        input_data['email'] = kwargs.get('email', None)
        input_data['position'] = kwargs.get('position', None)
        input_data['phone_number'] = kwargs.get('phone_number', None)
        input_data['gender'] = kwargs.get('gender', None)
        input_data['service_line'] = kwargs.get('service_line', None)
        check_empty_fields(data=input_data)
        input_data['individual_clients'] = kwargs.get('individual_clients', [])
        input_data['corporate_clients'] = kwargs.get('corporate_clients', [])
        input_data['date_of_birth'] = kwargs.get('date_of_birth', None)
        input_data['facebook_account'] = kwargs.get('facebook_account', None)
        input_data['twitter_account'] = kwargs.get('twitter_account', None)
        input_data['instagram_account'] = kwargs.get('instagram_account', None)
        input_data['linkedin_account'] = kwargs.get('linkedin_account', None)
        input_data['agency'] = kwargs.get('agency', None)
        check_email_validity(input_data['email'])
        if input_data['individual_clients'] is None:
            input_data['individual_clients'] = []
        input_data['individual_clients'] = [validate_object_id(
            user, IndividualClient,
            "Individual Client", input_data['agency']) for user
            in input_data['individual_clients']]
        if input_data['corporate_clients'] is None:
            input_data['corporate_clients'] = []
        input_data['corporate_clients'] = [validate_object_id(
            user, CorporateClient,
            "Corporate Client", input_data['agency']) for user
            in input_data['corporate_clients']]
        self.validate_options(input_data['gender'], GENDER_OPTIONS)
        self.validate_email_already_exist(input_data['email'], input_data['agency'])
        self.validate_phone_number(input_data['phone_number'], input_data['agency'])
        return input_data

    def validate_contact_person_update_data(self, data, contact_person_id, user):
        '''
        Runs all  user update data validations in one function
        Args:
            data (dict): request data
            client_id (str): client id
            user (obj): manager
        Returns:
            input_data (dict): validated data
        '''
        self.validate_client_id(contact_person_id, user.agency)
        data_ = check_empty_fields(data)

        self.validate_update_email_already_exist(
            data_.get('email', ''), contact_person_id, user.agency)
        self.validate_update_phone_number_already_exist(data_.get('phone_number', ''),
                                                        contact_person_id, user.agency)
        if data_.get('gender', ''):
            self.validate_options(data_.get('gender', ''), GENDER_OPTIONS)

        if data_.get('individual_clients') is None:
            data_['individual_clients'] = []
        _ = [validate_object_id(
            u, IndividualClient,
            "Individual Client", user.agency) for u
            in data_['individual_clients']]

        if data_.get('corporate_clients') is None:
            data_['corporate_clients'] = []
        _ = [validate_object_id(
            u, CorporateClient,
            "Corporate Client", user.agency) for u
            in data_['corporate_clients']]
        return data_

    def validate_send_message_data(self, kwargs):
        '''
        Runs all the send message data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        check_missing_fields(kwargs, SEND_MESSAGE_REQUIRED_FIELD)
        MESSAGE_OPTIONS = dict(Message.MessageOptions.choices)
        input_data = {}
        input_data['option'] = kwargs.get('message_option', None)
        check_empty_fields(data=input_data)
        input_data['individual_clients'] = kwargs.get('individual_clients', [])
        input_data['corporate_clients'] = kwargs.get('corporate_clients', [])
        input_data['contact_persons'] = kwargs.get('contact_persons', [])
        input_data['agency'] = kwargs.get('agency', None)
        input_data['email_body'] = kwargs.get('email_body', "")
        input_data['email_subject'] = kwargs.get('email_subject', "")
        input_data['sms'] = kwargs.get('sms', "")
        self.validate_options(input_data['option'],
                              MESSAGE_OPTIONS, message="message")
        self.validate_clients_contact_persons(input_data)
        self.validate_email_sms(input_data)
        _ = [validate_object_id(
            user, IndividualClient,
            "Individual Client", input_data['agency']) for user
            in input_data['individual_clients']
            if input_data['individual_clients']]
        _ = [validate_object_id(
            user, CorporateClient,
            "Corporate Client", input_data['agency']) for user
            in input_data['corporate_clients']
            if input_data['corporate_clients']]
        _ = [validate_object_id(
            user, ContactManager,
            "Contact Person", input_data['agency']) for user in
            input_data['contact_persons']
            if input_data['contact_persons']]
        return input_data

    def validate_send_whatsapp_message_data(self, kwargs):
        '''
        Runs all the send message data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        MESSAGE_OPTIONS = dict(WhatsappMessages.MessageOptions.choices)
        input_data = {}
        input_data['option'] = kwargs.get('message_option', None)
        check_empty_fields(data=input_data)
        input_data['individual_clients'] = kwargs.get('individual_clients', [])
        input_data['corporate_clients'] = kwargs.get('corporate_clients', [])
        agency = kwargs.get('agency', None)
        input_data['whatsapp_sms'] = kwargs.get('whatsapp_sms', "")
        self.validate_options(input_data['option'],
                              MESSAGE_OPTIONS, message="message")
        if input_data['individual_clients'] is not None:
            _ = [validate_object_id(
                user, IndividualClient,
                "Individual Client", agency) for user
                in input_data['individual_clients']
                if input_data['individual_clients']]
        if input_data['corporate_clients'] is not None:
            _ = [validate_object_id(
                user, CorporateClient,
                "Corporate Client", agency) for user
                in input_data['corporate_clients']
                if input_data['corporate_clients']]
        return input_data

    def validate_clients_contact_persons(self, data):
        '''
        Checks if the clients or contact persons is present
        Args:
            data (dict): input data
        Raise:
            raise GraphQLError if contact persons or client is missing
        '''
        data_ = {}
        data_['individual_clients'] = data['individual_clients']
        data_['corporate_clients'] = data['corporate_clients']
        data_['contact_persons'] = data['contact_persons']
        option = data['option']
        empty = 0
        for k, v in data_.items():
            if not(v):
                empty += 1

        if empty > 1 and option.upper() not in ["S", "M", "A", "AC", "AI", "ACP"]:
            raise GraphQLError(error_dict['clients_contact_ppl'])

    def validate_email_sms(self, data):
        '''
        Checks if the email or sms has at least 3 characters
        Args:
            data (dict): input data
        Raise:
            raise GraphQLError if email or sms is too short or missing
        '''
        data_ = {}
        data_['sms'] = data['sms']
        data_['email_subject'] = data['email_subject']
        empty = 0
        for k, v in data_.items():
            if v and len(v) <= 2:
                raise GraphQLError(error_dict['min_length'].format(k, 3))
            if not(v):
                empty += 1
        if empty > 1:
            raise GraphQLError(error_dict['email_text_missing'])

    def validate_names_length(self, names):
        '''
        Checks if the names has at least 3 characters
        Args:
            names (list): user names
        Raise:
            raise GraphQLError if name is too short
        '''
        for name in names:
            if len(name) <= 2:
                raise GraphQLError(error_dict['min_length'].format('Name', 3))

    def validate_options(self, value, options, message="gender"):
        '''
        Checks if the option value is valid
        Args:
            value (str): option value
            options (list): options to validate
            message (str): message
        Raise:
            raise GraphQLError if option value is invalid
        '''
        if value.upper() not in [*options]:
            raise GraphQLError(
                error_dict['valid_options'].format(message, [*options]))

    def validate_item_regex(self, item, regex, message):
        '''
        Checks if the item is valid based on the regex
        Args:
            item (str): item to validate
            regex (str): regex to validate
            message (str): validation error message
        Raise:
            raise GraphQLError if items invalid
        '''
        if not re.match(r'{}'.format(regex), item):
            raise GraphQLError(message)

    @classmethod
    def validate_client_id(cls, id, agency):
        '''
        Checks if user belongs to that agency
         Args:
            id (str): user id
            agency (obj): agency object
        Raise:
            raise GraphQLError if user does not exist
        '''
        user = ContactManager.objects.all_with_deleted().filter(
            id=id, agency=agency).first()

        if not user:
            raise GraphQLError(error_dict['does_not_exist'].format('Client ID'))

    @classmethod
    def validate_update_email_already_exist(cls, email, id, agency):
        '''
        Checks if email already exists in the db
         Args:
            email (str): user email
            id (str): user id
            agency (obj): agency object
        Raise:
            raise GraphQLError if email already exist
        '''
        if email:
            check_email_validity(email)

            email_existing = ContactManager.objects.all_with_deleted().filter(
                email=email, agency=agency).first()

            if email_existing and email_existing.id != id:
                raise GraphQLError(error_dict['already_exist'].format('Client email'))

    @classmethod
    def validate_update_phone_number_already_exist(cls, phone_number, id, agency):
        '''
        Checks if phone number already exists in the db
         Args:
            phone number (str): user phone number
            id (str): user id
            agency (obj): agency object
        Raise:
            raise GraphQLError if phone number already exist
        '''
        if phone_number:
            if not re.match(r'^(?:\B\+ ?254|\b0)', phone_number):
                raise GraphQLError(error_dict['invalid_phone_no'])
            if not re.match(r"(\+254)?\s*?(\d{3})\s*?(\d{3})\s*?(\d{3})", phone_number):
                raise GraphQLError(
                    error_dict['invalid_input'].format("phone number"))
            client = ContactManager.objects.all_with_deleted().filter(
                phone_number=phone_number, agency=agency).first()
            if client and client.id != id:
                raise GraphQLError(
                    error_dict['already_exist'].format('Phone number'))

    @classmethod
    def validate_email_already_exist(cls, email, agency):
        '''
        Checks if email already exists in the db
         Args:
            email (str): user email
            agency (obj): admin agency
        Raise:
            raise GraphQLError if email already exist
        '''
        try:
            email_existing = ContactManager.objects.all_with_deleted().get(
                email=email, agency=agency)
        except ObjectDoesNotExist:
            email_existing = None

        if email_existing:
            raise GraphQLError(
                error_dict['already_exist'].format('Contact person email'))

    @classmethod
    def validate_phone_number(cls, phone_number, agency):
        '''
        Validates a given phone_number
        Args:
            password (str): phone_number
            agency (obj): admin agency
        Raise:
            raise GraphQLError if phone number is ivalid or exists
        '''
        if not re.match(r'^(?:\B\+ ?254|\b0)', phone_number):
            raise GraphQLError(error_dict['invalid_phone_no'])
        if not re.match(r"(\+254)?\s*?(\d{3})\s*?(\d{3})\s*?(\d{3})", phone_number):
            raise GraphQLError(
                error_dict['invalid_input'].format("phone number"))
        if ContactManager.objects.all_with_deleted().filter(phone_number=phone_number,
                                                            agency=agency).exists():
            raise GraphQLError(
                error_dict['already_exist'].format('Phone number'))
