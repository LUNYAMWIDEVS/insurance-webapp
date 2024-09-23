import graphene
from django.db.models import Q, Count
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required
from graphene.types.generic import GenericScalar

from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from .models import MotorPolicy, PolicyType, PolicyDetails
from .object_types import (
    MotorPolicyPaginatedType,
    MotorPolicyType,
    MotorPolicyInputType,
    PolicyDetailType,
    PolicyTypeSetType,
    PolicyDetailSetType,
    PolicyPaginatedType,
    PolicyDetailsPaginatedType,
)
from .helpers.motor_helpers import get_default_motor_options


class Query(ObjectType):
    motor_policy_options = GenericScalar()
    policy_type = graphene.Field(MotorPolicyInputType, id=graphene.String())
    policy_types = graphene.Field(
        PolicyPaginatedType,
        page=graphene.Int(),
        search=graphene.String(),
        limit=graphene.Int(),
    )
    policy_details = graphene.Field(
        PolicyDetailsPaginatedType,
        page=graphene.Int(),
        search=graphene.String(),
        limit=graphene.Int(),
    )
    motor_policy = graphene.Field(MotorPolicyType, id=graphene.String())
    motor_policies = graphene.Field(
        MotorPolicyPaginatedType,
        page=graphene.Int(),
        search=graphene.String(),
        limit=graphene.Int(),
        start_date_begin=graphene.String(),  # ISO format string for start date range start
        start_date_end=graphene.String(),    # ISO format string for start date range end
        end_date_begin=graphene.String(),    # ISO format string for end date range start
        end_date_end=graphene.String(),      # ISO format string for end date range end
        transaction_date_begin=graphene.String(),  # ISO format string for transaction date range start
        transaction_date_end=graphene.String(),    # ISO format string for transaction date range end

    )

    @token_required
    @login_required
    def resolve_motor_policy_options(self, info, **kwargs):
        return get_default_motor_options()

    @token_required
    @login_required
    def resolve_motor_policy(self, info, **kwargs):
        policy_id = kwargs.get("id")
        return validate_object_id(
            policy_id, MotorPolicy, "Motor Policy", info.context.user.agency
        )

    @token_required
    @login_required
    def resolve_motor_policies(self, info, search=None, **kwargs):
        page = kwargs.get("page", 1)
        limit = kwargs.get("limit", 10)
        start_date_begin = kwargs.get("start_date_begin")
        start_date_end = kwargs.get("start_date_end")
        end_date_begin = kwargs.get("end_date_begin")
        end_date_end = kwargs.get("end_date_end")
        transaction_date_begin = kwargs.get("transaction_date_begin")
        transaction_date_end = kwargs.get("transaction_date_end")

        filters = Q(agency=info.context.user.agency)

        if search:
            filters &= (
                Q(debit_note_no__icontains=search)
                | Q(policy_no__icontains=search)
                | Q(transaction_date__icontains=search)
                | Q(start_date__icontains=search)
                | Q(end_date__icontains=search)
                | Q(value__icontains=search)
                | Q(insurance_class__icontains=search)
                | Q(individual_client__first_name__icontains=search)
                | Q(individual_client__email__icontains=search)
                | Q(individual_client__postal_address__icontains=search)
                | Q(individual_client__kra_pin__icontains=search)
                | Q(individual_client__id_number__icontains=search)
                | Q(individual_client__phone_number__icontains=search)
                | Q(corporate_client__name__icontains=search)
                | Q(corporate_client__email__icontains=search)
                | Q(corporate_client__postal_address__icontains=search)
                | Q(corporate_client__kra_pin__icontains=search)
                | Q(corporate_client__about__icontains=search)
                | Q(corporate_client__phone_number__icontains=search)
                | Q(policy_details__name__icontains=search)
                | Q(policy_detail_set__name__name__icontains=search)
                | Q(vehicles__registration_no__icontains=search)
                | Q(vehicles__chassis_no__icontains=search)
                | Q(vehicles__engine_no__icontains=search)
                | Q(vehicles__year_of_manufacture__icontains=search)
                | Q(renewal_date__icontains=search)
            )

        if start_date_begin and start_date_end:
            filters &= Q(start_date__range=[start_date_begin, start_date_end])

        if end_date_begin and end_date_end:
            filters &= Q(end_date__range=[end_date_begin, end_date_end])

        if transaction_date_begin and transaction_date_end:
            filters &= Q(transaction_date__range=[transaction_date_begin, transaction_date_end])

        clients = (
            MotorPolicy.objects.filter(filters)
            .all()
            .order_by("-created_at")
        )
        
        return pagination_helper(clients, page, limit, MotorPolicyPaginatedType)

    @token_required
    @login_required
    def resolve_policy_types(self, info, search=None, **kwargs):
        page = kwargs.get("page", 1)
        limit = kwargs.get("limit", 10)
        if search:
            filter = Q(name__icontains=search)
            clients = PolicyType.objects.filter(filter).order_by("-created_at")
        else:
            clients = PolicyType.objects.distinct("name")
        return pagination_helper(clients, page, limit, PolicyPaginatedType)

    @token_required
    @login_required
    def resolve_policy_details(self, info, search=None, **kwargs):
        page = kwargs.get("page", 1)
        limit = kwargs.get("limit", 10)
        if search:
            filter = Q(field__icontains=search)
            details = (
                PolicyDetails.objects.filter(filter)
                .all()
                .order_by("-created_at")
                .first()
            )
        else:
            details = PolicyDetails.objects.distinct("field")
        return pagination_helper(details, page, limit, PolicyDetailsPaginatedType)
