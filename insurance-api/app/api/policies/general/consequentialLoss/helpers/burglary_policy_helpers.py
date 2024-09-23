
from ..models import ConsequentialLoss


def get_default_options():
    '''
    Get default burglary policy options
    Returns:
        data (dict): burglary policy options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                ConsequentialLoss.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                ConsequentialLoss.TransactionType.choices).items()},
    }
    return data
