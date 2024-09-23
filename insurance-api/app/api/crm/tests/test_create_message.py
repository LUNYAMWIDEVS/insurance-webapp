from .base import CRMBaseTest

class TestCreateMessage(CRMBaseTest):
    """
    Signup tests
    """

    def test_create_message_succeeds(self):
        """
        Test create message with valid data succeeds
        """
        response = self.create_message()

        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['sendMessage']['message']['sms'], "Text sample")
