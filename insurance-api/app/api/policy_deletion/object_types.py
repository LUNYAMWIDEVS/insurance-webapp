import graphene
from graphene_django.types import DjangoObjectType
from ..policies.general.motor.object_types import (
    AdditionalBenefitInput,
    PolicyTypeSetInput,
)
from graphene.types.generic import GenericScalar

from .models import PolicyDeletion
from ...api.policies.general.helpers.object_types import (
    GeneralInsInput,
)


class PolicyDeletionInput(GeneralInsInput):
    """
    Create Policy Deletion Input Types
    """

    value = graphene.Int()
    remarks = graphene.String()
    policy_id = graphene.ID()
    additional_benefits = graphene.List(AdditionalBenefitInput)
    insurance_class = graphene.String()
    policy_detail_set = graphene.List(PolicyTypeSetInput)


class PolicyDeletionObjectType(DjangoObjectType):
    """
    Create Policy Deletion Object Types
    """

    premiums = graphene.Field(GenericScalar)
    insurance_class = graphene.String()

    def resolve_premiums(self, *args):
        return self.get_premiums

    def resolve_insurance_class(self, *args):
        return self.get_insurance_class_display()

    class Meta:
        model = PolicyDeletion
        fields = "__all__"
