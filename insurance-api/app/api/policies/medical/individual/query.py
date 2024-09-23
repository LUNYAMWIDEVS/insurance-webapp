import graphene
from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from django.db.models import Q
from graphene.types.generic import GenericScalar
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required

from ..helpers.medical_helpers import get_default_medical_options
from .models import IndividualMedicalIns
from .object_types import (IndividualMedicalInsPaginatedType,
                           IndividualMedicalInsType)


class Query(ObjectType):
    individual_medical_policy_options = GenericScalar()
    individual_medical_policy = graphene.Field(
        IndividualMedicalInsType, id=graphene.String())
    individual_medical_policies = graphene.Field(IndividualMedicalInsPaginatedType,
                                                 page=graphene.Int(),
                                                 search=graphene.String(),
                                                 limit=graphene.Int())

    @token_required
    @login_required
    def resolve_individual_medical_policy_options(self, info, **kwargs):
        return get_default_medical_options()

    @ token_required
    @ login_required
    def resolve_individual_medical_policy(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, IndividualMedicalIns, "Individual Medical Policy",
                                  info.context.user.agency)

    @ token_required
    @ login_required
    def resolve_individual_medical_policies(self, info, search=None, **kwargs):
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
                Q(medical_insurance__inpatient_limit__icontains=search) |
                Q(medical_insurance__outpatient_limit__icontains=search) |
                Q(medical_insurance__family_size__icontains=search) |
                Q(medical_insurance__dependants__icontains=search) |
                Q(commission_rate__icontains=search) |
                Q(transaction_type__icontains=search) |
                Q(premium_type__icontains=search) |
                Q(renewal_date__icontains=search))
            policies = IndividualMedicalIns.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        else:
            policies = IndividualMedicalIns.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    'individual_client__first_name')
        return pagination_helper(policies, page, limit, IndividualMedicalInsPaginatedType)
