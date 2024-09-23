from .base import WibaPolicyBaseTest
from .mocks import (get_single_wiba_policy_query,
                    list_wiba_policies_query,
                    wiba_policy_options)


class TestGetListWibaPolicy(WibaPolicyBaseTest):
    """
    List wiba policy tests
    """

    def test_get_wiba_policy_succeeds(self):
        """
        Test get wiba policy details using wiba policy ID
        """
        policy, client, _ = self.create_wiba_policy()
        response = self.client.execute(
            get_single_wiba_policy_query,
            {"id": policy.data['createWibaPolicy']['wibaPolicy']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['wibaPolicy']['individualClient']['id'])

    def test_list_wiba_policies_succeeds(self):
        """
        Test get Wiba Policy policies details
        """
        self.create_wiba_policy()
        response = self.client.execute(list_wiba_policies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['wibaPolicies']['items'][0]['policyNo'], "KJB45654VJGY22")
        self.assertEqual(data['wibaPolicies']['pages'], 1)


    def test_get_wiba_policy_options_succeeds(self):
        """
        Test get wiba policy options
        """
        self.create_and_activate_admin()
        response = self.client.execute(wiba_policy_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['wibaPolicyOptions']['transaction_type_options']['NEW'],
        "New")
        self.assertIsInstance(data['wibaPolicyOptions'], dict)
