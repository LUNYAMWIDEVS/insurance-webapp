import graphene
from graphql_extensions.auth.decorators import login_required

from ..helpers.permission_required import role_required, token_required
from ..helpers.validation_errors import error_dict
from ..helpers.constants import SUCCESS_ACTION
from .models import InsuranceCompany
# from ..helpers.tasks import send_mail_
from .validators.validate_input import InsuranceCompanyValidations
from .object_types import InsuranceCompanyType, InsuranceCompanyInput


class CreateInsuranceCompany(graphene.Mutation):
    '''Handle creation of an insurance company and saving to the db'''
    # items that the mutation will return
    insurance_company = graphene.Field(InsuranceCompanyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the user creation'''
        input = InsuranceCompanyInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance company creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format("create an insurance company")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = InsuranceCompanyValidations()
        data = validator.validate_insurance_company_data(
            kwargs.get("input", ''))
        new_company = InsuranceCompany(**data)
        new_company.is_active = True
        new_company.save()
        return CreateInsuranceCompany(status="Success", insurance_company=new_company,
                                      message=SUCCESS_ACTION.format("Client created"))


class UpdateInsuranceCompany(graphene.Mutation):
    '''Handle update of a individual client details'''

    insurance_company = graphene.Field(InsuranceCompanyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = InsuranceCompanyInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format("update an insurance company")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validator = InsuranceCompanyValidations()
        data = validator.validate_insurance_company_data_update(
            kwargs.get("input", ''))

        company = InsuranceCompany.objects.get(id=id)
        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `InsuranceCompany` instance one at a time.
            setattr(company, key, value)

        company.save()
        status = "Success"
        message = SUCCESS_ACTION.format("Insurance company updated")

        return UpdateInsuranceCompany(status=status, insurance_company=company,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_insurance_company = CreateInsuranceCompany.Field()
    update_insurance_company = UpdateInsuranceCompany.Field()
