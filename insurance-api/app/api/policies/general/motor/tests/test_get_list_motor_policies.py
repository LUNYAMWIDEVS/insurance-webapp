from .base import MotorPolicyBaseTest
from .mocks import (get_single_motor_policy_query,
                    search_motor_policies_query,
                    list_motor_policies_query,
                    motor_policy_options)


class TestGetListMotorPolicy(MotorPolicyBaseTest):
    """
    List motor policy tests
    """

    def test_get_motor_policy_succeeds(self):
        """
        Test get motor policy details using motor policy ID
        """
        policy, client, insurance_company = self.create_motor_policy()
        response = self.client.execute(
            get_single_motor_policy_query,
            {"id": policy.data['createMotorPolicy']['motorPolicy']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['motorPolicy']['individualClient']['id'])

    def test_list_motor_policies_succeeds(self):
        """
        Test get motor policies details
        """
        self.create_motor_policy()
        response = self.client.execute(list_motor_policies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['motorPolicies']['items'][0]['vehicles'][0]['body'], "SUV")
        self.assertEqual(data['motorPolicies']['pages'], 1)

    def test_search_motor_policies_succeeds(self):
        """
        Test search motor policies details
        """
        policy, client, insurance_company = self.create_motor_policy()
        response = self.client.execute(search_motor_policies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertIsInstance(data['motorPolicies']['items'], list)
        self.assertEqual(data['motorPolicies']['pages'], 1)

    def test_get_motor_policy_options_succeeds(self):
        """
        Test get motor policy options
        """
        self.create_and_activate_admin()
        response = self.client.execute(motor_policy_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['motorPolicyOptions']['insurance_class_options']['COMM_GEN'],
        "Motor Commercial Insurance – GC - Comp")
        self.assertIsInstance(data['motorPolicyOptions'], dict)
