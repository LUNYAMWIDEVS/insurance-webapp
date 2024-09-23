import graphene
from django.db.models import Q
from graphene.types.generic import GenericScalar
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required

from ...helpers.pagination_helper import pagination_helper
from ...helpers.permission_required import role_required, token_required
from ...helpers.validate_object_id import validate_object_id
from ...helpers.validation_errors import error_dict
from ..helpers.receipt_helpers import get_default_receipt_options
from ..models import MotorPolicyReceipt
from ..object_types import (MotorPolicyReceiptsPaginatedType,
                            MotorPolicyReceiptType)


class MotorQuery(ObjectType):
    receipt_options = GenericScalar()
    motor_receipt = graphene.Field(MotorPolicyReceiptType, id=graphene.String())
    motor_receipts = graphene.Field(MotorPolicyReceiptsPaginatedType,
                                    search=graphene.String(),
                                    page=graphene.Int(),
                                    limit=graphene.Int(),
                                    )

    @token_required
    @login_required
    def resolve_receipt_options(self, info, **kwargs):
        return get_default_receipt_options()

    @token_required
    @login_required
    def resolve_motor_receipt(self, info, **kwargs):
        error_msg = error_dict['permission_denied'].format("view", 'contact person')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        return validate_object_id(id, MotorPolicyReceipt, "Receipt")

    @token_required
    @login_required
    def resolve_motor_receipts(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        error_msg = error_dict['admin_only'].format('list contact persons')
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        if search:
            filter = (
                Q(receipt_number__icontains=search) |
                Q(date__icontains=search) |
                Q(amount_words__icontains=search) |
                Q(transaction_date__icontains=search) |
                Q(amount_figures__icontains=search) |
                Q(issued_by__icontains=search) |
                Q(policy__individual_client__first_name__icontains=search) |
                Q(policy__individual_client__email__icontains=search) |
                Q(policy__individual_client__postal_address__icontains=search) |
                Q(policy__individual_client__kra_pin__icontains=search) |
                Q(policy__individual_client__id_number__icontains=search) |
                Q(policy__individual_client__phone_number__icontains=search) |
                Q(policy__vehicles__registration_no__icontains=search) |
                Q(policy__vehicles__chassis_no__icontains=search) |
                Q(policy__vehicles__engine_no__icontains=search) |
                Q(policy__vehicles__year_of_manufacture__icontains=search)
            )
            receipts = MotorPolicyReceipt.objects.filter(
                filter).all().order_by(
                    '-created_at')
        else:
            receipts = MotorPolicyReceipt.objects.filter(
                ).all().order_by(
                    '-created_at')

        return pagination_helper(receipts, page, limit, MotorPolicyReceiptsPaginatedType)
