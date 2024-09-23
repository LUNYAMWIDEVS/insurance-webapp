import graphene
from .models import PolicyDeletion
from .object_types import PolicyDeletionObjectType


class Query(graphene.ObjectType):
    """
    Query Policy Deletion
    """

    policy_deletions = graphene.List(PolicyDeletionObjectType)
    policy_deletion = graphene.Field(PolicyDeletionObjectType, id=graphene.ID())
    policy_deletion_by_policy_number = graphene.Field(
        PolicyDeletionObjectType, policy_number=graphene.String()
    )

    def resolve_policy_deletions(self, info, **kwargs):

        return PolicyDeletion.objects.all()

    def resolve_policy_deletion(self, info, **kwargs):
        """
        Resolve Policy Deletion
        """
        policy_deletion_id = kwargs.get("id")
        if policy_deletion_id is not None:
            return PolicyDeletion.objects.get(id=policy_deletion_id)

        return None

    def resolve_policy_deletion_by_policy_number(self, info, **kwargs):
        """
        Resolve Policy Deletion by Policy Number
        """
        policy_number = kwargs.get("policy_number")
        if policy_number is not None:
            return PolicyDeletion.objects.get(policy_number=policy_number)

        return None
