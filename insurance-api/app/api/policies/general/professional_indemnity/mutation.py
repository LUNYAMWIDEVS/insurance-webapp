import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import ProfessionalIndemnity
from .validators.validate_input import ProfessionalIndemnityValidations
from .object_types import ProfessionalIndemnityType, ProfessionalIndemnityInput
from app.api.helpers.validate_object_id import validate_object_id


class CreateProfessionalIndemnity(graphene.Mutation):
    '''Handle creation of a professional indemnity and saving to the db'''
    # items that the mutation will return
    professional_indemnity = graphene.Field(ProfessionalIndemnityType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = ProfessionalIndemnityInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a professional indemnity policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ProfessionalIndemnityValidations()
        data = validator.validate_prof_ind_policy_data(
            kwargs.get("input", ''), info.context.user.agency)

        new_policy = ProfessionalIndemnity(**data)
        new_policy.save()
        return CreateProfessionalIndemnity(
            status="Success", professional_indemnity=new_policy,
            message=SUCCESS_ACTION.format("Professional indemnity policy created"))


class UpdateProfessionalIndemnity(graphene.Mutation):
    '''Handle update of a professional indemnity details'''

    professional_indemnity = graphene.Field(ProfessionalIndemnityType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ProfessionalIndemnityInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a professional indemnity policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, ProfessionalIndemnity, "Professional Indemnity")
        validator = ProfessionalIndemnityValidations()
        data = validator.validate_prof_ind_policy_data_update(
            kwargs.get("input", ''), info.context.user.agency)

        ProfessionalIndemnity.objects.filter(id=id).update(**data)
        professional_indemnity = ProfessionalIndemnity.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("Professional Indemnity policy updated")

        return UpdateProfessionalIndemnity(status=status,
                                           professional_indemnity=professional_indemnity,
                                           message=message)


class Mutation(graphene.ObjectType):
    create_professional_indemnity = CreateProfessionalIndemnity.Field()
    update_professional_indemnity = UpdateProfessionalIndemnity.Field()
