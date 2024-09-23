from .base import InsuranceCompanyBaseTest
from .mocks import (get_single_insurance_company_query,
                    list_insurance_companies_query,
                    search_insurance_companies_query)


class TestGetListInsuranceCompany(InsuranceCompanyBaseTest):
    """
    List insurance company tests
    """

    def test_get_insurance_company_succeeds(self):
        """
        Test get individual client details using individual client ID
        """
        res = self.create_insurance_company()
        response = self.client.execute(
            get_single_insurance_company_query,
            {"id": res.data['createInsuranceCompany']['insuranceCompany']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['insuranceCompany']['name'], "Jubilee insurance")
        self.assertEqual(data['insuranceCompany']['email'], "test@gmail.com")

    def test_list_insurance_companies_succeeds(self):
        """
        Test get individual insurance companies details
        """
        self.create_insurance_company()
        response = self.client.execute(list_insurance_companies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertIsInstance(data['insuranceCompanies']['items'], list)
        self.assertEqual(data['insuranceCompanies']['pages'], 3)
        self.assertEqual(data['insuranceCompanies']['hasNext'], True)


    def test_search_insurance_companies_succeeds(self):
        """
        Test search  insurance companies details
        """
        self.create_insurance_company()
        response = self.client.execute(search_insurance_companies_query)
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertIsInstance(data['insuranceCompanies']['items'], list)
        self.assertEqual(data['insuranceCompanies']['pages'], 1)
        self.assertEqual(data['insuranceCompanies']['hasNext'], False)
