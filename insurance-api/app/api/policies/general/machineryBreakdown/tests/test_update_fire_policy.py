from .base import BurglaryPolicyBaseTest
from .mocks import burglary_policy_update_mutation, burglary_policy_update_details_mutation


class TestUpdateBurglaryPolicy(BurglaryPolicyBaseTest):
    """
    Update Burglary Policy tests
    """

    def test_update_burglary_policy_succeeds(self):
        """
        Test update Burglary Policy with valid data succeeds
        """
        policy, client, insurance_company = self.create_burglary_policy()
        response = self.client.execute(
            burglary_policy_update_mutation,
            {"id": policy.data['createBurglaryPolicy']['burglaryPolicy']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateBurglaryPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateBurglaryPolicy']['burglaryPolicy']['individualClient']['id'])

    def test_update_burglary_policy_details_succeeds(self):
        """
        Test update Burglary Policy with valid data succeeds
        """
        policy, client, _ = self.create_burglary_policy()
        response = self.client.execute(
            burglary_policy_update_details_mutation,
            {"policyId": policy.data['createBurglaryPolicy']['burglaryPolicy']['id'],
            "propertyId": policy.data['createBurglaryPolicy']['burglaryPolicy']['properties'][0]['id'] })
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateBurglaryPolicyProperty']['message'],
        "burglary policy property updated successfully")
