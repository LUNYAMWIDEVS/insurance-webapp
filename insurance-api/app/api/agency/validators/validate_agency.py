# Third party imports
from graphql import GraphQLError
from django.core.exceptions import ObjectDoesNotExist
# Local imports
from ...helpers.constants import AGENCY_REQUIRED_FIELD
from ...helpers.validation_errors import error_dict
from ..models import Agency
from ...helpers.validate_input import (check_email_validity,
                                       check_missing_fields,
                                       validate_phone_number,
                                       validate_image_url,
                                       check_empty_fields)


class AgencyValidations:
    '''Validations for the agency registration'''

    def validate_agency_registration_data(self, kwargs):
        '''
        Runs all the agency registration data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        check_missing_fields(kwargs, AGENCY_REQUIRED_FIELD)

        input_data = {}
        input_data['name'] = kwargs.get('name', None)
        input_data['office_location'] = kwargs.get('office_location', None)
        input_data['box_number'] = kwargs.get('box_number', None)
        input_data['postal_code'] = kwargs.get('postal_code', None)
        input_data['phone_number'] = kwargs.get('phone_number', None)
        input_data['agency_email'] = kwargs.get('agency_email', None)
        input_data['image_url'] = kwargs.get('image_url', None)
        check_empty_fields(input_data)
        check_email_validity(input_data['agency_email'])
        self.validate_agency_name(input_data['name'])
        self.validate_email_already_exist(input_data['agency_email'])
        validate_phone_number(input_data['phone_number'], Agency)
        validate_image_url(input_data['image_url'])
        return input_data
    

    def validate_agency_update_data(self, kwargs):
        '''
        Runs all the agency update data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        # Check that at least one field is provided
        if not kwargs:
            raise GraphQLError("No data provided for update")

        input_data = {}
        if 'name' in kwargs:
            input_data['name'] = kwargs['name']
            self.validate_agency_name(input_data['name'])

        if 'office_location' in kwargs:
            input_data['office_location'] = kwargs['office_location']

        if 'box_number' in kwargs:
            input_data['box_number'] = kwargs['box_number']

        if 'postal_code' in kwargs:
            input_data['postal_code'] = kwargs['postal_code']

        if 'phone_number' in kwargs:
            input_data['phone_number'] = kwargs['phone_number']
            validate_phone_number(input_data['phone_number'], Agency)

        if 'agency_email' in kwargs:
            input_data['agency_email'] = kwargs['agency_email']
            check_email_validity(input_data['agency_email'])
            self.validate_email_already_exist(input_data['agency_email'])

        if 'image_url' in kwargs:
            input_data['image_url'] = kwargs['image_url']
            validate_image_url(input_data['image_url'])

        # Ensure at least one field is being updated
        if not input_data:
            raise GraphQLError("No valid fields provided for update")

        return input_data

    def validate_agency_name(self, name):
        '''
        Checks if the name already exist
        Args:
            name (str): name
        Raise:
            raise GraphQLError if name already exist
        '''
        if Agency.objects.all_with_deleted().filter(name=name).exists():
            raise GraphQLError(error_dict['already_exist'].format('Agency name'))

    @classmethod
    def validate_email_already_exist(cls, email):
        '''
        Checks if email already exists in the db
         Args:
            email (str): user email
        Raise:
            raise GraphQLError if email already exist
        '''
        try:
            Agency.objects.all_with_deleted().get(agency_email=email)
            raise GraphQLError(error_dict['already_exist'].format('Agency email'))
        except ObjectDoesNotExist:
            pass
