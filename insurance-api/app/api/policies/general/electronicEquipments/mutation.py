import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import ElectronicEquipment, Property
from .validators.validate_input import ElectronicEquipmentValidations
from .object_types import (ElectronicEquipmentType, ElectronicEquipmentInput,
                           ElectronicEquipmentPropertyType, ElectronicEquipmentPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateElectronicEquipment(graphene.Mutation):
    '''Handle creation of a electronic_equipments policy and saving to the db'''
    # items that the mutation will return
    electronic_equipment = graphene.Field(ElectronicEquipmentType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = ElectronicEquipmentInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a electronic_equipments policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ElectronicEquipmentValidations()
        agency = info.context.user.agency
        data = validator.validate_electronic_equipment_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        electronic_equipment_properties = data.pop('electronic_equipment_properties', '')
        new_policy = ElectronicEquipment(**data)
        new_policy.save()
        for item in electronic_equipment_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.electronic_equipment_properties.add(item_obj)
        return CreateElectronicEquipment(
            status="Success", electronic_equipment=new_policy,
            message=SUCCESS_ACTION.format("electronic_equipments policycreated"))


class UpdateElectronicEquipment(graphene.Mutation):
    '''Handle update of a electronic_equipments policy'''

    electronic_equipment = graphene.Field(ElectronicEquipmentType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ElectronicEquipmentInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a electronic_equipments policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, ElectronicEquipment, "electronic_equipments policy")
        validator = ElectronicEquipmentValidations()
        data = validator.validate_electronic_equipment_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        ElectronicEquipment.objects.filter(id=id).update(**data)
        electronic_equipment = ElectronicEquipment.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("electronic_equipments policyupdated")

        return UpdateElectronicEquipment(status=status,
                                    electronic_equipment=electronic_equipment,
                                    message=message)


class UpdateElectronicEquipmentProperty(graphene.Mutation):
    '''Handle update of a electronic_equipments policy details'''

    property = graphene.Field(ElectronicEquipmentPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ElectronicEquipmentPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a electronic_equipments policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ElectronicEquipment, "electronic_equipments policy")
        validate_object_id(property_id, Property, "electronic_equipments policy property")
        validator = ElectronicEquipmentValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("electronic_equipments policy property updated")

        return UpdateElectronicEquipmentProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteElectronicEquipmentProperty(graphene.Mutation):
    '''Handle delete of a electronic_equipments policy details'''

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
            "update a electronic_equipments policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ElectronicEquipment, "electronic_equipments policy")
        property_ = validate_object_id(property_id, Property, "electronic_equipments policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("electronic_equipments policy property deleted")

        return UpdateElectronicEquipmentProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_electronic_equipment = CreateElectronicEquipment.Field()
    update_electronic_equipment = UpdateElectronicEquipment.Field()
    update_electronic_equipment_property = UpdateElectronicEquipmentProperty.Field()
    delete_electronic_equipment_property = DeleteElectronicEquipmentProperty.Field()
