from .base import PersonalAccidentBaseTest
from .mocks import personal_accident_update_mutation


class TestUpdatePersonalAccident(PersonalAccidentBaseTest):
    """
    Update Personal Accident tests
    """

    def test_update_personal_accident_succeeds(self):
        """
        Test update Personal Accident with valid data succeeds
        """
        policy, client, insurance_company = self.create_personal_accident_policy()
        response = self.client.execute(
            personal_accident_update_mutation,
            {"id": policy.data['createPersonalAccident']['personalAccident']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updatePersonalAccident']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updatePersonalAccident']['personalAccident']['individualClient']['id'])