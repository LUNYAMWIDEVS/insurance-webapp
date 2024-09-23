import re
import graphene
from graphql_extensions.auth.decorators import login_required
from datetime import date
from ...helpers.constants import SUCCESS_ACTION
from ...helpers.permission_required import role_required, token_required
from ...helpers.validate_object_id import validate_object_id
from ...helpers.validation_errors import error_dict
from ..models import MotorPolicyReceipt
from ..object_types.motor_policy import MotorPolicyReceiptType
from ..object_types.base_types import ReceiptInput
from ..validators.validate_input import ReceiptValidations

today = date.today()


def generate_receipt_number():
    """ function to generate consecutive receipt numbers 
           and reset the count after every year """
    try:
        latest_receipt = MotorPolicyReceipt.objects.latest('created_at')
        receipt_number = latest_receipt.receipt_number
        receipt_int = int(re.split("[-/]", receipt_number)[1])
        year = receipt_number.split('/')[1]
        if int(today.year) > int(year):
            new_receipt_int = 1
        else:
            new_receipt_int = receipt_int + 1
    except MotorPolicyReceipt.DoesNotExist:
        new_receipt_int = 1
    new_receipt_number = f"RCPT-{new_receipt_int:07d}/{today.year}"
    return new_receipt_number


class CreateMotorPolicyReceipt(graphene.Mutation):
    """Handle creation of a user and saving to the db"""

    receipt = graphene.Field(MotorPolicyReceiptType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        """Arguments to be passed in during the user creation"""

        input = ReceiptInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        """Mutation for user creation. Actual saving happens here"""
        error_msg = error_dict["admin_only"].format("create a receipt")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        validator = ReceiptValidations()
        data_to_validate = kwargs.get("input", "")
        data_to_validate["model"] = MotorPolicyReceipt
        data = validator.validate_create_receipt_data(data_to_validate)
        data["issued_by"] = info.context.user
        new_receipt = MotorPolicyReceipt(**data)
        new_receipt.receipt_number = generate_receipt_number()
        new_receipt.date = today
        new_receipt.save()
        return CreateMotorPolicyReceipt(
            status="Success",
            receipt=new_receipt,
            message=SUCCESS_ACTION.format("Receipt created"),
        )


class UpdateMotorPolicyReceipt(graphene.Mutation):
    """Handle update of a individual client details"""

    receipt = graphene.Field(MotorPolicyReceiptType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ReceiptInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update receipt")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        receipt = validate_object_id(
            id, MotorPolicyReceipt, "Receipt", info.context.user.agency
        )
        validator = ReceiptValidations()
        data = validator.validate_receipt_update_data(
            kwargs.get("input", ""), id, info.context.user.agency, MotorPolicyReceipt
        )

        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `ContactManager` instance one at a time.
            setattr(receipt, key, value)

        receipt.save()

        status = "Success"
        message = SUCCESS_ACTION.format("receipt updated")

        return UpdateMotorPolicyReceipt(status=status, receipt=receipt, message=message)


class DeleteMotorPolicyReceipt(graphene.Mutation):
    """Handle Delete of a individual client details"""

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("delete receipt")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        receipt = validate_object_id(
            id, MotorPolicyReceipt, "Receipt", info.context.user.agency
        )
        receipt.delete()

        status = "Success"
        message = SUCCESS_ACTION.format("receipt deleted")

        return DeleteMotorPolicyReceipt(status=status, message=message)
