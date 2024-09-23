import graphene
from .models import PolicyAddition
from .object_types import PolicyAdditionObjectType


class Query(graphene.ObjectType):
    """
    Query Policy Addition
    """

    policy_additions = graphene.List(PolicyAdditionObjectType)
    policy_addition = graphene.Field(PolicyAdditionObjectType, id=graphene.ID())
    policy_addition_by_policy_number = graphene.Field(
        PolicyAdditionObjectType, policy_number=graphene.String()
    )

    def resolve_policy_additions(self, info, **kwargs):

        return PolicyAddition.objects.all()

    def resolve_policy_addition(self, info, **kwargs):
        """
        Resolve Policy Addition
        """
        policy_addition_id = kwargs.get("id")
        if policy_addition_id is not None:
            return PolicyAddition.objects.get(id=policy_addition_id)

        return None

    def resolve_policy_addition_by_policy_number(self, info, **kwargs):
        """
        Resolve Policy Addition by Policy Number
        """
        policy_number = kwargs.get("policy_number")
        if policy_number is not None:
            return PolicyAddition.objects.get(policy_number=policy_number)

        return None

