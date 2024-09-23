from .base import ClientBaseTest
from .mocks import (
    individual_client_update_mutation,
    corporate_client_update_mutation
)

class TestUpdateClient(ClientBaseTest):
    """
    Update Client tests
    """

    def test_update_client_succeeds(self):
        """
        Test update Client with valid data succeeds
        """
        res = self.create_individual_client()
        response = self.client.execute(
            individual_client_update_mutation,
            {"id": res.data['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateIndividualClient']['status'], "Success")
        self.assertEqual(data['updateIndividualClient']['individualClient']['email'],
        "individualupdate@gmail.com")

    def test_update_corporate_client_succeeds(self):
        """
        Test update Corporate Client with valid data succeeds
        """
        res = self.create_corporate_client()
        response = self.client.execute(
            corporate_client_update_mutation,
            {"id": res.data['createCorporateClient']['corporateClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateCorporateClient']['corporateClient']['name'], "One Sacco")
        self.assertEqual(data['updateCorporateClient']['corporateClient']['email'],
        "test@email.com")
