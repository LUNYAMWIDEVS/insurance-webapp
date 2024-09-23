def get_premiums(minimum_amount, rate, value, total=0, exclude=False):
    """
    Function to generate premiums
    Args:
        minimum_amount (float): minimum amount to calculate premiums
        rate (float): premiums rate
        value (float): sum insured
    Returns:
        amount (float): premium amount
    """
    amount = minimum_amount
    if rate and value:
        amount = value * (rate / 100)
    else:
        amount = minimum_amount

    if minimum_amount:
        if minimum_amount > amount:
            amount = minimum_amount
        elif amount > minimum_amount:
            amount = amount

    if exclude in ["IPHCFLEVY", "TLEVY"]:
        amount = total * (rate / 100)
    return round(amount)


def get_premiums_credit_note(minimum_amount, rate, total=0, exclude=False):
    """
    Function to generate premiums for deletions
    Args:
        minimum_amount (float): minimum amount to calculate premiums
    Returns:
        amount (float): premium amount
    """
    amount = minimum_amount

    if minimum_amount:
        if minimum_amount > amount:
            amount = minimum_amount
        elif amount > minimum_amount:
            amount = amount

    if exclude in ["IPHCFLEVY", "TLEVY"]:
        amount = total * (rate / 100)
    return round(amount)
