from .base import BurglaryPolicyBaseTest

class TestCreateBurglaryPolicy(BurglaryPolicyBaseTest):
    """
    Create Burglary Policy tests
    """

    def test_create_burglary_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_burglary_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createBurglaryPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createBurglaryPolicy']['burglaryPolicy']['individualClient']['id'])
