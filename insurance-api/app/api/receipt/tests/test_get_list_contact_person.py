from .base import CRMBaseTest
from .mocks import (
    get_single_contact_person_query,
    list_contact_people_query
)


class TestGetListContactPerson(CRMBaseTest):
    """
    List contact persons tests
    """

    def test_get_contact_person_succeeds(self):
        """
        Test get single contact person we can test using contact person ID
        """
        res = self.create_contact_person()
        response = self.client.execute(
            get_single_contact_person_query,
            {"id": res.data['createContactPerson']['contactPerson']['id'],
             "client": res.data['createContactPerson']['contactPerson']['corporateClients'][0]['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['contactPerson']['name'], "martinez")
        self.assertEqual(data['contactPerson']['email'], "martinez@gmail.com")


    def test_list_contact_person_succeeds(self):
        """
        Test get individual clients details
        """
        self.create_contact_person()
        response = self.client.execute(list_contact_people_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['contactPersons']['items'][0]['name'], "martinez")
        self.assertEqual(data['contactPersons']['items'][0]['email'], "martinez@gmail.com")
        self.assertEqual(data['contactPersons']['pages'], 1)
