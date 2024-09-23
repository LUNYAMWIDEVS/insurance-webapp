import graphene


class ReceiptInput(graphene.InputObjectType):
    """
    Create Input Object Types
    """
    transaction_date = graphene.Date()
    amount_words = graphene.String()
    amount_figures = graphene.Float()
    payment_mode = graphene.String()
    policy_number = graphene.String()


# Now we create a corresponding PaginatedType for that object type:
class ReceiptPaginatedType(graphene.ObjectType):
    """
    User pagination input types
    """
    count = graphene.Int()
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
