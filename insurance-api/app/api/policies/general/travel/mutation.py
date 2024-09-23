import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import Travel, TravelDetail
from .validators.validate_input import TravelValidations
from .object_types import (TravelType, TravelInput,
                           TravelDetailsType, TravelDetailsInput)
from app.api.helpers.validate_object_id import validate_object_id


class CreateTravel(graphene.Mutation):
    '''Handle creation of a travel and saving to the db'''
    # items that the mutation will return
    travel_policy = graphene.Field(TravelType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = TravelInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a travel policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = TravelValidations()
        data = validator.validate_travel_data(
            kwargs.get("input", ''), info.context.user.agency)
        travel_details = data.pop('travel_details', '')

        package = TravelDetail(**travel_details)
        package.save()
        data['travel_details'] = package
        new_policy = Travel(**data)
        new_policy.save()
        return CreateTravel(
            status="Success", travel_policy=new_policy,
            message=SUCCESS_ACTION.format("travel policy created"))


class UpdateTravel(graphene.Mutation):
    '''Handle update of a travel'''

    travel_policy = graphene.Field(TravelType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = TravelInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a travel policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, Travel, "travel policy")
        validator = TravelValidations()
        data = validator.validate_travel_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        Travel.objects.filter(id=id).update(**data)
        travel = Travel.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("travel policy updated")

        return UpdateTravel(status=status,
                            travel_policy=travel,
                            message=message)


class UpdateTravelDetails(graphene.Mutation):
    '''Handle update of a travel details'''

    travel_policy_details = graphene.Field(TravelDetailsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = TravelDetailsInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a travel policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, TravelDetail, "travel details")
        validator = TravelValidations()
        data = validator.validate_travel_details_update(
            kwargs.get("input", ''))

        TravelDetail.objects.filter(id=id).update(**data)
        travel_details = TravelDetail.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("travel details updated")

        return UpdateTravelDetails(status=status,
                                   travel_policy_details=travel_details,
                                   message=message)


class Mutation(graphene.ObjectType):
    create_travel_policy = CreateTravel.Field()
    update_travel_policy = UpdateTravel.Field()
    update_travel_policy_details = UpdateTravelDetails.Field()
