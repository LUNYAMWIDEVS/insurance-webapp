from .base import TravelBaseTest
from .mocks import travel_update_mutation, travel_update_details_mutation


class TestUpdateTravel(TravelBaseTest):
    """
    Update Travel tests
    """

    def test_update_travel_succeeds(self):
        """
        Test update Travel with valid data succeeds
        """
        policy, client, insurance_company = self.create_travel_policy()
        response = self.client.execute(
            travel_update_mutation,
            {"id": policy.data['createTravelPolicy']['travelPolicy']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateTravelPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateTravelPolicy']['travelPolicy']['individualClient']['id'])

    def test_update_travel_details_succeeds(self):
        """
        Test update Travel with valid data succeeds
        """
        policy, _, _ = self.create_travel_policy()
        response = self.client.execute(
            travel_update_details_mutation,
            {"id": policy.data['createTravelPolicy']['travelPolicy']['travelDetails']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateTravelPolicyDetails']['message'],
        "travel details updated successfully")
