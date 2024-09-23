from .base import InsuranceCompanyBaseTest
from .mocks import insurance_company_update_mutation


class TestUpdateInsuranceCompany(InsuranceCompanyBaseTest):
    """
    Update insurance company tests
    """

    def test_update_insurance_company_succeeds(self):
        """
        Test update insurance company with valid data succeeds
        """
        res = self.create_insurance_company()
        response = self.client.execute(
            insurance_company_update_mutation,
            {"id": res.data['createInsuranceCompany']['insuranceCompany']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateInsuranceCompany']['status'], "Success")
        self.assertEqual(data['updateInsuranceCompany']['insuranceCompany']['email'],
        "updatedemail@gmail.com")
