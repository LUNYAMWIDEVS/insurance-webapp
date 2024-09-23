import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import ComputerElectronic, Property
from .validators.validate_input import ComputerElectronicValidations
from .object_types import (ComputerElectronicType, ComputerElectronicInput,
                           ComputerElectronicPropertyType, ComputerElectronicPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateComputerElectronic(graphene.Mutation):
    '''Handle creation of a computer electronic policy and saving to the db'''
    # items that the mutation will return
    computer_electronic = graphene.Field(ComputerElectronicType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = ComputerElectronicInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a computer electronic policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ComputerElectronicValidations()
        agency = info.context.user.agency
        data = validator.validate_computer_electronic_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        computer_electronic_properties = data.pop('computer_electronic_properties', '')
        new_policy = ComputerElectronic(**data)
        new_policy.save()
        for item in computer_electronic_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.computer_electronic_properties.add(item_obj)
        return CreateComputerElectronic(
            status="Success", computer_electronic=new_policy,
            message=SUCCESS_ACTION.format("computer electronic policy created"))


class UpdateComputerElectronic(graphene.Mutation):
    '''Handle update of a computer electronic policy'''

    computer_electronic = graphene.Field(ComputerElectronicType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ComputerElectronicInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a computer electronic policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, ComputerElectronic, "computer electronic policy")
        validator = ComputerElectronicValidations()
        data = validator.validate_computer_electronic_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        ComputerElectronic.objects.filter(id=id).update(**data)
        computer_electronic = ComputerElectronic.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("computer electronic policyupdated")

        return UpdateComputerElectronic(status=status,
                                    computer_electronic=computer_electronic,
                                    message=message)


class UpdateComputerElectronicProperty(graphene.Mutation):
    '''Handle update of a computer electronic policy details'''

    property = graphene.Field(ComputerElectronicPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ComputerElectronicPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a computer electronic policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ComputerElectronic, "computer electronic policy")
        validate_object_id(property_id, Property, "computer electronic policy property")
        validator = ComputerElectronicValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("computer electronic policy property updated")

        return UpdateComputerElectronicProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteComputerElectronicProperty(graphene.Mutation):
    '''Handle delete of a computer electronic policy details'''

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
            "update a computer electronic policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ComputerElectronic, "computer electronic policy")
        property_ = validate_object_id(property_id, Property, "computer electronic policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("computer electronic policy property deleted")

        return UpdateComputerElectronicProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_computer_electronic = CreateComputerElectronic.Field()
    update_computer_electronic = UpdateComputerElectronic.Field()
    update_computer_electronic_property = UpdateComputerElectronicProperty.Field()
    delete_computer_electronic_property = DeleteComputerElectronicProperty.Field()
