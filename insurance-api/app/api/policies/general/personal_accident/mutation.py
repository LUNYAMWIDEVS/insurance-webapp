import graphene
from app.api.helpers.constants import SUCCESS_ACTION
from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validate_object_id import validate_object_id
from app.api.helpers.validation_errors import error_dict
from graphql_extensions.auth.decorators import login_required

from .models import PersonalAccident
from .object_types import PersonalAccidentInput, PersonalAccidentType
from .validators.validate_input import PersonalAccidentValidations


class CreatePersonalAccident(graphene.Mutation):
    '''Handle creation of a personal accident and saving to the db'''
    # items that the mutation will return
    personal_accident = graphene.Field(PersonalAccidentType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = PersonalAccidentInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a personal accident policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = PersonalAccidentValidations()
        data = validator.validate_personal_accident_data(
            kwargs.get("input", ''), info.context.user.agency)

        new_policy = PersonalAccident(**data)
        new_policy.save()
        return CreatePersonalAccident(
            status="Success", personal_accident=new_policy,
            message=SUCCESS_ACTION.format("personal accident policy created"))


class UpdatePersonalAccident(graphene.Mutation):
    '''Handle update of a personal accident'''

    personal_accident = graphene.Field(PersonalAccidentType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = PersonalAccidentInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a personal accident policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, PersonalAccident, "personal accident")
        validator = PersonalAccidentValidations()
        data = validator.validate_personal_accident_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        PersonalAccident.objects.filter(id=id).update(**data)
        personal_accident = PersonalAccident.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("personal accident policy updated")

        return UpdatePersonalAccident(status=status,
                                      personal_accident=personal_accident,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_personal_accident = CreatePersonalAccident.Field()
    update_personal_accident = UpdatePersonalAccident.Field()
