from .base import DomesticPackageBaseTest
from .mocks import domestic_package_update_mutation, domestic_package_update_details_mutation


class TestUpdateDomesticPackage(DomesticPackageBaseTest):
    """
    Update Domestic Package tests
    """

    def test_update_domestic_package_succeeds(self):
        """
        Test update Domestic Package with valid data succeeds
        """
        policy, client, insurance_company = self.create_domestic_package_policy()
        response = self.client.execute(
            domestic_package_update_mutation,
            {"id": policy.data['createDomesticPackage']['domesticPackage']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateDomesticPackage']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateDomesticPackage']['domesticPackage']['individualClient']['id'])

    def test_update_domestic_package_details_succeeds(self):
        """
        Test update Domestic Package with valid data succeeds
        """
        policy, client, _ = self.create_domestic_package_policy()
        response = self.client.execute(
            domestic_package_update_details_mutation,
            {"id": policy.data['createDomesticPackage']['domesticPackage']['packageDetails']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateDomesticPackageDetails']['message'],
        "domestic package details updated successfully")
