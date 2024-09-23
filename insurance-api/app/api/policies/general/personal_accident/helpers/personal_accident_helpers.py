
from ..models import PersonalAccident


def get_default_options():
    '''
    Get default personal accident options
    Returns:
        data (dict): personal accident options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                PersonalAccident.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                PersonalAccident.TransactionType.choices).items()},
        "benefit_limits_type_options": {
            k: str(v) for k, v in dict(
                PersonalAccident.BenefitsType.choices).items()},
    }
    return data
