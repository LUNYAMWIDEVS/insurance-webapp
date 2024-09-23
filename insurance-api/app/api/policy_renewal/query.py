import graphene
from .models import PolicyRenewal
from .object_types import PolicyRenewalObjectType


class Query(graphene.ObjectType):
    """
    Query Policy Renewal
    """

    policy_renewals = graphene.List(PolicyRenewalObjectType)
    policy_renewal = graphene.Field(PolicyRenewalObjectType, id=graphene.ID())
    policy_renewal_by_policy_number = graphene.Field(
        PolicyRenewalObjectType, policy_number=graphene.String()
    )

    def resolve_policy_renewals(self, info, **kwargs):

        return PolicyRenewal.objects.all()

    def resolve_policy_renewal(self, info, **kwargs):
        """
        Resolve Policy Renewal
        """
        policy_renewal_id = kwargs.get("id")
        if policy_renewal_id is not None:
            return PolicyRenewal.objects.get(id=policy_renewal_id)

        return None

    def resolve_policy_renewal_by_policy_number(self, info, **kwargs):
        """
        Resolve Policy Renewal by Policy Number
        """
        policy_number = kwargs.get("policy_number")
        if policy_number is not None:
            return PolicyRenewal.objects.get(policy_number=policy_number)

        return None

    # def resolve_policy_renewal_by_policy_holder_id(self, info, **kwargs):
    #     """
    #     Resolve Policy Renewal by Policy Holder ID
    #     """
    #     policy_holder_id = kwargs.get("policy_holder_id")
    #     if policy_holder_id is not None:
    #         return PolicyRenewal.objects.get(policy_holder_id=policy_holder_id)

    #     return None
