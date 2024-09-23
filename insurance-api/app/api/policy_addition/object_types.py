import graphene
from graphene_django.types import DjangoObjectType
from ..policies.general.motor.object_types import (
    AdditionalBenefitInput,
    PolicyTypeSetInput,
)
from graphene.types.generic import GenericScalar

from .models import PolicyAddition
from ...api.policies.general.helpers.object_types import (
    GeneralInsInput,
)


class PolicyAdditionInput(GeneralInsInput):
    """
    Create Policy Addition Input Types
    """

    remarks = graphene.String()
    value = graphene.Int()
    policy_id = graphene.ID()
    additional_benefits = graphene.List(AdditionalBenefitInput)
    insurance_class = graphene.String()
    policy_detail_set = graphene.List(PolicyTypeSetInput)


class PolicyAdditionObjectType(DjangoObjectType):
    """
    Create Policy Addition Object Types
    """

    premiums = graphene.Field(GenericScalar)
    insurance_class = graphene.String()

    def resolve_premiums(self, *args):
        return self.get_premiums

    def resolve_insurance_class(self, *args):
        return self.get_insurance_class_display()

    class Meta:
        model = PolicyAddition
        fields = "__all__"
