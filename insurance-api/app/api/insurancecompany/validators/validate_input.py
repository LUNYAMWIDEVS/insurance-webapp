# Third party imports
import re

from graphql import GraphQLError

from ...helpers.constants import INSURANCE_CO_REQUIRED_FIELD
from ...helpers.validate_input import (check_email_validity,
                                       check_empty_fields,
                                       check_missing_fields,
                                       validate_image_url)
from ...helpers.validation_errors import error_dict
from ..models import InsuranceCompany


class InsuranceCompanyValidations:
    '''Validations for the insurance company'''

    def validate_insurance_company_data(self, kwargs):
        '''
        Runs all the insurance company data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        check_missing_fields(kwargs, INSURANCE_CO_REQUIRED_FIELD)

        input_data = {}
        input_data['name'] = kwargs.get('name', None)
        input_data['email'] = kwargs.get('email', None)
        input_data['contact_person'] = kwargs.get('contact_person', None)
        input_data['postal_address'] = kwargs.get('postal_address', None)
        input_data['mobile_number'] = kwargs.get('mobile_number', [])
        input_data['image_url'] = kwargs.get('image_url', None)
        input_data['physical_address'] = kwargs.get('physicalAddress', None)
        
        check_empty_fields(data=input_data)
        input_data['telephone_number'] = [
            n.replace(" ", "").replace(
                "-", "") for n in kwargs.get('telephone_number', [])]
        self.validate_name(input_data['name'])
        check_email_validity(input_data['email'])
        input_data['mobile_number'] = self.validate_phone_number(
            input_data['mobile_number'])
        validate_image_url(input_data['image_url'])
        return input_data

    def validate_insurance_company_data_update(self, kwargs):
        '''
        Runs all the insurance company data update validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''

        check_empty_fields(data=kwargs)
        input_data = {}
        input_data['name'] = kwargs.get('name', None)
        input_data['email'] = kwargs.get('email', None)
        input_data['mobile_number'] = kwargs.get('mobile_number', [])

        input_data['image_url'] = kwargs.get('image_url', None)
        contact_person = kwargs.pop("contact_person", None)
        postal_address = kwargs.pop("postal_address", None)
        physical_address = kwargs.pop("physicalAddress", None)
        telephone_number = kwargs.pop("telephone_number", [])
        input_data = {k: v for k, v in input_data.items() if v}
        validation_mapper = {
            "name": self.validate_name,
            "email": check_email_validity,
            "image_url": validate_image_url,
        }
        _ = {validation_mapper.get(k)(v) for k, v in input_data.items() if k not in [
            'telephone_number', 'mobile_number']}
        if telephone_number:
            input_data['telephone_number'] = [
                n.replace(" ", "").replace("-", "") for n in telephone_number]
        if input_data.get('mobile_number', None):
            input_data['mobile_number'] = self.validate_phone_number(
                input_data['mobile_number'])
        if contact_person:
            input_data.update({"contact_person": contact_person})
        if postal_address:
            input_data.update({"postal_address": postal_address})
        if physical_address:
            input_data.update({"physical_address": physical_address})
        return input_data

    def validate_name(self, name):
        '''
        Checks if the name already exist
        Args:
            name (str): name
        Raise:
            raise GraphQLError if name already exist
        '''
        self.validate_name_length(name)

        if InsuranceCompany.objects.all_with_deleted().filter(name=name).exists():
            raise GraphQLError(error_dict['already_exist'].format(
                'Insurance company name'))

    def validate_postal_address(self, postal_address):
        '''
        Checks if the postal address already exist
        Args:
            postal_address (str): postal address
        Raise:
            raise GraphQLError if postal address already exist
        '''

        if InsuranceCompany.objects.all_with_deleted().filter(
                postal_address=postal_address).exists():
            raise GraphQLError(error_dict['already_exist'].format(
                'Postal address'))

    def validate_name_length(self, name):
        '''
        Checks if the name has at least 3 characters
        Args:
            name (str): user name
        Raise:
            raise GraphQLError if name is too short
        '''
        if len(name) <= 2:
            raise GraphQLError(error_dict['min_length'].format('Name', 3))

    @classmethod
    def validate_phone_number(cls, mobile_numbers):
        '''
        Validates a given mobile_number
        Args:
            mobile_numbers (list): mobile_numbers
        Raise:
            raise GraphQLError if phone number is ivalid or exists
        '''
        numbers = []
        for mobile_number in mobile_numbers:
            mobile_number = mobile_number.replace(" ", "").replace("-", '')
            if not re.match(r'^(?:\B\+ ?254|\b0)', mobile_number):
                raise GraphQLError(error_dict['invalid_phone_no'])
            if not re.match(r"(\+254)?\s*?(\d{3})\s*?(\d{3})\s*?(\d{3})", mobile_number):
                raise GraphQLError(
                    error_dict['invalid_input'].format("mobile number"))
            numbers.append(mobile_number)
        return numbers
