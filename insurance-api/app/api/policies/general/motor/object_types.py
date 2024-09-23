import graphene
from graphene.types.generic import GenericScalar
from graphene_django.types import DjangoObjectType

from ..helpers.object_types import GeneralInsInput, GeneralInsPaginatedType
from app.api.history.views import get_history
from .models import (
    AdditionalBenefit, MotorPolicy, 
    VehicleDetails, PolicyDetails,PolicyType,
    PolicyTypeSet,PolicyDetailsSet
)


class AdditionalBenefitInput(graphene.InputObjectType):
    """
    Create Additional Input Input Object Types
    """
    benefit = graphene.String()
    commission_rate = graphene.Float()
    amount = graphene.Float()
    minimum_amount = graphene.Float()

class PolicyDetailsInput(graphene.InputObjectType):
    """
    Create Customizable Additional Policy Details
    """
    field = graphene.String()
    value = graphene.String()

class PolicyTypeInput(graphene.InputObjectType):
    name = graphene.String()
    fields = graphene.List(PolicyDetailsInput)




class PolicyDetailsSetInput(graphene.InputObjectType):
    """
    Create Customizable Additional Policy Details
    """
    field = graphene.String()
    value = graphene.String()

class PolicyTypeSetInput(graphene.InputObjectType):
    name = graphene.String()
    fields = graphene.List(PolicyDetailsSetInput)

class VehicleInput(graphene.InputObjectType):
    """
    Create Vehicle Input Object Types
    """
    registration_no = graphene.String()
    make = graphene.String()
    model = graphene.String()
    body = graphene.String()
    color = graphene.String()
    value = graphene.Float()
    chassis_no = graphene.String()
    cc = graphene.Int()
    engine_no = graphene.String()
    seating_capacity = graphene.Int()
    tonnage = graphene.Float()
    year_of_manufacture = graphene.Int()


class MotorPolicyInput(GeneralInsInput):
    """
    Create Motor Input Object Types
    """
    vehicles = graphene.List(VehicleInput)
    value = graphene.Float()
    insurance_class = graphene.String()
    premium_type = graphene.String()
    remarks = graphene.String()
    additional_benefits = graphene.List(AdditionalBenefitInput)
    policy_details = graphene.List(PolicyTypeInput)
    policy_detail_set = graphene.List(PolicyTypeSetInput)

class VehiclesType(DjangoObjectType):
    """
    Create a GraphQL type for the vehicles model
    """
    history = graphene.List(GenericScalar)

    def resolve_history(self, info):
        return get_history(self)

    class Meta:
        '''Defines the fields to be serialized in the agency model'''
        model = VehicleDetails


class AdditionalBenefitsType(DjangoObjectType):
    """
    Create a GraphQL type for the AdditionalBenefits model
    """
    history = graphene.List(GenericScalar)
    label = graphene.String()

    def resolve_history(self, info):
        return get_history(self)

    class Meta:
        '''Defines the fields to be serialized in the additional benefits model'''
        model = AdditionalBenefit

    def resolve_label(self, *args):
        return str(dict(
            AdditionalBenefit.AdditionalBenefitOps.choices).get(
            self.benefit, ""))

class MotorPolicyInputType(DjangoObjectType):
    
    class Meta:
        '''Defines the fields to be serialized in the agency model'''
        model = PolicyType


class PolicyDetailSetType(DjangoObjectType):

    class Meta:
        model = PolicyDetailsSet


class PolicyTypeSetType(DjangoObjectType):
    
    class Meta:
        '''Defines the fields to be serialized in the agency model'''
        model = PolicyTypeSet


class PolicyDetailType(DjangoObjectType):

    class Meta:
        model = PolicyDetails


class MotorPolicyType(DjangoObjectType):
    """
    Create a GraphQL type for the MotorPolicy model
    """
    premiums = graphene.Field(GenericScalar)
    history = graphene.List(GenericScalar)
    premium_type = graphene.String()
    insurance_class = graphene.String()
    transaction_type = graphene.String()
    calculate_total = graphene.Float()
    calculate_balance = graphene.Float()

    def resolve_history(self, info):
        return get_history(self)

    def resolve_premiums(self, *args):
        self.calculate_balance
        return self.get_premiums

    def resolve_insurance_class(self, *args):
        return self.get_insurance_class_display()

    def resolve_premium_type(self, *args):
        return self.get_premium_type_display()

    def resolve_transaction_type(self, *args):
        return self.get_transaction_type_display()

    class Meta:
        '''Defines the fields to be serialized in the agency model'''
        model = MotorPolicy



class MotorPolicyPaginatedType(GeneralInsPaginatedType):
    """
    Insurance Company Client pagination input types
    """
    items = graphene.List(MotorPolicyType)


class PolicyPaginatedType(graphene.ObjectType):
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(MotorPolicyInputType)

class PolicyDetailsPaginatedType(graphene.ObjectType):
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    items = graphene.List(PolicyDetailType)