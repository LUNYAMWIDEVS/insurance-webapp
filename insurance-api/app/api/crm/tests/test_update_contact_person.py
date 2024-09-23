from .base import CRMBaseTest
from .mocks import contact_person_update_mutation
from app.api.client.tests.mocks import individual_client_mutation

class TestUpdateContactPerson(CRMBaseTest):
    """
    Update Contact Person
    """

    def test_update_contact_person_succeeds(self):
        """
        Test update contact persons with valid data succeeds
        """
        res = self.create_contact_person()
        client = self.client.execute(individual_client_mutation)
        client_ids = [client.data['createIndividualClient']['individualClient']['id']]
        response = self.client.execute(
            contact_person_update_mutation,
            {"id": res.data['createContactPerson']['contactPerson']['id'],
             "individualClients": client_ids})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateContactPerson']['contactPerson']['name'], "martinez")
        self.assertEqual(data['updateContactPerson']['contactPerson']['email'],
        "martinez@gmail.com")
