import graphene
from graphene_django.types import DjangoObjectType

from ...models import AdditionalPremium
from ...models import BasePolicyModel


class AdditionalPremiumInput(graphene.InputObjectType):
    """
    Create Additional Object Types
    """
    premium = graphene.String()
    commission_rate = graphene.Float()
    amount = graphene.Float()
    minimum_amount = graphene.Float()
    


class AdditionalPremiumType(DjangoObjectType):
    """
    Create a GraphQL type for the AdditionalPremium model
    """
    premium = graphene.String()
    label = graphene.String()

    class Meta:
        '''Defines the fields to be serialized in the additional premiums model'''
        model = AdditionalPremium

    def resolve_label(self, *args):
        return str(dict(BasePolicyModel.PremiumType.choices).get(
            self.premium, ""))


class GeneralInsInput(graphene.InputObjectType):
    """
    Create General Insurance Input Object Types
    """
    policy_no = graphene.String()
    debit_note_no = graphene.String()
    individual_client = graphene.String()
    corporate_client = graphene.String()
    insurance_company = graphene.String()
    transaction_date = graphene.Date()
    start_date = graphene.Date()
    end_date = graphene.Date()
    renewal_date = graphene.Date()
    commission_rate = graphene.Float()
    commission_amount = graphene.Float()
    transaction_type = graphene.String()
    withholding_tax = graphene.Float()
    policy_commission_rate = graphene.Float()
    premium_type = graphene.String()
    additional_premiums = graphene.List(AdditionalPremiumInput)
    minimum_premium_amount = graphene.Float()


class GeneralInsPaginatedType(graphene.ObjectType):
    """
    Group General Insurance pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
