
from .mocks import fire_policy_mutation
from app.api.client.tests.mocks import individual_client_mutation

from app.api.client.tests.base import ClientBaseTest
from app.api.insurancecompany.models import InsuranceCompany

class FirePolicyBaseTest(ClientBaseTest):
    """
    API base test case
    """
    def create_fire_policy(self):
        self.create_and_activate_admin()
        insurance_company = InsuranceCompany.objects.filter().first()
        client = self.client.execute(individual_client_mutation).data


        response = self.client.execute(
            fire_policy_mutation,
            {"insuranceCompany": insurance_company.id,
            "individualClient":client['createIndividualClient']['individualClient']['id']})
        return response, client, insurance_company
