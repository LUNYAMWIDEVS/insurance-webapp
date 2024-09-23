from ..models import MotorPolicy, AdditionalBenefit
from app.api.helpers.choices import InsuranceClasses


def get_default_motor_options():
    """
    Get default motor policy options
    Returns:
        data (dict): motor policy options
    """
    data = {
        "insurance_class_options": {
            k: str(v) for k, v in dict(InsuranceClasses.choices).items()
        },
        "transaction_type_options": {
            k: str(v) for k, v in dict(MotorPolicy.TransactionType.choices).items()
        },
        "premium_type_options": {
            k: str(v) for k, v in dict(MotorPolicy.PremiumType.choices).items()
        },
        "additional_benefit_options": {
            k: str(v)
            for k, v in dict(AdditionalBenefit.AdditionalBenefitOps.choices).items()
        },
    }
    return data
