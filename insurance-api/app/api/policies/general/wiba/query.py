import graphene
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required
from graphene.types.generic import GenericScalar

from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from .models import WibaPolicy
from .object_types import (WibaPolicyPaginatedType, WibaPolicyType)
from .helpers.wiba_policy_helpers import get_default_options


class Query(ObjectType):
    wiba_policy_options = GenericScalar()
    wiba_policy = graphene.Field(
        WibaPolicyType, id=graphene.String())
    wiba_policies = graphene.Field(WibaPolicyPaginatedType,
                                   page=graphene.Int(),
                                   search=graphene.String(),
                                   limit=graphene.Int())

    @token_required
    @login_required
    def resolve_wiba_policy_options(self, info, **kwargs):
        return get_default_options()

    @token_required
    @login_required
    def resolve_wiba_policy(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, WibaPolicy, "Wiba Policy",
                                  info.context.user.agency)

    @token_required
    @login_required
    def resolve_wiba_policies(self, info, search=None, **kwargs):
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
                Q(no_of_staff__icontains=search) |
                Q(estimate_annual_earning__icontains=search) |
                Q(renewal_date__icontains=search))
            clients = WibaPolicy.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        else:
            clients = WibaPolicy.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        return pagination_helper(clients, page, limit, WibaPolicyPaginatedType)
