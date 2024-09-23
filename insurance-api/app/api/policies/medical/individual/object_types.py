import graphene
from graphene_django.types import DjangoObjectType
from .models import IndividualMedicalIns

# from graphene.types.generic import GenericScalar
from ..helpers.object_types import (
    InsurerdInput, MedicalInsInput,
    MedicalInsPaginatedType)


class IndividualMedicalInsInput(MedicalInsInput):
    """
    Create Individual Medical Insurance Input Object Types
    """
    medical_insurance = graphene.Field(InsurerdInput, required=True)


class IndividualMedicalInsType(DjangoObjectType):
    """
    Create a GraphQL type for the IndividualMedicalIns model
    """
    # medical_insurance = graphene.Field(MedicalInsuranceType)
    transaction_type = graphene.String()
    premium_type = graphene.String()

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
        Individual Medical Insurance model
        '''
        model = IndividualMedicalIns


class IndividualMedicalInsPaginatedType(MedicalInsPaginatedType):
    """
    Individual Medical Insurance Client pagination input types
    """
    items = graphene.List(IndividualMedicalInsType)
