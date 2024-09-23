import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import WibaPolicy
from .validators.validate_input import WibaPolicyValidations
from .object_types import (WibaPolicyType, WibaPolicyInput)
from app.api.helpers.validate_object_id import validate_object_id


class CreateWibaPolicy(graphene.Mutation):
    '''Handle creation of a wiba policy and saving to the db'''
    # items that the mutation will return
    wiba_policy = graphene.Field(WibaPolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = WibaPolicyInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a wiba policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = WibaPolicyValidations()
        data = validator.validate_wiba_policy_data(
            kwargs.get("input", ''), info.context.user.agency)

        new_policy = WibaPolicy(**data)
        new_policy.save()
        return CreateWibaPolicy(
            status="Success", wiba_policy=new_policy,
            message=SUCCESS_ACTION.format("wiba policy created"))


class UpdateWibaPolicy(graphene.Mutation):
    '''Handle update of a wiba policy'''

    wiba_policy = graphene.Field(WibaPolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = WibaPolicyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a wiba policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, WibaPolicy, "wiba policy")
        validator = WibaPolicyValidations()
        data = validator.validate_wiba_policy_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        WibaPolicy.objects.filter(id=id).update(**data)
        wiba_policy = WibaPolicy.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("wiba policyupdated")

        return UpdateWibaPolicy(status=status,
                                wiba_policy=wiba_policy,
                                message=message)


class Mutation(graphene.ObjectType):
    create_wiba_policy = CreateWibaPolicy.Field()
    update_wiba_policy = UpdateWibaPolicy.Field()
