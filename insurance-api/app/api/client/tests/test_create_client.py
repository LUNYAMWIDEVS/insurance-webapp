from .base import ClientBaseTest

class TestCreateClient(ClientBaseTest):
    """
    Signup tests
    """

    def test_create_individual_client_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response = self.create_individual_client()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createIndividualClient']['status'], "Success")
        self.assertEqual(data['createIndividualClient']['individualClient']['email'], "individual@gmail.com")
        self.assertEqual(data['createIndividualClient']['individualClient']['agency']['name'], 'Samar Insurance')

    def test_create_corporate_client_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response = self.create_corporate_client()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createCorporateClient']['corporateClient']['email'], "Martin@gmail.com")
        self.assertEqual(data['createCorporateClient']['corporateClient']['name'],"Test")
