# Third party imports
from graphql import GraphQLError

from app.api.helpers.constants import (FIRE_DETAILS_REQUIRED_FIELD,
                                       FIRE_POLICY_REQUIRED_FIELD)
from app.api.helpers.validate_input import (check_empty_fields,
                                            check_missing_fields,)
from app.api.helpers.validation_errors import error_dict
from ..models import PoliticalViolence
from app.api.helpers.validate_object_id import validate_object_id
from app.api.insurancecompany.models import InsuranceCompany
from app.api.client.models import IndividualClient,CorporateClient


class PoliticalViolenceValidations:
    '''Validations for the political_violence policy'''

    def validate_political_violence_data(self, kwargs, agency):
        '''
        Runs all the political_violence policy data validations in one function
        Args:
            kwargs (dict): request data
            agency (obj): agency object
        Returns:
            input_data (dict): validated data
        '''
        # check_missing_fields(kwargs, FIRE_POLICY_REQUIRED_FIELD)

        input_data = {}
        input_data['policy_no'] = kwargs.get('policy_no', None)
        input_data['transaction_date'] = kwargs.get('transaction_date', None)
        input_data['start_date'] = kwargs.get('start_date', None)
        input_data['end_date'] = kwargs.get('end_date', None)
        input_data['commission_rate'] = kwargs.get('commission_rate', None)
        input_data['transaction_type'] = kwargs.get('transaction_type', None)
        input_data['premium_type'] = kwargs.get('premium_type', None)
        input_data['insurance_company'] = kwargs.get('insurance_company', None)
        input_data['political_violence_properties'] = kwargs.get('political_violence_properties', None)
        check_empty_fields(data=input_data)
        input_data['individual_client'] = kwargs.get('individual_client', None)
        input_data['corporate_client'] = kwargs.get('corporate_client', None)
        check_missing_fields(input_data['political_violence_properties'],
                             FIRE_DETAILS_REQUIRED_FIELD)
        _ = [check_empty_fields(item) for item in input_data['political_violence_properties']]

        self.validate_policy_no(input_data['policy_no'], agency)
        self.validate_choice_fields(input_data['transaction_type'],
                                    dict(PoliticalViolence.TransactionType.choices),
                                    'transaction type')
        self.validate_choice_fields(input_data['premium_type'],
                                    dict(PoliticalViolence.PremiumType.choices),
                                    'premium type')
        input_data['agency'] = agency
        input_data['insurance_company'] = validate_object_id(
            input_data['insurance_company'], InsuranceCompany, "Insurance Company")

        if input_data['individual_client']:
            input_data['individual_client'] = validate_object_id(
                input_data['individual_client'], IndividualClient,
                "Individual Client", agency)
        
        if input_data['corporate_client']:
            input_data['corporate_client'] = validate_object_id(
                input_data['corporate_client'], CorporateClient,
                "Corporate Client", agency)

        return input_data

    def validate_package_details_update(self, kwargs):
        '''
        Runs all the political_violence policy details data update validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        input_data = {}
        input_data['name'] = kwargs.get('name', None)
        input_data['description'] = kwargs.get('description', None)
        input_data['value'] = kwargs.get('value', None)

        input_data = {k: v for k, v in input_data.items() if v}
        return input_data

    def validate_political_violence_data_update(self, kwargs, agency):
        '''
        Runs all the political_violence policy data update validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        input_data = {}
        input_data['policy_no'] = kwargs.get('policy_no', None)
        input_data['transaction_date'] = kwargs.get('transaction_date', None)
        input_data['start_date'] = kwargs.get('start_date', None)
        input_data['end_date'] = kwargs.get('end_date', None)
        input_data['commission_rate'] = kwargs.get('commission_rate', None)
        input_data['specialty_class'] = kwargs.get('specialty_class', None)
        input_data['transaction_type'] = kwargs.get('transaction_type', None)
        input_data['premium_type'] = kwargs.get('premium_type', None)
        input_data['insurance_company'] = kwargs.get('insurance_company', None)

        input_data = {k: v for k, v in input_data.items() if v}
        VAL_MAP = {
            "policy_no": {
                'method': self.validate_policy_no,
                'params': [input_data.get('policy_no', ''), agency]},
            "debit_note_no": {
                "method": self.validate_debit_note_no,
                'params': [input_data.get('debit_note_no', ''), agency]},
            "transaction_type": {
                "method": self.validate_choice_fields,
                'params': [input_data.get('transaction_type', ''),
                           dict(PoliticalViolence.TransactionType.choices),
                           'transaction type']},
            "premium_type": {
                "method": self.validate_choice_fields,
                'params': [input_data.get('premium_type', ''),
                           dict(PoliticalViolence.PremiumType.choices),
                           'premium type']},
            "insurance_company": {
                "method": validate_object_id,
                'params': [input_data.get('insurance_company', ''),
                           InsuranceCompany, "Insurance Company"]},
            "individual_client": {
                "method": validate_object_id,
                'params': [input_data.get('individual_client', ''),
                           IndividualClient, "Individual Client", agency]},
        }
        for item in input_data:
            validate = VAL_MAP.get(item, "")
            if validate:
                validate['method'](*validate['params'])
        input_data = {k: v for k, v in input_data.items() if v}

        return input_data

    def validate_debit_note_no(self, debit_note_no, agency):
        '''
        Checks if the registration no already exist
        Args:
            debit_note_no (str): registration no
            agency (obj): insurance agency
        Raise:
            raise GraphQLError if registration no already exist
        '''
        if PoliticalViolence.objects.all_with_deleted().filter(
                debit_note_no=debit_note_no, agency=agency).exists():
            raise GraphQLError(error_dict['already_exist'].format(
                'political_violence policy debit note number'))

    def validate_policy_no(self, policy_no, agency):
        '''
        Checks if the registration no already exist
        Args:
            policy_no (str): registration no
            agency (obj): insurance agency
        Raise:
            raise GraphQLError if registration no already exist
        '''
        if PoliticalViolence.objects.all_with_deleted().filter(
                policy_no=policy_no, agency=agency).exists():
            raise GraphQLError(error_dict['already_exist'].format(
                'political_violence policynumber'))

    def validate_choice_fields(self, input_, choices, field):
        '''
        Checks if the registration no already exist
        Args:
            input_ (str): registration no
            field (str): field being validated
            required (dict): required
        Raise:
            raise GraphQLError if input not in choices
        '''
        if input_ not in choices:
            raise GraphQLError(error_dict['valid_options'].format(
                field, [*choices]))
