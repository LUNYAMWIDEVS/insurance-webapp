import graphene

from app.api.agency.validators.validate_agency import AgencyValidations
from .models import Agency
from .object_types import AgencyInput,AgencyType
from ..helpers.permission_required import role_required, token_required
from graphql_extensions.auth.decorators import login_required
from ..helpers.validation_errors import error_dict
from ..helpers.constants import SUCCESS_ACTION

class UpdateAgency(graphene.Mutation):
    '''Handle update of Agency details'''

    agency = graphene.Field(AgencyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = AgencyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format("update Agency Details")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validator = AgencyValidations()
        data = validator.validate_agency_update_data(
            kwargs.get("input", ''))

        agency_data = Agency.objects.get(id=id)
        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `InsuranceCompany` instance one at a time.
            setattr(agency_data, key, value)

        agency_data.save()
        status = "Success"
        message = SUCCESS_ACTION.format("Agency Details updated")

        return UpdateAgency(status=status, agency=agency_data,
                                      message=message)


class Mutation(graphene.ObjectType):
    update_agency_details = UpdateAgency.Field()
