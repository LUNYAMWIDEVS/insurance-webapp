from .base import IndividualMedicalInsBaseTest
from .mocks import (get_single_group_medical_query,
                    search_prof_indemnities_query,
                    list_prof_indemnities_query,
                    individual_medical_options)


class TestGetListMotorPolicy(IndividualMedicalInsBaseTest):
    """
    List individual medical policy tests
    """

    def test_get_group_medical_succeeds(self):
        """
        Test get individual medical policy details using individual medical policy ID
        """
        policy, client, insurance_company = self.create_group_medical_policy()
        response = self.client.execute(
            get_single_group_medical_query,
            {"id": policy.data['createIndividualMedicalIns']['individualMedicalIns']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['individualMedicalPolicy']['individualClient']['id'])

    def test_list_prof_indemnities_succeeds(self):
        """
        Test get individual medical policy policies details
        """
        self.create_group_medical_policy()
        response = self.client.execute(list_prof_indemnities_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['individualMedicalPolicies']['items'][0]['policyNo'], "KJB45654VJGsdfY22")
        self.assertEqual(data['individualMedicalPolicies']['pages'], 1)

    def test_search_prof_indemnities_succeeds(self):
        """
        Test search individual medical policies details
        """
        self.create_group_medical_policy()
        response = self.client.execute(search_prof_indemnities_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertIsInstance(data['individualMedicalPolicies']['items'], list)
        self.assertEqual(data['individualMedicalPolicies']['pages'], 1)

    def test_get_group_medical_options_succeeds(self):
        """
        Test get individual medical policy options
        """
        self.create_and_activate_admin()
        response = self.client.execute(individual_medical_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['individualMedicalPolicyOptions']['premium_type_options']['BASIC'],
        "Basic Premium")
        self.assertIsInstance(data['individualMedicalPolicyOptions'], dict)
