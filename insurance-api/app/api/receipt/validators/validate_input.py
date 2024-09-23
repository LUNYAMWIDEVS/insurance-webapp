
# Local imports
from graphql import GraphQLError

from ...helpers.constants import RECEIPT_REQUIRED_FIELD
from ...helpers.validate_input import check_empty_fields, check_missing_fields
from ...helpers.validate_object_id import validate_object_id
from ...helpers.validation_errors import error_dict
from ..models import MotorPolicy, MotorPolicyReceipt


class ReceiptValidations:
    '''Validations for the receipt information'''

    def validate_create_receipt_data(self, kwargs):
        '''
        Runs all the individual receipt registration data validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        '''
        check_missing_fields(kwargs, RECEIPT_REQUIRED_FIELD)

        input_data = {}
        input_data['transaction_date'] = kwargs.get('transaction_date', None)
        input_data['amount_figures'] = kwargs.get('amount_figures', None)
        input_data['amount_words'] = kwargs.get('amount_words', None)
        input_data['payment_mode'] = kwargs.get('payment_mode', None)
        input_data['policy'] = kwargs.get('policy_number', None)
        check_empty_fields(data=input_data)
        input_data['agency'] = kwargs.get('agency', None)
        self.validate_choice_fields(input_data['payment_mode'],
                                    dict(MotorPolicyReceipt.PaymentOptions.choices),
                                    'payment mode',)
        input_data['policy'] = validate_object_id(
            input_data['policy'], MotorPolicy, "Policy", input_data['agency'])
        return input_data

    def validate_receipt_update_data(self, data, receipt_id, agency, model):
        '''
        Runs all  user update data validations in one function
        Args:
            data (dict): request data
            receipt_id (str): receipt id
            agency (obj): manager
            model (obj): policy model
        Returns:
            input_data (dict): validated data
        '''
        input_data = {}
        input_data['receipt_number'] = data.get('receipt_number', None)
        input_data['date'] = data.get('date', None)
        input_data['transaction_date'] = data.get('transaction_date', None)
        input_data['amount_figures'] = data.get('amount_figures', None)
        input_data['amount_words'] = data.get('amount_words', None)
        input_data['payment_mode'] = data.get('payment_mode', None)
        input_data['policy_id'] = data.get('policy_number', None)
        check_empty_fields(data=input_data)

        input_data = {k: v for k, v in input_data.items() if v}
        VAL_MAP = {
            "policy_id": {
                'method': validate_object_id,
                'params': [input_data.get('policy_id', ''),
                           model, "Policy", agency]},
            "payment_mode": {
                "method": self.validate_choice_fields,
                'params': [input_data.get('payment_mode', ''),
                           dict(MotorPolicyReceipt.PaymentOptions.choices),
                           'payment mode']},
            "receipt_number": {
                "method": self.validate_update_receipt_number_already_exist,
                'params': [input_data.get('receipt_number', ''),
                           receipt_id, agency, model]},
        }
        for item in input_data:
            validate = VAL_MAP.get(item)
            if validate:
                validate['method'](*validate['params'])

        input_data = {k: v for k, v in input_data.items() if v}

        return input_data

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

    @classmethod
    def validate_policy_number(cls, policy_number, agency, model):
        '''
        Checks if user belongs to that agency
         Args:
            policy_number (str): user policy_number
            agency (obj): agency object
        Raise:
            raise GraphQLError if user does not exist
        '''
        policy = model.objects.all_with_deleted().filter(
            policy__id=policy_number, agency=agency)
        if policy.exists():
            raise GraphQLError(error_dict['does_not_exist'].format('Policy Number'))
        return policy.order_by('-created_at').first()

    @classmethod
    def validate_update_receipt_number_already_exist(cls, receipt_number,
                                                     id, agency, model):
        '''
        Checks if receipt_number already exists in the db
         Args:
            receipt_number (str): user receipt_number
            id (str): user id
            agency (obj): agency object
            model (obj): model object
        Raise:
            raise GraphQLError if receipt_number already exist
        '''
        if receipt_number:
            receipt_number_existing = model.objects.filter(
                receipt_number__iexact=receipt_number, agency=agency).first()

            if receipt_number_existing and receipt_number_existing.id != id:
                raise GraphQLError(error_dict['already_exist'].format('Receipt Number'))

    @classmethod
    def validate_receipt_number_already_exist(cls, receipt_number, agency, model):
        '''
        Checks if receipt_number already exists in the db
         Args:
            receipt_number (str): user receipt_number
            agency (obj): admin agency
        Raise:
            raise GraphQLError if receipt_number already exist
        '''
        if model.objects.filter(
                receipt_number__iexact=receipt_number, agency=agency).exists():
            raise GraphQLError(
                error_dict['already_exist'].format('Receipt Number'))
