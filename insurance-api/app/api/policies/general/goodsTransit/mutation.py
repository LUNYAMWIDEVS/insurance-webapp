import graphene
from graphql_extensions.auth.decorators import login_required

from app.api.helpers.permission_required import role_required, token_required
from app.api.helpers.validation_errors import error_dict
from app.api.helpers.constants import SUCCESS_ACTION
from .models import GoodsTransit, Property
from .validators.validate_input import GoodsTransitValidations
from .object_types import (GoodsTransitType, GoodsTransitInput,
                           GoodsTransitPropertyType, GoodsTransitPropertyInput)
from app.api.helpers.validate_object_id import validate_object_id
from datetime import datetime

class CreateGoodsTransit(graphene.Mutation):
    '''Handle creation of a goods_transit policy and saving to the db'''
    # items that the mutation will return
    goods_transit = graphene.Field(GoodsTransitType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        '''Arguments to be passed in during the policy creation'''
        input = GoodsTransitInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        '''Mutation for insurance cover creation. Actual saving happens here'''
        error_msg = error_dict['admin_only'].format(
            "create a goods_transit policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        validator = GoodsTransitValidations()
        agency = info.context.user.agency
        data = validator.validate_goods_transit_data(
            kwargs.get("input", ''), info.context.user.agency)
        d_note = agency.debit_note
        data['debit_note_no'] = f"DRN{d_note:04d}/{str(datetime.today().year)[2:]}"
        agency.debit_note = d_note + 1
        agency.save()
        goods_transit_properties = data.pop('goods_transit_properties', '')
        new_policy = GoodsTransit(**data)
        new_policy.save()
        for item in goods_transit_properties:
            item_obj = Property(**item)
            item_obj.save()
            new_policy.goods_transit_properties.add(item_obj)
        return CreateGoodsTransit(
            status="Success", goods_transit=new_policy,
            message=SUCCESS_ACTION.format("goods_transit policycreated"))


class UpdateGoodsTransit(graphene.Mutation):
    '''Handle update of a goods_transit policy'''

    goods_transit = graphene.Field(GoodsTransitType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = GoodsTransitInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a goods_transit policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        id = kwargs.get('id', None)
        validate_object_id(id, GoodsTransit, "goods_transit policy")
        validator = GoodsTransitValidations()
        data = validator.validate_goods_transit_data_update(
            kwargs.get("input", ''), info.context.user.agency)
        GoodsTransit.objects.filter(id=id).update(**data)
        goods_transit = GoodsTransit.objects.get(id=id)
        status = "Success"
        message = SUCCESS_ACTION.format("goods_transit policyupdated")

        return UpdateGoodsTransit(status=status,
                                    goods_transit=goods_transit,
                                    message=message)


class UpdateGoodsTransitProperty(graphene.Mutation):
    '''Handle update of a goods_transit policy details'''

    property = graphene.Field(GoodsTransitPropertyType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = GoodsTransitPropertyInput(required=True)
        property_id = graphene.String(required=True)
        policy_id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict['admin_only'].format(
            "update a goods_transit policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, GoodsTransit, "goods_transit policy")
        validate_object_id(property_id, Property, "goods_transit policy property")
        validator = GoodsTransitValidations()
        data = validator.validate_package_details_update(
            kwargs.get("input", ''))

        Property.objects.filter(id=property_id).update(**data)
        item = Property.objects.get(id=property_id)
        status = "Success"
        message = SUCCESS_ACTION.format("goods_transit policy property updated")

        return UpdateGoodsTransitProperty(status=status,
                                      property=item,
                                      message=message)


class DeleteGoodsTransitProperty(graphene.Mutation):
    '''Handle delete of a goods_transit policy details'''

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
            "update a goods_transit policy policy")
        role_required(info.context.user, ['admin', 'manager'], error_msg)
        property_id = kwargs.get('property_id', None)
        policy_id = kwargs.get('policy_id', None)
        validate_object_id(policy_id, GoodsTransit, "goods_transit policy")
        property_ = validate_object_id(property_id, Property, "goods_transit policy property")
        property_.delete()
        status = "Success"
        message = SUCCESS_ACTION.format("goods_transit policy property deleted")

        return UpdateGoodsTransitProperty(status=status,
                                      message=message)


class Mutation(graphene.ObjectType):
    create_goods_transit = CreateGoodsTransit.Field()
    update_goods_transit = UpdateGoodsTransit.Field()
    update_goods_transit_property = UpdateGoodsTransitProperty.Field()
    delete_goods_transit_property = DeleteGoodsTransitProperty.Field()
