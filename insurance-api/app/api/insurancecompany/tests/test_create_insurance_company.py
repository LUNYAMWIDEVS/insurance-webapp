from .base import InsuranceCompanyBaseTest

class TestCreateClient(InsuranceCompanyBaseTest):
    """
    Insurance company registration tests
    """

    def test_create_insurance_company_succeeds(self):
        """
        Test create insurance company with valid data succeeds
        """
        response = self.create_insurance_company()
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['createInsuranceCompany']['status'], "Success")
        self.assertEqual(data['createInsuranceCompany']['insuranceCompany']['email'], "test@gmail.com")
        self.assertEqual(data['createInsuranceCompany']['insuranceCompany']['name'], 'Jubilee insurance')
