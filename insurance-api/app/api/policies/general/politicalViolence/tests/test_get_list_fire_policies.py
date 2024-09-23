from .base import BurglaryPolicyBaseTest
from .mocks import (get_single_burglary_policy_query,
                    list_burglary_policies_query,
                    burglary_policy_options)


class TestGetListBurglaryPolicy(BurglaryPolicyBaseTest):
    """
    List burglary policy tests
    """

    def test_get_burglary_policy_succeeds(self):
        """
        Test get burglary policy details using burglary policy ID
        """
        policy, client, _ = self.create_burglary_policy()
        response = self.client.execute(
            get_single_burglary_policy_query,
            {"id": policy.data['createBurglaryPolicy']['burglaryPolicy']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['burglaryPolicy']['individualClient']['id'])

    def test_list_burglary_policies_succeeds(self):
        """
        Test get Burglary Policy policies details
        """
        self.create_burglary_policy()
        response = self.client.execute(list_burglary_policies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['burglaryPolicies']['items'][0]['policyNo'], "KJB45654VJGY22")
        self.assertEqual(data['burglaryPolicies']['pages'], 1)


    def test_get_burglary_policy_options_succeeds(self):
        """
        Test get burglary policy options
        """
        self.create_and_activate_admin()
        response = self.client.execute(burglary_policy_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['burglaryPolicyOptions']['transaction_type_options']['NEW'],
        "New")
        self.assertIsInstance(data['burglaryPolicyOptions'], dict)
