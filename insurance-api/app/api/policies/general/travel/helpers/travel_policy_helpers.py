
from ..models import Travel


def get_default_options():
    '''
    Get default travel options
    Returns:
        data (dict): travel options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                Travel.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                Travel.TransactionType.choices).items()},
    }
    return data
