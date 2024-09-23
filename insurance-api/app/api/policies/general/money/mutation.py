import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import Money, Property
from .validators.validate_input import MoneyValidations
from .object_types import (MoneyType, MoneyInput,
                           MoneyPropertyType, MoneyPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateMoney(graphene.Mutation):
    '''Handle creation of a money policy and saving to the db'''
    # items that the mutation will return
    money = graphene.Field(MoneyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = MoneyInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a money policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = MoneyValidations()
        agency = info.context.user.agency
        data = validator.validate_money_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        money_properties = data.pop('money_properties', '')
        new_policy = Money(**data)
        new_policy.save()
        for item in money_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.money_properties.add(item_obj)
        return CreateMoney(
            status="Success", money=new_policy,
            message=SUCCESS_ACTION.format("money policycreated"))


class UpdateMoney(graphene.Mutation):
    '''Handle update of a money policy'''

    money = graphene.Field(MoneyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = MoneyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a money policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, Money, "money policy")
        validator = MoneyValidations()
        data = validator.validate_money_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        Money.objects.filter(id=id).update(**data)
        money = Money.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("money policyupdated")

        return UpdateMoney(status=status,
                                    money=money,
                                    message=message)


class UpdateMoneyProperty(graphene.Mutation):
    '''Handle update of a money policy details'''

    property = graphene.Field(MoneyPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = MoneyPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a money policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, Money, "money policy")
        validate_object_id(property_id, Property, "money policy property")
        validator = MoneyValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("money policy property updated")

        return UpdateMoneyProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteMoneyProperty(graphene.Mutation):
    '''Handle delete of a money policy details'''

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a money policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, Money, "money policy")
        property_ = validate_object_id(property_id, Property, "money policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("money policy property deleted")

        return UpdateMoneyProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_money = CreateMoney.Field()
    update_money = UpdateMoney.Field()
    update_money_property = UpdateMoneyProperty.Field()
    delete_money_property = DeleteMoneyProperty.Field()
