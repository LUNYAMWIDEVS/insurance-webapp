import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import DomesticPackage, DomesticPackageDetail
from .validators.validate_input import DomesticPackageValidations
from .object_types import (DomesticPackageType, DomesticPackageInput,
                           DomesticPackageDetailsType, DomesticPackageDetailsInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateDomesticPackage(graphene.Mutation):
    '''Handle creation of a domestic package and saving to the db'''
    # items that the mutation will return
    domestic_package = graphene.Field(DomesticPackageType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = DomesticPackageInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a domestic package policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = DomesticPackageValidations()
        agency = info.context.user.agency
        data = validator.validate_domestic_package_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        package_details = data.pop('package_details', '')
        package = DomesticPackageDetail(**package_details)
        package.save()
        data['package_details'] = package
        new_policy = DomesticPackage(**data)
        new_policy.save()
        return CreateDomesticPackage(
            status="Success", domestic_package=new_policy,
            message=SUCCESS_ACTION.format("domestic package policy created"))


class UpdateDomesticPackage(graphene.Mutation):
    '''Handle update of a domestic package'''

    domestic_package = graphene.Field(DomesticPackageType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = DomesticPackageInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a domestic package policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, DomesticPackage, "domestic package")
        validator = DomesticPackageValidations()
        data = validator.validate_domestic_package_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        DomesticPackage.objects.filter(id=id).update(**data)
        domestic_package = DomesticPackage.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("domestic package policy updated")

        return UpdateDomesticPackage(status=status,
                                     domestic_package=domestic_package,
                                     message=message)


class UpdateDomesticPackageDetails(graphene.Mutation):
    '''Handle update of a domestic package details'''

    package_details = graphene.Field(DomesticPackageDetailsType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = DomesticPackageDetailsInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a domestic package policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, DomesticPackageDetail, "domestic package details")
        validator = DomesticPackageValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        DomesticPackageDetail.objects.filter(id=id).update(**data)
        package_details = DomesticPackageDetail.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("domestic package details updated")

        return UpdateDomesticPackageDetails(status=status,
                                            package_details=package_details,
                                            message=message)


class Mutation(graphene.ObjectType):
    create_domestic_package = CreateDomesticPackage.Field()
    update_domestic_package = UpdateDomesticPackage.Field()
    update_domestic_package_details = UpdateDomesticPackageDetails.Field()
