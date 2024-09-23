import graphene
from django.db.models import Q
from graphene_django.types import ObjectType
from graphql_extensions.auth.decorators import login_required

from ..helpers.pagination_helper import pagination_helper
from ..helpers.permission_required import token_required
from ..helpers.validate_object_id import validate_object_id
from .models import InsuranceCompany
from .object_types import InsuranceCompanyPaginatedType, InsuranceCompanyType


class Query(ObjectType):
    insurance_company = graphene.Field(InsuranceCompanyType, id=graphene.String())
    insurance_companies = graphene.Field(InsuranceCompanyPaginatedType,
                                         page=graphene.Int(),
                                         search=graphene.String(),
                                         limit=graphene.Int())

    @token_required
    @login_required
    def resolve_insurance_company(self, info, **kwargs):

        id = kwargs.get('id', None)
        return validate_object_id(id, InsuranceCompany, "Insurance Company")

    @token_required
    @login_required
    def resolve_insurance_companies(self, info, search=None, **kwargs):
        page = kwargs.get('page', 1)
        limit = kwargs.get('limit', 10)
        if search:
            filter = (
                Q(name__icontains=search) |
                Q(contact_person__icontains=search) |
                Q(postal_address__icontains=search) |
                Q(email__icontains=search) |
                Q(telephone_number__icontains=search) |
                Q(mobile_number__icontains=search)
            )
            clients = InsuranceCompany.objects.filter(
                filter).all().order_by('name')
        else:
            clients = InsuranceCompany.objects.all().order_by('name')
        return pagination_helper(clients, page, limit, InsuranceCompanyPaginatedType)
