from ..models import Receipt


def get_default_receipt_options():
    '''
    Get default receipt options
    Returns:
        data (dict): receipt options
    '''
    data = {
        "receipt_options": {
            k: str(v) for k, v in dict(Receipt.PaymentOptions.choices).items()},
    }
    return data
