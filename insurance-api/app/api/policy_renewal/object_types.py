import graphene
from graphene_django.types import DjangoObjectType
from ..policies.general.motor.object_types import (
    AdditionalBenefitInput,
    PolicyTypeSetInput,
)
from graphene.types.generic import GenericScalar

from .models import PolicyRenewal
from ...api.policies.general.helpers.object_types import (
    GeneralInsInput,
)


class PolicyRenewalInput(GeneralInsInput):
    """
    Create Policy Renewal Input Types
    """

    insurance_class = graphene.String()
    remarks = graphene.String()
    policy_id = graphene.ID()
    additional_benefits = graphene.List(AdditionalBenefitInput)
    policy_detail_set = graphene.List(PolicyTypeSetInput)
    value = graphene.Int()


class PolicyRenewalObjectType(DjangoObjectType):
    """
    Create Policy Renewal Object Types
    """

    premiums = graphene.Field(GenericScalar)
    insurance_class = graphene.String()

    def resolve_premiums(self, *args):
        return self.get_premiums

    def resolve_insurance_class(self, *args):
        return self.get_insurance_class_display()

    class Meta:
        model = PolicyRenewal
        fields = "__all__"
