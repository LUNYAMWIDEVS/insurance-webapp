
from ..models import FirePolicy


def get_default_options():
    '''
    Get default fire policy options
    Returns:
        data (dict): fire policy options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                FirePolicy.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                FirePolicy.TransactionType.choices).items()},
    }
    return data
