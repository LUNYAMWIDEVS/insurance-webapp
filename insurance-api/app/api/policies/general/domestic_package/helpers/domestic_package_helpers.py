
from ..models import DomesticPackage


def get_default_options():
    '''
    Get default domestic package options
    Returns:
        data (dict): domestic package options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                DomesticPackage.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                DomesticPackage.TransactionType.choices).items()},
    }
    return data
