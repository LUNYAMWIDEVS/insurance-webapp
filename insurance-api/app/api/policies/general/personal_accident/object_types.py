import graphene
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from .models import PersonalAccident


class PersonalAccidentInput(GeneralInsInput):
    """
    Create Personal Accident Input Object Types
    """
    benefit_limits = graphene.List(graphene.String)


class PersonalAccidentType(DjangoObjectType):
    """
    Create a GraphQL type for the PersonalAccident model
    """
    transaction_type = graphene.String()
    premium_type = graphene.String()
    benefit_limits = graphene.List(graphene.String)

    def resolve_transaction_type(self, *args):
        return dict(
            self.TransactionType.choices).get(
                self.transaction_type, "")

    def resolve_benefit_limits(self, *args):
        benefits = []
        for benefit in self.benefit_limits:
            benefits.append(dict(self.BenefitsType.choices).get(
                benefit, ""))
        return benefits

    def resolve_premium_type(self, *args):
        return dict(
            self.PremiumType.choices).get(
                self.premium_type, "")

    class Meta:
        '''Defines the fields to be serialized in the Personal Accident model'''
        model = PersonalAccident


class PersonalAccidentPaginatedType(GeneralInsPaginatedType):
    """
    Personal Accident Client pagination input types
    """
    items = graphene.List(PersonalAccidentType)
