import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import PlateGlass, Property
from .validators.validate_input import PlateGlassValidations
from .object_types import (PlateGlassType, PlateGlassInput,
                           PlateGlassPropertyType, PlateGlassPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreatePlateGlass(graphene.Mutation):
    '''Handle creation of a plate_glass policy and saving to the db'''
    # items that the mutation will return
    plate_glass = graphene.Field(PlateGlassType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = PlateGlassInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a plate_glass policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = PlateGlassValidations()
        agency = info.context.user.agency
        data = validator.validate_plate_glass_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        plate_glass_properties = data.pop('plate_glass_properties', '')
        new_policy = PlateGlass(**data)
        new_policy.save()
        for item in plate_glass_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.plate_glass_properties.add(item_obj)
        return CreatePlateGlass(
            status="Success", plate_glass=new_policy,
            message=SUCCESS_ACTION.format("plate_glass policycreated"))


class UpdatePlateGlass(graphene.Mutation):
    '''Handle update of a plate_glass policy'''

    plate_glass = graphene.Field(PlateGlassType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = PlateGlassInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a plate_glass policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, PlateGlass, "plate_glass policy")
        validator = PlateGlassValidations()
        data = validator.validate_plate_glass_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        PlateGlass.objects.filter(id=id).update(**data)
        plate_glass = PlateGlass.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("plate_glass policyupdated")

        return UpdatePlateGlass(status=status,
                                    plate_glass=plate_glass,
                                    message=message)


class UpdatePlateGlassProperty(graphene.Mutation):
    '''Handle update of a plate_glass policy details'''

    property = graphene.Field(PlateGlassPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = PlateGlassPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a plate_glass policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, PlateGlass, "plate_glass policy")
        validate_object_id(property_id, Property, "plate_glass policy property")
        validator = PlateGlassValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("plate_glass policy property updated")

        return UpdatePlateGlassProperty(status=status,
                                      property=item,
                                      message=message)


class DeletePlateGlassProperty(graphene.Mutation):
    '''Handle delete of a plate_glass policy details'''

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
            "update a plate_glass policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, PlateGlass, "plate_glass policy")
        property_ = validate_object_id(property_id, Property, "plate_glass policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("plate_glass policy property deleted")

        return UpdatePlateGlassProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_plate_glass = CreatePlateGlass.Field()
    update_plate_glass = UpdatePlateGlass.Field()
    update_plate_glass_property = UpdatePlateGlassProperty.Field()
    delete_plate_glass_property = DeletePlateGlassProperty.Field()
