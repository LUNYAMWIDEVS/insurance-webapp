from .base import ProfessionalIndemnityBaseTest
from .mocks import prof_ind_update_mutation


class TestUpdateProfessionalIndemnity(ProfessionalIndemnityBaseTest):
    """
    Update professional indemnity tests
    """

    def test_update_motor_policy_succeeds(self):
        """
        Test update professional indemnity with valid data succeeds
        """
        policy, client, insurance_company = self.create_prof_ind_policy()
        response = self.client.execute(
            prof_ind_update_mutation,
            {"id": policy.data['createProfessionalIndemnity']['professionalIndemnity']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateProfessionalIndemnity']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateProfessionalIndemnity']['professionalIndemnity']['individualClient']['id'])
