from datetime import datetime, timedelta

import graphene
from app.api.helpers.constants import SUCCESS_ACTION
from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validate_object_id import validate_object_id
from app.api.helpers.validation_errors import error_dict
from app.api.policies.general.helpers.object_types import AdditionalPremiumInput
from graphql_extensions.auth.decorators import login_required

from ..helpers.object_types import AdditionalPremium, AdditionalPremiumType
from .models import (
    AdditionalBenefit,
    MotorPolicy,
    VehicleDetails,
    PolicyDetails,
    PolicyType,
    PolicyTypeSet,
    PolicyDetailsSet,
)
from .object_types import (
    AdditionalBenefitInput,
    AdditionalBenefitsType,
    MotorPolicyInput,
    MotorPolicyType,
    PolicyTypeInput,
    PolicyDetailsInput,
)
from .validators.validate_input import MotorPolicyValidations


class CreateMotorPolicy(graphene.Mutation):
    """Handle creation of a motor and saving to the db"""

    # items that the mutation will return
    motor_policy = graphene.Field(MotorPolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        """Arguments to be passed in during the user creation"""

        input = MotorPolicyInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        """Mutation for insurance company creation. Actual saving happens here"""
        error_msg = error_dict["admin_only"].format("create a motor policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        validator = MotorPolicyValidations()
        agency = info.context.user.agency
        data = validator.validate_motor_policy_data(kwargs.get("input", ""), agency)
        d_note = agency.debit_note
        data["debit_note_no"] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"

        agency.debit_note = d_note + 1
        agency.save()
        additional_benefits = data.pop("additional_benefits", [])
        additional_premiums = data.pop("additional_premiums", [])
        policy_details = data.pop("policy_details", [])
        policy_detail_sets = data.pop("policy_detail_set", [])

        # set renewal date
        data["renewal_date"] = data["end_date"] + timedelta(days=1)

        new_policy = MotorPolicy(**data)
        new_policy.save()
        for benefit in additional_benefits:
            benefit.pop("amount", "") 
            add_ben = AdditionalBenefit(**benefit)
            add_ben.save()
            new_policy.additional_benefits.add(add_ben)
        for premium in additional_premiums:
            if not premium.minimum_amount:
                premium["minimum_amount"] = premium.amount
            premium.pop("amount", "")
            add_prem = AdditionalPremium(**premium)
            add_prem.save()
            new_policy.additional_premiums.add(add_prem)
        for policy_detail in policy_details:
            detail = PolicyType(name=policy_detail["name"])
            detail.save()
            for field in policy_detail["fields"]:
                field_details = PolicyDetails(**field)
                field_details.save()
                detail.fields.add(field_details)
            new_policy.policy_details.add(detail)
        for policy_detail_set in policy_detail_sets:
            pol_type = PolicyType.objects.get(id=policy_detail_set["name"])
            detail_ = PolicyTypeSet(name=pol_type)
            detail_.save()
            for field in policy_detail_set["fields"]:
                pol_detail = PolicyDetails.objects.filter(id=field["field"]).first()
                field_details_ = PolicyDetailsSet(
                    field=pol_detail, value=field["value"]
                )
                field_details_.save()
                detail_.fields.add(field_details_)
            new_policy.policy_detail_set.add(detail_)
        return CreateMotorPolicy(
            status="Success",
            motor_policy=new_policy,
            message=SUCCESS_ACTION.format("Motor policy created"),
        )


class UpdateMotorPolicy(graphene.Mutation):
    """Handle update of a individual client details"""

    motor_policy = graphene.Field(MotorPolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = MotorPolicyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update a motor policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        policy = validate_object_id(id, MotorPolicy, "Motor Policy")
        validator = MotorPolicyValidations()
        data = validator.validate_motor_policy_data_update(
            kwargs.get("input", ""), info.context.user.agency, policy
        )
        policy_details = data.pop("policy_details", [])
        policy_detail_sets = data.pop("policy_detail_set", [])

        additional_benefits = data.pop("additional_benefits", [])
        additional_premiums = data.pop("additional_premiums", [])
        for benefit in additional_benefits:
            benefit.pop("amount", "")
            add_ben = AdditionalBenefit(**benefit)
            add_ben.save()
            policy.additional_benefits.add(add_ben)
        for premium in additional_premiums:
            premium.pop("amount", "")
            add_prem = AdditionalPremium(**premium)
            add_prem.save()
            policy.additional_premiums.add(add_prem)

        for policy_detail in policy_details:
            detail = PolicyType(name=policy_detail["name"])
            detail.save()
            for field in policy_detail["fields"]:
                field_details = PolicyDetails(**field)
                field_details.save()
                detail.fields.add(field_details)
            policy.policy_details.add(detail)

        for policy_detail_set in policy_detail_sets:
            pol_type = PolicyType.objects.get(id=policy_detail_set["name"])
            detail_ = PolicyTypeSet(name=pol_type)
            detail_.save()
            for field in policy_detail_set["fields"]:
                pol_detail = PolicyDetails.objects.filter(id=field["field"]).first()
                field_details_ = PolicyDetailsSet(
                    field=pol_detail, value=field["value"]
                )
                field_details_.save()
                detail_.fields.add(field_details_)
            policy.policy_detail_set.add(detail_)

        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `MotorPolicy` instance one at a time.
            setattr(policy, key, value)
        if data["transaction_type"] == "RENEW":
            policy.transaction_type = "RENEW"
        # import pdb; pdb.set_trace()
        policy.save()
        status = "Success"
        message = SUCCESS_ACTION.format("Motor policy updated")

        return UpdateMotorPolicy(status=status, motor_policy=policy, message=message)


class DeletePolicy(graphene.Mutation):
    """Handle update additional benefit details"""

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        id = graphene.List(
            graphene.String, required=True
        )  # why is the id field a list and yet it's not a bulk operation

    motor_policy = graphene.Field(MotorPolicyType)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("delete a policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        policy_id = kwargs.get("id", None)
        policy = validate_object_id("".join(policy_id), MotorPolicy, "MotorPolicy")
        policy.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("policy deleted")

        return DeletePolicy(status=status, message=message)


class UpdateAdditionalBenefit(graphene.Mutation):
    """Handle update additional benefit details"""

    additional_benefit = graphene.Field(AdditionalBenefitsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = AdditionalBenefitInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update an additional benefit")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        validate_object_id(id, AdditionalBenefit, "Additional Benefit")
        validator = MotorPolicyValidations()
        data = validator.validate_additional_benefit([kwargs.get("input", "")])
        add_ben = AdditionalBenefit.objects.filter(id=id)
        add_ben.update(**data[0])

        additional_benefit = AdditionalBenefit.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("additional benefit updated")

        return UpdateAdditionalBenefit(
            status=status, additional_benefit=additional_benefit, message=message
        )


class DeleteAdditionalBenefit(graphene.Mutation):
    """Handle update additional benefit details"""

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        id = graphene.List(graphene.String, required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("delete an additional benefit")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        ids = kwargs.get("id", None)
        for id in ids:
            benefit = validate_object_id(id, AdditionalBenefit, "Additional Benefit")
            benefit.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("additional benefit deleted")

        return DeleteAdditionalBenefit(status=status, message=message)


class UpdateAdditionalPremium(graphene.Mutation):
    """Handle update additional premium details"""

    additional_premium = graphene.Field(AdditionalPremiumType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = AdditionalPremiumInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update an additional premium")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        validate_object_id(id, AdditionalPremium, "Additional Premium")
        validator = MotorPolicyValidations()
        data = validator.validate_additional_premium([kwargs.get("input", "")])
        add_ben = AdditionalPremium.objects.filter(id=id)
        add_ben.update(**data[0])

        additional_premium = AdditionalPremium.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("additional premium updated")

        return UpdateAdditionalPremium(
            status=status, additional_premium=additional_premium, message=message
        )


class DeleteAdditionalPremium(graphene.Mutation):
    """Handle update additional premium details"""

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        id = graphene.List(graphene.String, required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("delete an additional premium")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        ids = kwargs.get("id", None)
        for id in ids:
            benefit = validate_object_id(id, AdditionalPremium, "Additional Premium")
            benefit.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("additional premium deleted")

        return DeleteAdditionalPremium(status=status, message=message)


class Mutation(graphene.ObjectType):
    create_motor_policy = CreateMotorPolicy.Field()
    update_motor_policy = UpdateMotorPolicy.Field()
    update_additional_benefit = UpdateAdditionalBenefit.Field()
    delete_additional_benefit = DeleteAdditionalBenefit.Field()
    update_additional_premium = UpdateAdditionalPremium.Field()
    delete_additional_premium = DeleteAdditionalPremium.Field()
    delete_policy = DeletePolicy.Field()
