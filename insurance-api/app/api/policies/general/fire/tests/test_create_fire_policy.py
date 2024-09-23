from .base import FirePolicyBaseTest

class TestCreateFirePolicy(FirePolicyBaseTest):
    """
    Create Fire Policy tests
    """

    def test_create_fire_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_fire_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createFirePolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createFirePolicy']['firePolicy']['individualClient']['id'])
