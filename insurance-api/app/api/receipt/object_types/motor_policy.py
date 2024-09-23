import graphene
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ...history.views import get_history
from ..models import MotorPolicyReceipt
from .base_types import ReceiptPaginatedType



class MotorPolicyReceiptType(DjangoObjectType):
    """
    Create a GraphQL type for the model
    """
    history = graphene.List(GenericScalar)
    payment_mode = graphene.String()

    class Meta:
        '''Defines the fields to be serialized in the user model'''
        model = MotorPolicyReceipt

    def resolve_payment_mode(self, *args):
        return self.get_payment_mode_display()

    def resolve_history(self, info):
        return get_history(self)


class MotorPolicyReceiptsPaginatedType(ReceiptPaginatedType):
    """
    MotorPolicyReceipts pagination input types
    """

    items = graphene.List(MotorPolicyReceiptType)
