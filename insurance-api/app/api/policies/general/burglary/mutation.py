import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import BurglaryPolicy, Property
from .validators.validate_input import BurglaryPolicyValidations
from .object_types import (BurglaryPolicyType, BurglaryPolicyInput,
                           BurglaryPropertyType, BurglaryPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateBurglaryPolicy(graphene.Mutation):
    '''Handle creation of a burglary policy and saving to the db'''
    # items that the mutation will return
    burglary_policy = graphene.Field(BurglaryPolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = BurglaryPolicyInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a burglary policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = BurglaryPolicyValidations()
        agency = info.context.user.agency
        data = validator.validate_burglary_policy_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        burglary_properties = data.pop('burglary_properties', '')
        new_policy = BurglaryPolicy(**data)
        new_policy.save()
        for item in burglary_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.burglary_properties.add(item_obj)
        return CreateBurglaryPolicy(
            status="Success", burglary_policy=new_policy,
            message=SUCCESS_ACTION.format("burglary policycreated"))


class UpdateBurglaryPolicy(graphene.Mutation):
    '''Handle update of a burglary policy'''

    burglary_policy = graphene.Field(BurglaryPolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = BurglaryPolicyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a burglary policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, BurglaryPolicy, "burglary policy")
        validator = BurglaryPolicyValidations()
        data = validator.validate_burglary_policy_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        BurglaryPolicy.objects.filter(id=id).update(**data)
        burglary_policy = BurglaryPolicy.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("burglary policyupdated")

        return UpdateBurglaryPolicy(status=status,
                                    burglary_policy=burglary_policy,
                                    message=message)


class UpdateBurglaryProperty(graphene.Mutation):
    '''Handle update of a burglary policy details'''

    property = graphene.Field(BurglaryPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = BurglaryPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a burglary policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, BurglaryPolicy, "burglary policy")
        validate_object_id(property_id, Property, "burglary policy property")
        validator = BurglaryPolicyValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("burglary policy property updated")

        return UpdateBurglaryProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteBurglaryProperty(graphene.Mutation):
    '''Handle delete of a burglary policy details'''

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
            "update a burglary policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, BurglaryPolicy, "burglary policy")
        property_ = validate_object_id(property_id, Property, "burglary policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("burglary policy property deleted")

        return UpdateBurglaryProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_burglary_policy = CreateBurglaryPolicy.Field()
    update_burglary_policy = UpdateBurglaryPolicy.Field()
    update_burglary_policy_property = UpdateBurglaryProperty.Field()
    delete_burglary_policy_property = DeleteBurglaryProperty.Field()
