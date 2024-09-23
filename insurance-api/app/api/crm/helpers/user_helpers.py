from ..models import Message


def get_default_message_options():
    '''
    Get default message options
    Returns:
        data (dict): message options
    '''
    data = {
        "message_options": {
            k: str(v) for k, v in dict(Message.MessageOptions.choices).items()},
    }
    return data
