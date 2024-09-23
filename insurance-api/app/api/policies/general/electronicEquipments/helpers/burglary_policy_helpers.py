
from ..models import ElectronicEquipment


def get_default_options():
    '''
    Get default burglary policy options
    Returns:
        data (dict): burglary policy options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                ElectronicEquipment.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                ElectronicEquipment.TransactionType.choices).items()},
    }
    return data
