import graphene
from app.api.helpers.pagination_helper import pagination_helper
from app.api.helpers.permission_required import token_required
from app.api.helpers.validate_object_id import validate_object_id
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required

from .models import GroupMedicalIns
from .object_types import (GroupMedicalInsPaginatedType,
                           GroupMedicalInsType)


class Query(ObjectType):
    group_medical_policy = graphene.Field(
        GroupMedicalInsType, id=graphene.String())
    group_medical_policies = graphene.Field(GroupMedicalInsPaginatedType,
                                            page=graphene.Int(),
                                            search=graphene.String(),
                                            limit=graphene.Int())

    @token_required
    @login_required
    def resolve_group_medical_policy(self, info, **kwargs):
        id = kwargs.get('id', None)
        return validate_object_id(id, GroupMedicalIns, "Individual Medical Policy",
                                  info.context.user.agency)

    @token_required
    @login_required
    def resolve_group_medical_policies(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        if search:
            filter = (
                Q(policy_no__icontains=search) |
                Q(policy_no__icontains=search) |
                Q(debit_note_no__icontains=search) |
                Q(transaction_date__icontains=search) |
                Q(start_date__icontains=search) |
                Q(end_date__icontains=search) |
                Q(principal_members__icontains=search) |
                Q(commission_rate__icontains=search) |
                Q(transaction_type__icontains=search) |
                Q(premium_type__icontains=search) |
                Q(renewal_date__icontains=search))
            policies = GroupMedicalIns.objects.filter(
                filter, agency=info.context.user.agency).all().order_by(
                    '-created_at')
        else:
            policies = GroupMedicalIns.objects.filter(
                agency=info.context.user.agency).all().order_by(
                    '-created_at')
        return pagination_helper(policies, page, limit, GroupMedicalInsPaginatedType)
