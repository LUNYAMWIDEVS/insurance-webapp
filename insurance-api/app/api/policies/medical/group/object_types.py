import graphene
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import (DependantsInput, MedicalInsInput,
                                    MedicalInsPaginatedType)
from .models import GroupMedicalIns


class GroupInsurerdInput(graphene.InputObjectType):
    """
    Create Group Medical Insurance Input Object Types
    """
    first_name = graphene.String()
    last_name = graphene.String()
    family_size = graphene.Int()
    age = graphene.Int()
    dependants = graphene.List(DependantsInput)


class GroupMedicalInsInput(MedicalInsInput):
    """
    Create Group Medical Insurance Input Object Types
    """
    principal_members = graphene.Int()
    inpatient_limit = graphene.Float()
    outpatient_limit = graphene.Float()
    medical_insurances = graphene.List(GroupInsurerdInput, required=True)


class GroupMedicalInsType(DjangoObjectType):
    """
    Create a GraphQL type for the GroupMedicalIns model
    """
    transaction_type = graphene.String()
    premium_type = graphene.String()
    inpatient_limit = graphene.Float()
    outpatient_limit = graphene.Float()

    def resolve_transaction_type(self, *args):
        return dict(
            self.TransactionType.choices).get(
                self.transaction_type, "")

    def resolve_premium_type(self, *args):
        return dict(
            self.PremiumType.choices).get(
                self.premium_type, "")

    class Meta:
        '''
        Defines the fields to be serialized in the
        Group Medical Insurance model
        '''
        model = GroupMedicalIns


class GroupMedicalInsPaginatedType(MedicalInsPaginatedType):
    """
    Group Medical Insurance Client pagination input types
    """
    items = graphene.List(GroupMedicalInsType)
