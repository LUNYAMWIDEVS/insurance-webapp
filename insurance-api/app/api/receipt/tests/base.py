from unittest.mock import Mock, patch
from .mocks import contact_person_mutation, send_message_mutation
from app.api.client.tests.mocks import corporate_client_mutation, individual_client_mutation
from ...authentication.tests.base import BaseTest
class CRMBaseTest(BaseTest):
    """
    API base test case
    """
    def create_contact_person(self):
        self.create_and_activate_admin()
        client = self.client.execute(corporate_client_mutation).data

        response = self.client.execute(
            contact_person_mutation,
            {"corporateClients": [client['createCorporateClient']['corporateClient']['id']]})
        return response

    @patch("app.api.helpers.tasks.send_mail_.delay", Mock(return_value=True))
    @patch("app.api.helpers.tasks.send_sms.delay", Mock(return_value=True))
    @patch("app.api.crm.helpers.message_helper.send_email.delay", Mock(return_value=True))
    def create_message(self):
        self.create_and_activate_admin()
        individual_client = self.client.execute(individual_client_mutation).data
        corporate_client = self.client.execute(corporate_client_mutation).data

        contact_person = self.client.execute(
            contact_person_mutation,
            {"client": corporate_client['createCorporateClient']['corporateClient']['id']}).data
        response = self.client.execute(
            send_message_mutation,
            {
                "individualClients": [individual_client['createIndividualClient']['individualClient']['id']],
                "contactPersons": [contact_person['createContactPerson']['contactPerson']['id']],
            })
        return response
