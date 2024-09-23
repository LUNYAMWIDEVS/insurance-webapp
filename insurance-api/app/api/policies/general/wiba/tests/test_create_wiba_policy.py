from .base import WibaPolicyBaseTest

class TestCreateWibaPolicy(WibaPolicyBaseTest):
    """
    Create Wiba Policy tests
    """

    def test_create_wiba_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_wiba_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createWibaPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createWibaPolicy']['wibaPolicy']['individualClient']['id'])
