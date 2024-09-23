from .base import PersonalAccidentBaseTest
from .mocks import (get_single_personal_accident_query,
                    list_personal_accidents_query,
                    personal_accident_options)


class TestGetListPersonalAccident(PersonalAccidentBaseTest):
    """
    List personal accident tests
    """

    def test_get_personal_accident_succeeds(self):
        """
        Test get personal accident details using personal accident ID
        """
        policy, client, _ = self.create_personal_accident_policy()
        response = self.client.execute(
            get_single_personal_accident_query,
            {"id": policy.data['createPersonalAccident']['personalAccident']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['personalAccident']['individualClient']['id'])

    def test_list_personal_accidents_succeeds(self):
        """
        Test get Personal Accident policies details
        """
        self.create_personal_accident_policy()
        response = self.client.execute(list_personal_accidents_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['personalAccidents']['items'][0]['policyNo'], "KJB45654VJGY22")
        self.assertEqual(data['personalAccidents']['pages'], 1)


    def test_get_personal_accident_options_succeeds(self):
        """
        Test get personal accident options
        """
        self.create_and_activate_admin()
        response = self.client.execute(personal_accident_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['personalAccidentOptions']['transaction_type_options']['NEW'],
        "New")
        self.assertIsInstance(data['personalAccidentOptions'], dict)
