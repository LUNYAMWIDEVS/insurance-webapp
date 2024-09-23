import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import FirePolicy, Property
from .validators.validate_input import FirePolicyValidations
from .object_types import FirePolicyType, FirePolicyInput, PropertyType, PropertyInput
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateFirePolicy(graphene.Mutation):
    """Handle creation of a fire policy and saving to the db"""

    # items that the mutation will return
    fire_policy = graphene.Field(FirePolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        """Arguments to be passed in during the policy creation"""

        input = FirePolicyInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        """Mutation for insurance cover creation. Actual saving happens here"""
        error_msg = error_dict["admin_only"].format("create a fire policy policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        validator = FirePolicyValidations()
        agency = info.context.user.agency
        data = validator.validate_fire_policy_data(
            kwargs.get("input", ''), agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        properties = data.pop('properties', '')
        new_policy = FirePolicy(**data)
        new_policy.save()

        for item in properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.properties.add(item_obj)
        return CreateFirePolicy(
            status="Success",
            fire_policy=new_policy,
            message=SUCCESS_ACTION.format("fire policycreated"),
        )


class UpdateFirePolicy(graphene.Mutation):
    """Handle update of a fire policy"""

    fire_policy = graphene.Field(FirePolicyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = FirePolicyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update a fire policy policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        validate_object_id(id, FirePolicy, "fire policy")
        validator = FirePolicyValidations()
        data = validator.validate_fire_policy_data_update(
            kwargs.get("input", ""), info.context.user.agency
        )
        FirePolicy.objects.filter(id=id).update(**data)
        fire_policy = FirePolicy.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("fire policyupdated")

        return UpdateFirePolicy(status=status, fire_policy=fire_policy, message=message)


class UpdateProperty(graphene.Mutation):
    """Handle update of a fire policy details"""

    property = graphene.Field(PropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = PropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update a fire policy policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        property_id = kwargs.get("property_id", None)
        policy_id = kwargs.get("policy_id", None)
        validate_object_id(policy_id, FirePolicy, "fire policy")
        validate_object_id(property_id, Property, "fire policy property")
        validator = FirePolicyValidations()
        data = validator.validate_package_details_update(kwargs.get("input", ""))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("fire policy property updated")

        return UpdateProperty(status=status, property=item, message=message)


class DeleteProperty(graphene.Mutation):
    """Handle delete of a fire policy details"""

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update a fire policy policy")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        property_id = kwargs.get("property_id", None)
        policy_id = kwargs.get("policy_id", None)
        validate_object_id(policy_id, FirePolicy, "fire policy")
        property_ = validate_object_id(property_id, Property, "fire policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("fire policy property deleted")

        return UpdateProperty(status=status, message=message)


class Mutation(graphene.ObjectType):
    create_fire_policy = CreateFirePolicy.Field()
    update_fire_policy = UpdateFirePolicy.Field()
    update_fire_policy_property = UpdateProperty.Field()
    delete_fire_policy_property = DeleteProperty.Field()
