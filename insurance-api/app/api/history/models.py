import re

from app.api.client.models import CorporateClient, IndividualClient
from app.api.insurancecompany.models import InsuranceCompany
from app.api.policies.general.motor.models import MotorPolicy
from django.dispatch import receiver
from simple_history.signals import (
    post_create_historical_record,
    pre_create_historical_record,
)
from app.api.helpers.choices import InsuranceClasses


OPTIONS_MAPPER = {
    **dict(InsuranceClasses.choices),
    **dict(MotorPolicy.PremiumType.choices),
    **dict(MotorPolicy.TransactionType.choices),
    **dict(IndividualClient.GenderOptions.choices),
}

OPTIONS_MAPPER_KEYS = [*OPTIONS_MAPPER]


def format_client_reason(field, change, model):
    """
    Format client information
    Args:
        field (str): update field name
        change (obj): object containing current and prev changes
        model: (obj): model to query
    Return:
        reason (str): change reason
    """
    reason = "{} changed from {} to {}"
    if field == "individual_client":
        # import pdb; pdb.set_trace()
        prev_client = model.objects.all_with_deleted().get(id=change.old)
        prev_client_ = "{} {} - [{}]".format(
            prev_client.first_name, prev_client.last_name, prev_client.email
        )

        new_client = model.objects.get(id=change.new)
        new_client_ = "{} {} - [{}]".format(
            new_client.first_name, new_client.last_name, new_client.email
        )
        reason = reason.format(
            change.field.title().replace("_", " "), prev_client_, new_client_
        )
    elif field == "corporate_client" or field == "insurance_company":
        prev_client = model.objects.all_with_deleted().get(id=change.old)
        prev_client_ = "{} - [{}]".format(prev_client.name, prev_client.email)

        new_client = model.objects.get(id=change.new)
        new_client_ = "{} - [{}]".format(new_client.name, new_client.email)
        reason = reason.format(
            change.field.title().replace("_", " "), prev_client_, new_client_
        )
    return reason


def format_choice_options_reason(field, change):
    """
    Format choice field reason
    Args:
        field (str): update field name
        change (obj): object containing current and prev changes
    Return:
        reason (str): change reason
    """
    reason = "{} changed from {} to {}"
    reason = reason.format(
        field.title().replace("_", " "),
        OPTIONS_MAPPER.get(change.old),
        OPTIONS_MAPPER.get(change.new),
    )

    return reason


@receiver(pre_create_historical_record)
def pre_create_historical_record_callback(*args, **kwargs):
    """
    Callback to create model history
    """
    history = kwargs.get("history_instance", "")
    if history.history_type == "+":
        model = re.sub(
            r"(?<!^)(?=[A-Z])", " ", kwargs.get("instance").__class__.__name__
        )
        history.history_change_reason = [f"Created {model}"]
    if history.prev_record:
        delta = history.diff_against(history.prev_record)
        reasons = []
        CHANGE_MAPPER = {
            "individual_client": [format_client_reason, IndividualClient],
            "corporate_client": [format_client_reason, CorporateClient],
            "insurance_company": [format_client_reason, InsuranceCompany],
        }
        for change in delta.changes:
            reason = "{} changed from {} to {}".format(
                change.field.title().replace("_", " "), change.old, change.new
            )
            map_change = CHANGE_MAPPER.get(change.field, "")
            if map_change:
                reason = map_change[0](change.field, change, map_change[1])
            elif change.old in OPTIONS_MAPPER_KEYS:
                reason = format_choice_options_reason(change.field, change)
            elif change.field == "password":
                reason = "Password updated"

            reasons.append(reason)
        history.history_change_reason = reasons


@receiver(post_create_historical_record)
def post_create_historical_record_callback(*args, **kwargs):
    history = kwargs.get("history_instance", "")
    if history.prev_record and not history.history_change_reason:
        history.delete()
