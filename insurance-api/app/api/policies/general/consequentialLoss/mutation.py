import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import ConsequentialLoss, Property
from .validators.validate_input import ConsequentialLossValidations
from .object_types import (ConsequentialLossType, ConsequentialLossInput,
                           ConsequentialLossPropertyType, ConsequentialLossPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateConsequentialLoss(graphene.Mutation):
    '''Handle creation of a consequential_loss policy and saving to the db'''
    # items that the mutation will return
    consequential_loss_policy = graphene.Field(ConsequentialLossType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = ConsequentialLossInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a consequential_loss policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = ConsequentialLossValidations()
        agency = info.context.user.agency
        data = validator.validate_consequential_loss_policy_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        consequential_loss_properties = data.pop('consequential_loss_properties', '')
        new_policy = ConsequentialLoss(**data)
        new_policy.save()
        for item in consequential_loss_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.consequential_loss_properties.add(item_obj)
        return CreateConsequentialLoss(
            status="Success", consequential_loss_policy=new_policy,
            message=SUCCESS_ACTION.format("consequential_loss policycreated"))


class UpdateConsequentialLoss(graphene.Mutation):
    '''Handle update of a consequential_loss policy'''

    consequential_loss_policy = graphene.Field(ConsequentialLossType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ConsequentialLossInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a consequential_loss policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, ConsequentialLoss, "consequential_loss policy")
        validator = ConsequentialLossValidations()
        data = validator.validate_consequential_loss_policy_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        ConsequentialLoss.objects.filter(id=id).update(**data)
        consequential_loss_policy = ConsequentialLoss.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("consequential_loss policyupdated")

        return UpdateConsequentialLoss(status=status,
                                    consequential_loss_policy=consequential_loss_policy,
                                    message=message)


class UpdateConsequentialLossProperty(graphene.Mutation):
    '''Handle update of a consequential_loss policy details'''

    property = graphene.Field(ConsequentialLossPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = ConsequentialLossPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a consequential_loss policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ConsequentialLoss, "consequential_loss policy")
        validate_object_id(property_id, Property, "consequential_loss policy property")
        validator = ConsequentialLossValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("consequential_loss policy property updated")

        return UpdateConsequentialLossProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteConsequentialLossProperty(graphene.Mutation):
    '''Handle delete of a consequential_loss policy details'''

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
            "update a consequential_loss policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, ConsequentialLoss, "consequential_loss policy")
        property_ = validate_object_id(property_id, Property, "consequential_loss policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("consequential_loss policy property deleted")

        return UpdateConsequentialLossProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_consequential_loss_policy = CreateConsequentialLoss.Field()
    update_consequential_loss_policy = UpdateConsequentialLoss.Field()
    update_consequential_loss_policy_property = UpdateConsequentialLossProperty.Field()
    delete_consequential_loss_policy_property = DeleteConsequentialLossProperty.Field()
