from ...authentication.tests.base import BaseTest
from .mocks import corporate_client_mutation, individual_client_mutation

class ClientBaseTest(BaseTest):
    """
    API base test case
    """
    def create_individual_client(self):
        self.create_and_activate_admin()
        return self.client.execute(individual_client_mutation)

    def create_corporate_client(self):
        self.create_and_activate_admin()
        return self.client.execute(corporate_client_mutation)
