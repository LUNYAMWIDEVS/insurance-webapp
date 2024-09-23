from .base import CRMBaseTest

class TestCreateContactPerson(CRMBaseTest):
    """
    Signup tests
    """

    def test_create_contact_person_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response = self.create_contact_person()

        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createContactPerson']['contactPerson']['email'], "martinez@gmail.com")
        self.assertEqual(data['createContactPerson']['contactPerson']['name'],'martinez')
