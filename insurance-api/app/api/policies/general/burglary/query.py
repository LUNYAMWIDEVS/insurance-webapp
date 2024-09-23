import graphene
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required
from graphene.types.generic import GenericScalar

from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from .models import BurglaryPolicy, Property
from .object_types import (BurglaryPolicyPaginatedType, BurglaryPolicyType,
                           BurglaryPropertyType)
from .helpers.burglary_policy_helpers import get_default_options


class Query(ObjectType):
    burglary_policy_options = GenericScalar()
    burglary_policy = graphene.Field(
        BurglaryPolicyType, id=graphene.String())
    burglary_policy_property = graphene.Field(
        BurglaryPropertyType, id=graphene.String())
    burglary_policies = graphene.Field(BurglaryPolicyPaginatedType,
                                       page=graphene.Int(),
                                       search=graphene.String(),
                                       limit=graphene.Int())

    @token_required
    @login_required
    def resolve_burglary_policy_options(self, info, **kwargs):
        return get_default_options()

    @token_required
    @login_required
    def resolve_burglary_policy_property(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, Property, "Burglary Policy property")

    @token_required
    @login_required
    def resolve_burglary_policy(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, BurglaryPolicy, "Burglary Policy",
                                  info.context.user.agency)

    @token_required
    @login_required
    def resolve_burglary_policies(self, info, search=None, **kwargs):
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
                Q(renewal_date__icontains=search))
            clients = BurglaryPolicy.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        else:
            clients = BurglaryPolicy.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        return pagination_helper(clients, page, limit, BurglaryPolicyPaginatedType)
