import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import MachineryBreakdown, Property
from .validators.validate_input import MachineryBreakdownValidations
from .object_types import (MachineryBreakdownType, MachineryBreakdownInput,
                           MachineryBreakdownPropertyType, MachineryBreakdownPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateMachineryBreakdown(graphene.Mutation):
    '''Handle creation of a machinery_breakdown policy and saving to the db'''
    # items that the mutation will return
    machinery_breakdown = graphene.Field(MachineryBreakdownType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = MachineryBreakdownInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a machinery_breakdown policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = MachineryBreakdownValidations()
        agency = info.context.user.agency
        data = validator.validate_machinery_breakdown_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        machinery_breakdown_properties = data.pop('machinery_breakdown_properties', '')
        new_policy = MachineryBreakdown(**data)
        new_policy.save()
        for item in machinery_breakdown_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.machinery_breakdown_properties.add(item_obj)
        return CreateMachineryBreakdown(
            status="Success", machinery_breakdown=new_policy,
            message=SUCCESS_ACTION.format("machinery_breakdown policycreated"))


class UpdateMachineryBreakdown(graphene.Mutation):
    '''Handle update of a machinery_breakdown policy'''

    machinery_breakdown = graphene.Field(MachineryBreakdownType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = MachineryBreakdownInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a machinery_breakdown policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, MachineryBreakdown, "machinery_breakdown policy")
        validator = MachineryBreakdownValidations()
        data = validator.validate_machinery_breakdown_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        MachineryBreakdown.objects.filter(id=id).update(**data)
        machinery_breakdown = MachineryBreakdown.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("machinery_breakdown policyupdated")

        return UpdateMachineryBreakdown(status=status,
                                    machinery_breakdown=machinery_breakdown,
                                    message=message)


class UpdateMachineryBreakdownProperty(graphene.Mutation):
    '''Handle update of a machinery_breakdown policy details'''

    property = graphene.Field(MachineryBreakdownPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = MachineryBreakdownPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a machinery_breakdown policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, MachineryBreakdown, "machinery_breakdown policy")
        validate_object_id(property_id, Property, "machinery_breakdown policy property")
        validator = MachineryBreakdownValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("machinery_breakdown policy property updated")

        return UpdateMachineryBreakdownProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteMachineryBreakdownProperty(graphene.Mutation):
    '''Handle delete of a machinery_breakdown policy details'''

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
            "update a machinery_breakdown policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, MachineryBreakdown, "machinery_breakdown policy")
        property_ = validate_object_id(property_id, Property, "machinery_breakdown policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("machinery_breakdown policy property deleted")

        return UpdateMachineryBreakdownProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_machinery_breakdown = CreateMachineryBreakdown.Field()
    update_machinery_breakdown = UpdateMachineryBreakdown.Field()
    update_machinery_breakdown_property = UpdateMachineryBreakdownProperty.Field()
    delete_machinery_breakdown_property = DeleteMachineryBreakdownProperty.Field()
