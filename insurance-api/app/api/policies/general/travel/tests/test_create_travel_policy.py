from .base import TravelBaseTest

class TestcreateTravelPolicy(TravelBaseTest):
    """
    Create Travel tests
    """

    def test_create_travel_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_travel_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createTravelPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createTravelPolicy']['travelPolicy']['individualClient']['id'])
