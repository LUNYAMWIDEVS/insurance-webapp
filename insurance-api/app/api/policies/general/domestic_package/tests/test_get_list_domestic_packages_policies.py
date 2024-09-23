from .base import DomesticPackageBaseTest
from .mocks import (get_single_domestic_package_query,
                    list_domestic_packages_query,
                    domestic_package_options)


class TestGetListDomesticPackage(DomesticPackageBaseTest):
    """
    List domestic package tests
    """

    def test_get_domestic_package_succeeds(self):
        """
        Test get domestic package details using domestic package ID
        """
        policy, client, _ = self.create_domestic_package_policy()
        response = self.client.execute(
            get_single_domestic_package_query,
            {"id": policy.data['createDomesticPackage']['domesticPackage']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['domesticPackage']['individualClient']['id'])

    def test_list_domestic_packages_succeeds(self):
        """
        Test get Domestic Package policies details
        """
        self.create_domestic_package_policy()
        response = self.client.execute(list_domestic_packages_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['domesticPackages']['items'][0]['policyNo'], "KJB45654VJGY22")
        self.assertEqual(data['domesticPackages']['pages'], 1)


    def test_get_domestic_package_options_succeeds(self):
        """
        Test get domestic package options
        """
        self.create_and_activate_admin()
        response = self.client.execute(domestic_package_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['domesticPackageOptions']['transaction_type_options']['NEW'],
        "New")
        self.assertIsInstance(data['domesticPackageOptions'], dict)
