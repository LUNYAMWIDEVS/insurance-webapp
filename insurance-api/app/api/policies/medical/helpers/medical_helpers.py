from ...models import BasePolicyModel


def get_default_medical_options():
    '''
    Get default motor policy options
    Returns:
        data (dict): motor policy options
    '''
    data = {
        "premium_type_options": {
            k: str(v) for k, v in dict(
                BasePolicyModel.PremiumType.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                BasePolicyModel.TransactionType.choices).items()},
    }
    return data
