
from ..models import ProfessionalIndemnity


def get_default_prof_ind_options():
    '''
    Get default motor policy options
    Returns:
        data (dict): motor policy options
    '''
    data = {
        "specialty_class_options": {
            k: str(v) for k, v in dict(
                ProfessionalIndemnity.SpecialtyClass.choices).items()},
        "transaction_type_options": {
            k: str(v) for k, v in dict(
                ProfessionalIndemnity.TransactionType.choices).items()},
    }
    return data
