import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import PoliticalViolence, Property
from .validators.validate_input import PoliticalViolenceValidations
from .object_types import (PoliticalViolenceType, PoliticalViolenceInput,
                           PoliticalViolencePropertyType, PoliticalViolencePropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreatePoliticalViolence(graphene.Mutation):
    '''Handle creation of a political_violence policy and saving to the db'''
    # items that the mutation will return
    political_violence = graphene.Field(PoliticalViolenceType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = PoliticalViolenceInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a political_violence policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = PoliticalViolenceValidations()
        agency = info.context.user.agency
        data = validator.validate_political_violence_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        political_violence_properties = data.pop('political_violence_properties', '')
        new_policy = PoliticalViolence(**data)
        new_policy.save()
        for item in political_violence_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.political_violence_properties.add(item_obj)
        return CreatePoliticalViolence(
            status="Success", political_violence=new_policy,
            message=SUCCESS_ACTION.format("political_violence policycreated"))


class UpdatePoliticalViolence(graphene.Mutation):
    '''Handle update of a political_violence policy'''

    political_violence = graphene.Field(PoliticalViolenceType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = PoliticalViolenceInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a political_violence policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, PoliticalViolence, "political_violence policy")
        validator = PoliticalViolenceValidations()
        data = validator.validate_political_violence_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        PoliticalViolence.objects.filter(id=id).update(**data)
        political_violence = PoliticalViolence.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("political_violence policyupdated")

        return UpdatePoliticalViolence(status=status,
                                    political_violence=political_violence,
                                    message=message)


class UpdatePoliticalViolenceProperty(graphene.Mutation):
    '''Handle update of a political_violence policy details'''

    property = graphene.Field(PoliticalViolencePropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = PoliticalViolencePropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a political_violence policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, PoliticalViolence, "political_violence policy")
        validate_object_id(property_id, Property, "political_violence policy property")
        validator = PoliticalViolenceValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("political_violence policy property updated")

        return UpdatePoliticalViolenceProperty(status=status,
                                      property=item,
                                      message=message)


class DeletePoliticalViolenceProperty(graphene.Mutation):
    '''Handle delete of a political_violence policy details'''

    status = graphene.String()
    message = graphene.String()

    class Arguments:
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a political_violence policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, PoliticalViolence, "political_violence policy")
        property_ = validate_object_id(property_id, Property, "political_violence policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("political_violence policy property deleted")

        return UpdatePoliticalViolenceProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_political_violence = CreatePoliticalViolence.Field()
    update_political_violence = UpdatePoliticalViolence.Field()
    update_political_violence_property = UpdatePoliticalViolenceProperty.Field()
    delete_political_violence_property = DeletePoliticalViolenceProperty.Field()
