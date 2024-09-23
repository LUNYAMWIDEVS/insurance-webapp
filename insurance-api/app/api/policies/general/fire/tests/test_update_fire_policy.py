from .base import FirePolicyBaseTest
from .mocks import fire_policy_update_mutation, fire_policy_update_details_mutation


class TestUpdateFirePolicy(FirePolicyBaseTest):
    """
    Update Fire Policy tests
    """

    def test_update_fire_policy_succeeds(self):
        """
        Test update Fire Policy with valid data succeeds
        """
        policy, client, insurance_company = self.create_fire_policy()
        response = self.client.execute(
            fire_policy_update_mutation,
            {"id": policy.data['createFirePolicy']['firePolicy']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateFirePolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateFirePolicy']['firePolicy']['individualClient']['id'])

    def test_update_fire_policy_details_succeeds(self):
        """
        Test update Fire Policy with valid data succeeds
        """
        policy, client, _ = self.create_fire_policy()
        response = self.client.execute(
            fire_policy_update_details_mutation,
            {"policyId": policy.data['createFirePolicy']['firePolicy']['id'],
            "propertyId": policy.data['createFirePolicy']['firePolicy']['properties'][0]['id'] })
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateFirePolicyProperty']['message'],
        "fire policy property updated successfully")
