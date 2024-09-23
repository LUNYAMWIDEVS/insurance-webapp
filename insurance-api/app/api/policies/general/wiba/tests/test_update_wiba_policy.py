from .base import WibaPolicyBaseTest
from .mocks import wiba_policy_update_mutation


class TestUpdateWibaPolicy(WibaPolicyBaseTest):
    """
    Update Wiba Policy tests
    """

    def test_update_wiba_policy_succeeds(self):
        """
        Test update Wiba Policy with valid data succeeds
        """
        policy, client, insurance_company = self.create_wiba_policy()
        response = self.client.execute(
            wiba_policy_update_mutation,
            {"id": policy.data['createWibaPolicy']['wibaPolicy']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateWibaPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateWibaPolicy']['wibaPolicy']['individualClient']['id'])
