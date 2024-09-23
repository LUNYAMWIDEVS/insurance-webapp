import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import ContractorsRisk, Property
from .validators.validate_input import ContractorsRiskValidations
from .object_types import (ContractorsRiskType, ContractorsRiskInput,
                           ContractorsRiskPropertyType, ContractorsRiskPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateContractorsRisk(graphene.Mutation):
    '''Handle creation of a contractor policy and saving to the db'''
    # items that the mutation will return
    contractors_risk = graphene.Field(ContractorsRiskType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = ContractorsRiskInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a contractor policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ContractorsRiskValidations()
        agency = info.context.user.agency
        data = validator.validate_contractors_risk_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        contractor_properties = data.pop('contractor_properties', '')
        new_policy = ContractorsRisk(**data)
        new_policy.save()
        for item in contractor_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.contractor_properties.add(item_obj)
        return CreateContractorsRisk(
            status="Success", contractors_risk=new_policy,
            message=SUCCESS_ACTION.format("contractor policycreated"))


class UpdateContractorsRisk(graphene.Mutation):
    '''Handle update of a contractor policy'''

    contractors_risk = graphene.Field(ContractorsRiskType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ContractorsRiskInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a contractor policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, ContractorsRisk, "contractor policy")
        validator = ContractorsRiskValidations()
        data = validator.validate_contractors_risk_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        ContractorsRisk.objects.filter(id=id).update(**data)
        contractors_risk = ContractorsRisk.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("contractor policyupdated")

        return UpdateContractorsRisk(status=status,
                                    contractors_risk=contractors_risk,
                                    message=message)


class UpdateContractorsRiskProperty(graphene.Mutation):
    '''Handle update of a contractor policy details'''

    property = graphene.Field(ContractorsRiskPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ContractorsRiskPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a contractor policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ContractorsRisk, "contractor policy")
        validate_object_id(property_id, Property, "contractor policy property")
        validator = ContractorsRiskValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("contractor policy property updated")

        return UpdateContractorsRiskProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteContractorsRiskProperty(graphene.Mutation):
    '''Handle delete of a contractor policy details'''

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
            "update a contractor policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ContractorsRisk, "contractor policy")
        property_ = validate_object_id(property_id, Property, "contractor policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("contractor policy property deleted")

        return UpdateContractorsRiskProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_contractors_risk = CreateContractorsRisk.Field()
    update_contractors_risk = UpdateContractorsRisk.Field()
    update_contractors_risk_property = UpdateContractorsRiskProperty.Field()
    delete_contractors_risk_property = DeleteContractorsRiskProperty.Field()
