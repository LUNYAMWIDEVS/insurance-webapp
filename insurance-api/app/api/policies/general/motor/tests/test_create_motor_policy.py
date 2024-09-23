from .base import MotorPolicyBaseTest

class TestCreateClient(MotorPolicyBaseTest):
    """
    Create client tests
    """

    def test_create_motor_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_motor_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createMotorPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['createMotorPolicy']['motorPolicy']['individualClient']['id'])
