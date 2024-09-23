from .base import TravelBaseTest
from .mocks import (get_single_travel_query,
                    list_travels_query,
                    travel_options)


class TestGetListTravel(TravelBaseTest):
    """
    List travel tests
    """

    def test_get_travel_succeeds(self):
        """
        Test get travel details using travel ID
        """
        policy, client, _ = self.create_travel_policy()
        response = self.client.execute(
            get_single_travel_query,
            {"id": policy.data['createTravelPolicy']['travelPolicy']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['travelPolicy']['individualClient']['id'])

    def test_list_travels_succeeds(self):
        """
        Test get Travel policies details
        """
        self.create_travel_policy()
        response = self.client.execute(list_travels_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['travelPolicies']['items'][0]['policyNo'], "KJB45654VJGY22")
        self.assertEqual(data['travelPolicies']['pages'], 1)


    def test_get_travel_options_succeeds(self):
        """
        Test get travel options
        """
        self.create_and_activate_admin()
        response = self.client.execute(travel_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['travelPolicyOptions']['transaction_type_options']['NEW'],
        "New")
        self.assertIsInstance(data['travelPolicyOptions'], dict)
