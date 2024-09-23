from .base import FirePolicyBaseTest
from .mocks import (get_single_fire_policy_query,
                    list_fire_policies_query,
                    fire_policy_options)


class TestGetListFirePolicy(FirePolicyBaseTest):
    """
    List fire policy tests
    """

    def test_get_fire_policy_succeeds(self):
        """
        Test get fire policy details using fire policy ID
        """
        policy, client, _ = self.create_fire_policy()
        response = self.client.execute(
            get_single_fire_policy_query,
            {"id": policy.data['createFirePolicy']['firePolicy']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['firePolicy']['individualClient']['id'])

    def test_list_fire_policies_succeeds(self):
        """
        Test get Fire Policy policies details
        """
        self.create_fire_policy()
        response = self.client.execute(list_fire_policies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['firePolicies']['items'][0]['policyNo'], "KJB45654VJGY22")
        self.assertEqual(data['firePolicies']['pages'], 1)


    def test_get_fire_policy_options_succeeds(self):
        """
        Test get fire policy options
        """
        self.create_and_activate_admin()
        response = self.client.execute(fire_policy_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['firePolicyOptions']['transaction_type_options']['NEW'],
        "New")
        self.assertIsInstance(data['firePolicyOptions'], dict)
