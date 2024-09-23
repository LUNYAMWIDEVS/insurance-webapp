import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import IndividualMedicalIns, MedicalInsurance
from .validators.validate_input import IndividualMedicalInsValidations
from .object_types import IndividualMedicalInsType, IndividualMedicalInsInput
from app.api.helpers.validate_object_id import validate_object_id


class CreateIndividualMedicalIns(graphene.Mutation):
    '''Handle creation of a individual medical insurance and saving to the db'''
    # items that the mutation will return
    individual_medical_ins = graphene.Field(IndividualMedicalInsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = IndividualMedicalInsInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a individual medical insurance policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = IndividualMedicalInsValidations()
        data = validator.validate_individual_medical_policy_data(
            kwargs.get("input", ''), info.context.user.agency)
        med_ins = MedicalInsurance(**data['medical_insurance'])
        med_ins.save()
        data['medical_insurance'] = med_ins
        new_policy = IndividualMedicalIns(**data)
        new_policy.save()
        return CreateIndividualMedicalIns(
            status="Success", individual_medical_ins=new_policy,
            message=SUCCESS_ACTION.format("individual medical insurance policy created"))


class UpdateIndividualMedicalIns(graphene.Mutation):
    '''Handle update of a individual medical insurance details'''

    individual_medical_ins = graphene.Field(IndividualMedicalInsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = IndividualMedicalInsInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a individual medical insurance policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, IndividualMedicalIns, "individual medical insurance")
        validator = IndividualMedicalInsValidations()
        data = validator.validate_individual_medical_policy_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        medical_insurance = data.pop("medical_insurance", "")
        if medical_insurance:
            medical_insurance_ = IndividualMedicalIns.objects.get(
                id=id).medical_insurance.id
            MedicalInsurance.objects.filter(
                id=medical_insurance_).update(**medical_insurance)
        IndividualMedicalIns.objects.filter(id=id).update(**data)
        individual_medical_ins = IndividualMedicalIns.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("individual medical insurance policy updated")

        return UpdateIndividualMedicalIns(status=status,
                                          individual_medical_ins=individual_medical_ins,
                                          message=message)


class Mutation(graphene.ObjectType):
    create_individual_medical_ins = CreateIndividualMedicalIns.Field()
    update_individual_medical_ins = UpdateIndividualMedicalIns.Field()
