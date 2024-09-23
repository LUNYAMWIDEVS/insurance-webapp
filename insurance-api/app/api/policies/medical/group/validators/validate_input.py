# Third party imports
from graphql import GraphQLError

from app.api.helpers.constants import (GROUP_MEDICAL_REQUIRED_FIELD)
from app.api.helpers.validate_input import (check_empty_fields,
                                            check_missing_fields,)
from app.api.helpers.validation_errors import error_dict
from ..models import GroupMedicalIns
from app.api.helpers.validate_object_id import validate_object_id
from app.api.insurancecompany.models import InsuranceCompany


class GroupMedicalInsValidations:
    '''Validations for the group medical'''

    def validate_group_medical_policy_data(self, kwargs, agency):
        '''
        Runs all the group medical data validations in one function
        Args:
            kwargs (dict): request data
            agency (obj): agency object
        Returns:
            input_data (dict): validated data
        '''
        MEDICAL_INS_REQUIRED = ['first_name', 'last_name', 'age']
        check_missing_fields(kwargs, GROUP_MEDICAL_REQUIRED_FIELD)

        input_data = {}
        input_data['debit_note_no'] = kwargs.get('debit_note_no', None)
        input_data['policy_no'] = kwargs.get('policy_no', None)
        input_data['transaction_date'] = kwargs.get('transaction_date', None)
        input_data['start_date'] = kwargs.get('start_date', None)
        input_data['end_date'] = kwargs.get('end_date', None)
        input_data['commission_rate'] = kwargs.get('commission_rate', None)
        input_data['transaction_type'] = kwargs.get('transaction_type', None)
        input_data['medical_insurances'] = kwargs.get('medical_insurances', None)
        input_data['inpatient_limit'] = kwargs.get('inpatient_limit', None)
        input_data['outpatient_limit'] = kwargs.get('outpatient_limit', None)
        input_data['principal_members'] = kwargs.get('principal_members', None)
        input_data['premium_type'] = kwargs.get('premium_type', None)
        input_data['insurance_company'] = kwargs.get('insurance_company', None)
        check_empty_fields(data=input_data)
        for ins in input_data['medical_insurances']:
            check_missing_fields(ins, MEDICAL_INS_REQUIRED)
        self.validate_debit_note_no(input_data['debit_note_no'], agency)
        self.validate_policy_no(input_data['policy_no'], agency)
        self.validate_choice_fields(input_data['transaction_type'],
                                    dict(GroupMedicalIns.TransactionType.choices),
                                    'transaction type')
        self.validate_choice_fields(input_data['premium_type'],
                                    dict(GroupMedicalIns.PremiumType.choices),
                                    'premium type')
        input_data['agency'] = agency
        input_data['insurance_company'] = validate_object_id(
            input_data['insurance_company'], InsuranceCompany, "Insurance Company")

        return input_data

    def validate_group_medical_policy_data_update(self, kwargs, agency):
        '''
        Runs all the group medical data update validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        input_data = {}
        input_data['debit_note_no'] = kwargs.get('debit_note_no', None)
        input_data['policy_no'] = kwargs.get('policy_no', None)
        input_data['transaction_date'] = kwargs.get('transaction_date', None)
        input_data['start_date'] = kwargs.get('start_date', None)
        input_data['end_date'] = kwargs.get('end_date', None)
        input_data['commission_rate'] = kwargs.get('commission_rate', None)
        input_data['transaction_type'] = kwargs.get('transaction_type', None)
        input_data['medical_insurances'] = kwargs.get('medical_insurances', None)
        input_data['inpatient_limit'] = kwargs.get('inpatient_limit', None)
        input_data['outpatient_limit'] = kwargs.get('outpatient_limit', None)
        input_data['principal_members'] = kwargs.get('principal_members', None)
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
                           dict(GroupMedicalIns.TransactionType.choices),
                           'transaction type']},
            "premium_type": {
                "method": self.validate_choice_fields,
                'params': [input_data.get('premium_type', ''),
                           dict(GroupMedicalIns.PremiumType.choices),
                           'premium type']},
            "insurance_company": {
                "method": validate_object_id,
                'params': [input_data.get('insurance_company', ''),
                           InsuranceCompany, "Insurance Company"]}
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
        if GroupMedicalIns.objects.all_with_deleted().filter(
                debit_note_no=debit_note_no, agency=agency).exists():
            raise GraphQLError(error_dict['already_exist'].format(
                'group medical debit note number'))

    def validate_policy_no(self, policy_no, agency):
        '''
        Checks if the registration no already exist
        Args:
            policy_no (str): registration no
            agency (obj): insurance agency
        Raise:
            raise GraphQLError if registration no already exist
        '''
        if GroupMedicalIns.objects.all_with_deleted().filter(
                policy_no=policy_no, agency=agency).exists():
            raise GraphQLError(error_dict['already_exist'].format(
                'group medical policy number'))

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
