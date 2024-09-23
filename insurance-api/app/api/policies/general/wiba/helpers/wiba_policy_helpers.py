
from ..models import WibaPolicy


def get_default_options():
    '''
    Get default wiba policy options
    Returns:
        data (dict): wiba policy options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                WibaPolicy.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                WibaPolicy.TransactionType.choices).items()},
    }
    return data
