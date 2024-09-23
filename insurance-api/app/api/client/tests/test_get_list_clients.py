from .base import ClientBaseTest
from .mocks import (
    get_single_individual_query,
    search_individual_clients_query,
    list_individual_clients_query,
    get_single_corporate_client_query,
    get_corporate_clients_query,
)


class TestGetListClients(ClientBaseTest):
    """
    List clients tests
    """

    def test_get_individual_client_succeeds(self):
        """
        Test get individual client details using individual client ID
        """
        res = self.create_individual_client()
        response = self.client.execute(
            get_single_individual_query,
            {"id": res.data['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['individualClient']['firstName'], "Individual")
        self.assertEqual(data['individualClient']['email'], "individual@gmail.com")

    def test_list_individual_clients_succeeds(self):
        """
        Test get individual clients details
        """
        self.create_individual_client()
        response = self.client.execute(list_individual_clients_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['individualClients']['items'][0]['firstName'], "Individual")
        self.assertEqual(data['individualClients']['items'][0]['email'], "individual@gmail.com")
        self.assertEqual(data['individualClients']['pages'], 1)

    def test_search_individual_clients_succeeds(self):
        """
        Test search individual clients details
        """
        self.create_individual_client()
        response = self.client.execute(search_individual_clients_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['individualClients']['items'][0]['firstName'], "Individual")
        self.assertEqual(data['individualClients']['items'][0]['email'], "individual@gmail.com")
        self.assertEqual(data['individualClients']['pages'], 1)

    def test_get_corporate_client_succeeds(self):
        """
        Test get individual client details using individual client ID
        """
        res = self.create_corporate_client()
        response = self.client.execute(
            get_single_corporate_client_query,
            {"id": res.data['createCorporateClient']['corporateClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['corporateClient']['name'], "Test")
        self.assertEqual(data['corporateClient']['email'], "Martin@gmail.com")

    def test_list_corporate_clients_succeeds(self):
        """
        Test get individual clients details
        """
        self.create_corporate_client()
        response = self.client.execute(get_corporate_clients_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['corporateClients']['items'][0]['name'], "Test")
        self.assertEqual(data['corporateClients']['items'][0]['email'], "Martin@gmail.com")
        self.assertEqual(data['corporateClients']['pages'], 1)

    def test_search_corporate_clients_succeeds(self):
        """
        Test search individual clients details
        """
        self.create_corporate_client()
        response = self.client.execute(get_corporate_clients_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['corporateClients']['items'][0]['name'], "Test")
        self.assertEqual(data['corporateClients']['items'][0]['email'], "Martin@gmail.com")
        self.assertEqual(data['corporateClients']['pages'], 1)
