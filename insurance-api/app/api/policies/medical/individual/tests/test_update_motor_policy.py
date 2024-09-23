from .base import IndividualMedicalInsBaseTest
from .mocks import individual_medical_update_mutation


class TestUpdateIndividualMedicalIns(IndividualMedicalInsBaseTest):
    """
    Update individual medical policy tests
    """

    def test_update_motor_policy_succeeds(self):
        """
        Test update individual medical policy with valid data succeeds
        """
        policy, client, insurance_company = self.create_individual_medical_policy()
        response = self.client.execute(
            individual_medical_update_mutation,
            {"id": policy.data['createIndividualMedicalIns']['individualMedicalIns']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateIndividualMedicalIns']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateIndividualMedicalIns']['individualMedicalIns']['individualClient']['id'])
