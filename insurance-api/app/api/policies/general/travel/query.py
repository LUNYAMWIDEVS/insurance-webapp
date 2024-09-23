import graphene
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required
from graphene.types.generic import GenericScalar

from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from .models import Travel, TravelDetail
from .object_types import (TravelPaginatedType, TravelType,
                           TravelDetailsType)
from .helpers.travel_policy_helpers import get_default_options


class Query(ObjectType):
    travel_policy_options = GenericScalar()
    travel_policy = graphene.Field(
        TravelType, id=graphene.String())
    travel_policy_details = graphene.Field(
        TravelDetailsType, id=graphene.String())
    travel_policies = graphene.Field(TravelPaginatedType,
                                     page=graphene.Int(),
                                     search=graphene.String(),
                                     limit=graphene.Int())

    @token_required
    @login_required
    def resolve_travel_policy_options(self, info, **kwargs):
        return get_default_options()

    @token_required
    @login_required
    def resolve_travel_policy_details(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, TravelDetail, "Travel details")

    @token_required
    @login_required
    def resolve_travel_policy(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, Travel, "Travel",
                                  info.context.user.agency)

    @token_required
    @login_required
    def resolve_travel_policies(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        if search:
            filter = (
                Q(policy_no__icontains=search) |
                Q(transaction_date__icontains=search) |
                Q(start_date__icontains=search) |
                Q(end_date__icontains=search) |
                Q(individual_client__first_name__icontains=search) |
                Q(individual_client__email__icontains=search) |
                Q(individual_client__postal_address__icontains=search) |
                Q(individual_client__kra_pin__icontains=search) |
                Q(individual_client__id_number__icontains=search) |
                Q(individual_client__phone_number__icontains=search) |
                Q(commission_rate__icontains=search) |
                Q(transaction_type__icontains=search) |
                Q(premium_type__icontains=search) |
                Q(travel_details__option__icontains=search) |
                Q(travel_details__passport_no__icontains=search) |
                Q(travel_details__date_of_travel__icontains=search) |
                Q(travel_details__countries_of_travel__icontains=search) |
                Q(travel_details__modes_of_travel__icontains=search) |
                Q(travel_details__reasons_of_travel__icontains=search) |
                Q(travel_details__next_of_kin__icontains=search) |
                Q(renewal_date__icontains=search))
            clients = Travel.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        else:
            clients = Travel.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        return pagination_helper(clients, page, limit, TravelPaginatedType)
