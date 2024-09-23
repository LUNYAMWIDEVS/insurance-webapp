
from ..models import ComputerElectronic


def get_default_options():
    '''
    Get default burglary policy options
    Returns:
        data (dict): burglary policy options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                ComputerElectronic.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                ComputerElectronic.TransactionType.choices).items()},
    }
    return data
