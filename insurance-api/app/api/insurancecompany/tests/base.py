
from .mocks import insurance_company_mutation

from ...authentication.tests.base import BaseTest


class InsuranceCompanyBaseTest(BaseTest):
    """
    API base test case
    """
    def create_insurance_company(self):
        self.create_and_activate_admin()
        return self.client.execute(insurance_company_mutation)
