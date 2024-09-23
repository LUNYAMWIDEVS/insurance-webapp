import graphene
from graphql_extensions.auth.decorators import login_required

from ..helpers.permission_required import role_required, token_required
from ..helpers.validation_errors import error_dict
from ..helpers.constants import SUCCESS_ACTION
from .models import IndividualClient, CorporateClient
from app.api.crm.models import ContactManager
from .validators.validate_input import ClientValidations
from .object_types import (
    IndividualClientType,
    CorporateClientInput,
    IndividualClientInput,
    CorporateClientType,
)
from datetime import datetime


class CreateIndividualClient(graphene.Mutation):
    """Handle creation of a user and saving to the db"""

    # items that the mutation will return
    individual_client = graphene.Field(IndividualClientType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        """Arguments to be passed in during the user creation"""

        input = IndividualClientInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        """Mutation for user creation. Actual saving happens here"""
        error_msg = error_dict["admin_only"].format("create a client")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        validator = ClientValidations()
        data_to_validate = kwargs.get("input", "")
        agency = info.context.user.agency
        data_to_validate["agency"] = agency
        data = validator.validate_individual_client_registration_data(
            kwargs.get("input", "")
        )
        contact_persons = data.pop("contact_persons", [])
        client_no = agency.client_number
        today = datetime.today()
        data["client_number"] = f"CLN-{today.year}/{client_no:05d}"
        agency.client_number = client_no + 1
        agency.save()
        new_client = IndividualClient(**data)
        new_client.is_active = True
        new_client.save()
        for contact in contact_persons:
            contact_ = ContactManager.objects.get(id=contact)
            new_client.contact_persons.add(contact_)
        return CreateIndividualClient(
            status="Success",
            individual_client=new_client,
            message=SUCCESS_ACTION.format("Client created"),
        )


class CreateCorporateClient(graphene.Mutation):
    """Handle creation of a user and saving to the db"""

    # items that the mutation will return
    corporate_client = graphene.Field(CorporateClientType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        """Arguments to be passed in during the user creation"""

        input = CorporateClientInput(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(self, info, **kwargs):
        """Mutation for user creation. Actual saving happens here"""
        error_msg = error_dict["admin_only"].format("create a client")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        validator = ClientValidations()
        data_to_validate = kwargs.get("input", "")
        agency = info.context.user.agency
        data_to_validate["agency"] = agency
        data = validator.validate_corporate_client_registration_data(data_to_validate)
        contact_persons = data.pop("contact_persons", [])

        today = datetime.today()

        client_no = agency.client_number
        data["client_number"] = f"CLN-{today.year}/{client_no:05d}"
        agency.client_number = client_no + 1
        agency.save()

        new_client = CorporateClient(**data)
        new_client.is_active = True
        new_client.save()
        for contact in contact_persons:
            contact_ = ContactManager.objects.get(id=contact)
            new_client.contact_persons.add(contact_)
        return CreateCorporateClient(
            status="Success",
            corporate_client=new_client,
            message=SUCCESS_ACTION.format("Client created"),
        )


class UpdateIndividualClient(graphene.Mutation):
    """Handle update of a individual client details"""

    individual_client = graphene.Field(IndividualClientType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = IndividualClientInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update a client")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        validator = ClientValidations()
        data = validator.validate_individual_client_update_data(
            kwargs.get("input", ""), id, info.context.user
        )
        contact_persons = data.pop("contact_persons", [])
        client = IndividualClient.objects.get(id=id)
        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `IndividualClient` instance one at a time.
            setattr(client, key, value)

        client.save()
        for contact in contact_persons:
            contact_ = ContactManager.objects.get(id=contact)
            client.contact_persons.add(contact_)
        status = "Success"
        message = SUCCESS_ACTION.format("Client updated")

        return UpdateIndividualClient(
            status=status, individual_client=client, message=message
        )


class UpdateCorporateClient(graphene.Mutation):
    """Handle update of a Corporate client details"""

    corporate_client = graphene.Field(CorporateClientType)
    status = graphene.String()
    message = graphene.String()

    class Arguments:
        input = CorporateClientInput(required=True)
        id = graphene.String(required=True)

    @staticmethod
    @token_required
    @login_required
    def mutate(root, info, **kwargs):
        error_msg = error_dict["admin_only"].format("update a client")
        role_required(info.context.user, ["admin", "manager"], error_msg)
        id = kwargs.get("id", None)
        validator = ClientValidations()
        data = validator.validate_corporate_client_update_data(
            kwargs.get("input", ""), id, info.context.user
        )

        contact_persons = data.pop("contact_persons", [])
        client = CorporateClient.objects.get(id=id)
        for (key, value) in data.items():
            # For the keys remaining in `data`, we will set them on
            # the current `CorporateClient` instance one at a time.
            setattr(client, key, value)
        client.save()
        for contact in contact_persons:
            contact_ = ContactManager.objects.get(id=contact)
            client.contact_persons.add(contact_)
        status = "Success"
        message = SUCCESS_ACTION.format("Client updated")

        return UpdateCorporateClient(
            status=status, corporate_client=client, message=message
        )


class Mutation(graphene.ObjectType):
    create_individual_client = CreateIndividualClient.Field()
    create_corporate_client = CreateCorporateClient.Field()
    update_individual_client = UpdateIndividualClient.Field()
    update_corporate_client = UpdateCorporateClient.Field()
