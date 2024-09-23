from .base import PersonalAccidentBaseTest

class TestCreatePersonalAccident(PersonalAccidentBaseTest):
    """
    Create Personal Accident tests
    """

    def test_create_personal_accident_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_personal_accident_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createPersonalAccident']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createPersonalAccident']['personalAccident']['individualClient']['id'])
