from app.api.helpers.validate_object_id import validate_object_id
from app.api.insurancecompany.models import InsuranceCompany
import graphene
from graphql_extensions.auth.decorators import login_required
from datetime import datetime, timedelta
from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.constants import SUCCESS_ACTION
from ..policies.models import AdditionalPremium
from ..policies.general.motor.models import (
    MotorPolicy,
    PolicyDetails,
    PolicyDetailsSet,
    PolicyType,
    PolicyTypeSet,
)
from .models import PolicyDeletion, AdditionalBenefit
from .object_types import PolicyDeletionInput, PolicyDeletionObjectType
from django.shortcuts import get_object_or_404


class CreatePolicyDeletion(graphene.Mutation):
    """
    Create Policy Deletion
    """

    class Arguments:
        input = PolicyDeletionInput(required=True)

    # items that the mutation will return
    policy_deletion = graphene.Field(PolicyDeletionObjectType)
    status = graphene.String()
    message = graphene.String()

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, input):
        policy = get_object_or_404(MotorPolicy, id=input.policy_id)
        agency = info.context.user.agency
        input["agency"] = agency
        c_note = agency.credit_note
        agency.credit_note = c_note + 1
        agency.save()
        input["debit_note_no"] = f"CRN{c_note:04d}/{str(datetime.today().year)[2:]}"

        # set Addition date
        input["renewal_date"] = input["end_date"] + timedelta(days=1)

        additional_premiums = input.pop("additional_premiums", [])
        additional_benefits = input.pop("additional_benefits", [])
        insurance_co = input.get("insurance_company")
        # add insurance compnay
        input["insurance_company"] = validate_object_id(
            insurance_co, InsuranceCompany, "Insurance Company"
        )

        policy_detail_sets = input.pop("policy_detail_set", [])
        policy_deletion = PolicyDeletion(**input)
        policy_deletion.save()
        for benefit in additional_benefits:
            benefit.pop("amount", "")
            add_ben = AdditionalBenefit(**benefit)
            add_ben.save()
            policy_deletion.additional_benefits.add(add_ben)
        for premium in additional_premiums:
            if not premium.minimum_amount:
                premium["minimum_amount"] = premium.amount
            premium.pop("amount", "")
            add_prem = AdditionalPremium(**premium)
            add_prem.save()
            policy_deletion.additional_premiums.add(add_prem)

        for policy_detail_set in policy_detail_sets:
            pol_type = PolicyType.objects.get(name=policy_detail_set["name"])
            detail_ = PolicyTypeSet(name=pol_type)
            detail_.save()
            for field in policy_detail_set["fields"]:
                pol_detail = PolicyDetails.objects.filter(field=field["field"]).first()
                if pol_detail is None:
                    pol_detail =  PolicyDetails.objects.create(
                        field =field["field"],
                        value=field["value"]
                    )
                field_details_ = PolicyDetailsSet(
                    field=pol_detail, value=field["value"]
                )
                field_details_.save()
                detail_.fields.add(field_details_)
            policy_deletion.policy_detail_set.add(detail_)

        return CreatePolicyDeletion(
            status="Success",
            policy_deletion=policy_deletion,
            message=SUCCESS_ACTION.format("Policy Deletion"),
        )


class Mutation(graphene.ObjectType):
    """
    Mutation class
    """

    create_policy_deletion = CreatePolicyDeletion.Field()
