import graphene
from graphene_django.types import DjangoObjectType
from ..models import MedicalInsurance

from graphene.types.generic import GenericScalar


class DependantsInput(graphene.InputObjectType):
    """
    Dependant Input Object Types
    """
    first_name = graphene.String()
    last_name = graphene.String()
    age = graphene.Int()


class InsurerdInput(graphene.InputObjectType):
    """
    Create Medical Insurance Input Object Types
    """
    first_name = graphene.String()
    last_name = graphene.String()
    inpatient_limit = graphene.Float()
    outpatient_limit = graphene.Float()
    family_size = graphene.Int()
    age = graphene.Int()
    dependants = graphene.List(DependantsInput)


class MedicalInsInput(graphene.InputObjectType):
    """
    Create Medical Insurance Input Object Types
    """
    policy_no = graphene.String()
    debit_note_no = graphene.String()
    individual_client = graphene.String()
    insurance_company = graphene.String()
    transaction_date = graphene.Date()
    start_date = graphene.Date()
    end_date = graphene.Date()
    renewal_date = graphene.Date()
    commission_rate = graphene.Float()
    commission_amount = graphene.Float()
    transaction_type = graphene.String()
    premium_type = graphene.String()


class MedicalInsuranceType(DjangoObjectType):
    """
    Create a GraphQL type for the MedicalIns model
    """
    dependants = GenericScalar()

    class Meta:
        '''
        Defines the fields to be serialized in the
        Medical Insurance model
        '''
        model = MedicalInsurance


class MedicalInsPaginatedType(graphene.ObjectType):
    """
    Group Medical Insurance Client pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
