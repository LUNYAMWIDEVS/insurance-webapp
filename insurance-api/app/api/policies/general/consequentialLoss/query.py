import graphene
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required
from graphene.types.generic import GenericScalar

from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from .models import ConsequentialLoss, Property
from .object_types import (ConsequentialLossPaginatedType, ConsequentialLossType,
                           ConsequentialLossPropertyType)
from .helpers.burglary_policy_helpers import get_default_options


class Query(ObjectType):
    consequential_loss_options = GenericScalar()
    consequential_loss = graphene.Field(
        ConsequentialLossType, id=graphene.String())
    consequential_loss_property = graphene.Field(
        ConsequentialLossPropertyType, id=graphene.String())
    consequential_losses = graphene.Field(ConsequentialLossPaginatedType,
                                       page=graphene.Int(),
                                       search=graphene.String(),
                                       limit=graphene.Int())

    @token_required
    @login_required
    def resolve_consequential_loss_options(self, info, **kwargs):
        return get_default_options()

    @token_required
    @login_required
    def resolve_consequential_loss_property(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, Property, "ConsequentialLoss Policy property")

    @token_required
    @login_required
    def resolve_consequential_loss(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, ConsequentialLoss, "ConsequentialLoss Policy",
                                  info.context.user.agency)

    @token_required
    @login_required
    def resolve_consequential_losses(self, info, search=None, **kwargs):
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
            clients = ConsequentialLoss.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        else:
            clients = ConsequentialLoss.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        return pagination_helper(clients, page, limit, ConsequentialLossPaginatedType)
