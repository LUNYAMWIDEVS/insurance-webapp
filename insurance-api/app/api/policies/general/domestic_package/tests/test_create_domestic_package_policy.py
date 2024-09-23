from .base import DomesticPackageBaseTest

class TestCreateDomesticPackage(DomesticPackageBaseTest):
    """
    Create Domestic Package tests
    """

    def test_create_domestic_package_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_domestic_package_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createDomesticPackage']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createDomesticPackage']['domesticPackage']['individualClient']['id'])
