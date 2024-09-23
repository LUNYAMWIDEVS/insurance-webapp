from .base import IndividualMedicalInsBaseTest

class TestCreateIndividualMedicalIns(IndividualMedicalInsBaseTest):
    """
    Create individual medical policy tests
    """

    def test_create_group_medical_policy_succeeds(self):
        """
        Test create client with valid data succeeds
        """
        response, client, _ = self.create_group_medical_policy()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createIndividualMedicalIns']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['createIndividualMedicalIns']['individualMedicalIns']['individualClient']['id'])
