import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import IndustrialAllRisk, Property
from .validators.validate_input import IndustrialAllRiskValidations
from .object_types import (IndustrialAllRiskType, IndustrialAllRiskInput,
                           IndustrialAllRiskPropertyType, IndustrialAllRiskPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateIndustrialAllRisk(graphene.Mutation):
    '''Handle creation of a industrial_all_risks policy and saving to the db'''
    # items that the mutation will return
    industrial_all_risks = graphene.Field(IndustrialAllRiskType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = IndustrialAllRiskInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a industrial_all_risks policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = IndustrialAllRiskValidations()
        agency = info.context.user.agency
        data = validator.validate_industrial_all_risks_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        industrial_all_risks_properties = data.pop('industrial_all_risks_properties', '')
        new_policy = IndustrialAllRisk(**data)
        new_policy.save()
        for item in industrial_all_risks_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.industrial_all_risks_properties.add(item_obj)
        return CreateIndustrialAllRisk(
            status="Success", industrial_all_risks=new_policy,
            message=SUCCESS_ACTION.format("industrial_all_risks policycreated"))


class UpdateIndustrialAllRisk(graphene.Mutation):
    '''Handle update of a industrial_all_risks policy'''

    industrial_all_risks = graphene.Field(IndustrialAllRiskType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = IndustrialAllRiskInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a industrial_all_risks policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, IndustrialAllRisk, "industrial_all_risks policy")
        validator = IndustrialAllRiskValidations()
        data = validator.validate_industrial_all_risks_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        IndustrialAllRisk.objects.filter(id=id).update(**data)
        industrial_all_risks = IndustrialAllRisk.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("industrial_all_risks policyupdated")

        return UpdateIndustrialAllRisk(status=status,
                                    industrial_all_risks=industrial_all_risks,
                                    message=message)


class UpdateIndustrialAllRiskProperty(graphene.Mutation):
    '''Handle update of a industrial_all_risks policy details'''

    property = graphene.Field(IndustrialAllRiskPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = IndustrialAllRiskPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a industrial_all_risks policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, IndustrialAllRisk, "industrial_all_risks policy")
        validate_object_id(property_id, Property, "industrial_all_risks policy property")
        validator = IndustrialAllRiskValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("industrial_all_risks policy property updated")

        return UpdateIndustrialAllRiskProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteIndustrialAllRiskProperty(graphene.Mutation):
    '''Handle delete of a industrial_all_risks policy details'''

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
            "update a industrial_all_risks policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, IndustrialAllRisk, "industrial_all_risks policy")
        property_ = validate_object_id(property_id, Property, "industrial_all_risks policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("industrial_all_risks policy property deleted")

        return UpdateIndustrialAllRiskProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_industrial_all_risks = CreateIndustrialAllRisk.Field()
    update_industrial_all_risks = UpdateIndustrialAllRisk.Field()
    update_industrial_all_risks_property = UpdateIndustrialAllRiskProperty.Field()
    delete_industrial_all_risks_property = DeleteIndustrialAllRiskProperty.Field()
