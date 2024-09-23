import graphene
from app.api.helpers.constants import SUCCESS_ACTION
from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validate_object_id import validate_object_id
from app.api.helpers.validation_errors import error_dict
from graphql_extensions.auth.decorators import login_required

from ..models import MedicalInsurance
from .models import GroupMedicalIns
from .object_types import GroupMedicalInsInput, GroupMedicalInsType
from .validators.validate_input import GroupMedicalInsValidations
from ..helpers.object_types import InsurerdInput, MedicalInsuranceType


class CreateGroupMedicalIns(graphene.Mutation):
    '''Handle creation of a group medical insurance and saving to the db'''
    # items that the mutation will return
    group_medical_ins = graphene.Field(GroupMedicalInsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = GroupMedicalInsInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a group medical insurance policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = GroupMedicalInsValidations()
        data = validator.validate_group_medical_policy_data(
            kwargs.get("input", ''), info.context.user.agency)
        insurances = data.pop('medical_insurances', '')
        new_policy = GroupMedicalIns(**data)
        new_policy.save()
        for insurance in insurances:
            med_ins = MedicalInsurance(**insurance)
            med_ins.save()
            new_policy.medical_insurances.add(med_ins)

        return CreateGroupMedicalIns(
            status="Success", group_medical_ins=new_policy,
            message=SUCCESS_ACTION.format("group medical insurance policy created"))


class UpdateGroupMedicalIns(graphene.Mutation):
    '''Handle update of a group medical insurance details'''

    group_medical_ins = graphene.Field(GroupMedicalInsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = GroupMedicalInsInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a group medical insurance policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        group_ins = validate_object_id(id, GroupMedicalIns, "group medical insurance")
        validator = GroupMedicalInsValidations()
        data = validator.validate_group_medical_policy_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        medical_insurance = data.pop("medical_insurances", "")
        if medical_insurance:
            insurance_ids = group_ins.medical_insurances
            for insurance in medical_insurance:
                med_ins = MedicalInsurance(**insurance)
                med_ins.save()
                insurance_ids.append(med_ins.id)
            data['medical_insurances'] = insurance_ids
        GroupMedicalIns.objects.filter(id=id).update(**data)
        group_medical_ins = GroupMedicalIns.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("group medical insurance policy updated")

        return UpdateGroupMedicalIns(status=status,
                                     group_medical_ins=group_medical_ins,
                                     message=message)


class UpdateInsuredDetails(graphene.Mutation):
    '''Handle update of an insured details'''

    insured_party = graphene.Field(MedicalInsuranceType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = InsurerdInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update an insured user details")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, MedicalInsurance, "insured user")
        data = kwargs.get("input", '')
        if data:
            MedicalInsurance.objects.filter(id=id).update(**data)
        insured_party = MedicalInsurance.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("insured party")

        return UpdateInsuredDetails(status=status,
                                    insured_party=insured_party,
                                    message=message)


class Mutation(graphene.ObjectType):
    create_group_medical_ins = CreateGroupMedicalIns.Field()
    update_group_medical_ins = UpdateGroupMedicalIns.Field()
    update_insured_party = UpdateInsuredDetails.Field()
