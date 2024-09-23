import graphene
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required
from graphene.types.generic import GenericScalar

from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from .models import ProfessionalIndemnity
from .object_types import (ProfessionalIndemnityPaginatedType, ProfessionalIndemnityType)
from .helpers.prof_ind_helpers import get_default_prof_ind_options


class Query(ObjectType):
    professional_indemnity_options = GenericScalar()
    professional_indemnity = graphene.Field(
        ProfessionalIndemnityType, id=graphene.String())
    professional_indemnities = graphene.Field(ProfessionalIndemnityPaginatedType,
                                              page=graphene.Int(),
                                              search=graphene.String(),
                                              limit=graphene.Int())

    @token_required
    @login_required
    def resolve_professional_indemnity_options(self, info, **kwargs):
        return get_default_prof_ind_options()

    @ token_required
    @ login_required
    def resolve_professional_indemnity(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, ProfessionalIndemnity, "Professional Indemnity",
                                  info.context.user.agency)

    @ token_required
    @ login_required
    def resolve_professional_indemnities(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        if search:
            filter = (
                Q(policy_no__icontains=search) |
                Q(transaction_date__icontains=search) |
                Q(start_date__icontains=search) |
                Q(end_date__icontains=search) |
                Q(sum_insured__icontains=search) |
                Q(levies__icontains=search) |
                Q(individual_client__first_name__icontains=search) |
                Q(individual_client__email__icontains=search) |
                Q(individual_client__postal_address__icontains=search) |
                Q(individual_client__kra_pin__icontains=search) |
                Q(individual_client__id_number__icontains=search) |
                Q(individual_client__phone_number__icontains=search) |
                Q(excess_amount__icontains=search) |
                Q(commission_rate__icontains=search) |
                Q(commission_amount__icontains=search) |
                Q(transaction_type__icontains=search) |
                Q(premium_type__icontains=search) |
                Q(specialty_class__icontains=search) |
                Q(renewal_date__icontains=search))
            clients = ProfessionalIndemnity.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        else:
            clients = ProfessionalIndemnity.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        return pagination_helper(clients, page, limit, ProfessionalIndemnityPaginatedType)
