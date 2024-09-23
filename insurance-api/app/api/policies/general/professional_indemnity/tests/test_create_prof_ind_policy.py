from .base import ProfessionalIndemnityBaseTest

class TestCreateProfessionalIndemnity(ProfessionalIndemnityBaseTest):
    """
    Create Professional Indemnity tests
    """

    def test_create_prof_ind_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_prof_ind_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createProfessionalIndemnity']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createProfessionalIndemnity']['professionalIndemnity']['individualClient']['id'])
