from .base import ProfessionalIndemnityBaseTest
from .mocks import (get_single_prof_ind_query,
                    search_prof_indemnities_query,
                    list_prof_indemnities_query,
                    prof_ind_options)


class TestGetListMotorPolicy(ProfessionalIndemnityBaseTest):
    """
    List motor policy tests
    """

    def test_get_prof_ind_succeeds(self):
        """
        Test get motor policy details using motor policy ID
        """
        policy, client, insurance_company = self.create_prof_ind_policy()
        response = self.client.execute(
            get_single_prof_ind_query,
            {"id": policy.data['createProfessionalIndemnity']['professionalIndemnity']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           data['professionalIndemnity']['individualClient']['id'])

    def test_list_prof_indemnities_succeeds(self):
        """
        Test get professional indemnity policies details
        """
        self.create_prof_ind_policy()
        response = self.client.execute(list_prof_indemnities_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['professionalIndemnities']['items'][0]['policyNo'], "KJB45654VJGsdfY22")
        self.assertEqual(data['professionalIndemnities']['pages'], 1)

    def test_search_prof_indemnities_succeeds(self):
        """
        Test search professional indemnity policies details
        """
        policy, client, insurance_company = self.create_prof_ind_policy()
        response = self.client.execute(search_prof_indemnities_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertIsInstance(data['professionalIndemnities']['items'], list)
        self.assertEqual(data['professionalIndemnities']['pages'], 1)

    def test_get_prof_ind_options_succeeds(self):
        """
        Test get motor policy options
        """
        self.create_and_activate_admin()
        response = self.client.execute(prof_ind_options)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['professionalIndemnityOptions']['specialty_class_options']['DERM'],
        "Dermatologists")
        self.assertIsInstance(data['professionalIndemnityOptions'], dict)
