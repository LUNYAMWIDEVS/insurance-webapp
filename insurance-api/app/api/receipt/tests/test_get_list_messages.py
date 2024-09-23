from .base import CRMBaseTest
from .mocks import (
    get_single_message_query,
    list_messages_query
)


class TestGetListMessages(CRMBaseTest):
    """
    List messages tests
    """

    def test_get_message_succeeds(self):
        """
        Test get single message we can test using message ID
        """
        res = self.create_message()
        response = self.client.execute(
            get_single_message_query,
            {"id": res.data['sendMessage']['message']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['message']['id'], res.data['sendMessage']['message']['id'])


    def test_list_messages_succeeds(self):
        """
        Test get individual clients details
        """
        self.create_message()
        response = self.client.execute(list_messages_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['messages']['items'][0]['sms'], "Text sample")
        self.assertEqual(data['messages']['pages'], 1)
