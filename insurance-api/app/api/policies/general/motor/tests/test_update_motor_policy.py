from .base import MotorPolicyBaseTest
from .mocks import (motor_policy_update_mutation,
                    motor_additional_benefits_update_mutation,
                    additional_premium_update_mutation,
                    additional_premium_delete_mutation,
                    additional_benefit_delete_mutation)


class TestUpdateMotorPolicy(MotorPolicyBaseTest):
    """
    Update motor policy tests
    """

    def test_update_motor_policy_succeeds(self):
        """
        Test update motor policy with valid data succeeds
        """
        policy, client, insurance_company = self.create_motor_policy()
        response = self.client.execute(
            motor_policy_update_mutation,
            {"id": policy.data['createMotorPolicy']['motorPolicy']['id'],
            "insuranceCompany": insurance_company.id,
            "individualClient": client['createIndividualClient']['individualClient']['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateMotorPolicy']['status'], "Success")
        self.assertEqual(client['createIndividualClient']['individualClient']['id'],
           response.data['updateMotorPolicy']['motorPolicy']['individualClient']['id'])

    def test_update_additional_benefits_succeeds(self):
        """
        Test update additional benefit with valid data succeeds
        """
        policy, _, _ = self.create_motor_policy()
        response = self.client.execute(
            motor_additional_benefits_update_mutation,
            {"id": policy.data['createMotorPolicy']['motorPolicy']['additionalBenefits'][0]['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateAdditionalBenefit']['status'], "Success")

    def test_update_additional_premiums_succeeds(self):
        """
        Test update additional premium with valid data succeeds
        """
        policy, _, _ = self.create_motor_policy()
        response = self.client.execute(
            additional_premium_update_mutation,
            {"id": policy.data['createMotorPolicy']['motorPolicy']['additionalPremiums'][0]['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['updateAdditionalPremium']['status'], "Success")

    def test_delete_additional_premiums_succeeds(self):
        """
        Test delete additional premium with valid data succeeds
        """
        policy, _, _ = self.create_motor_policy()
        response = self.client.execute(
            additional_premium_delete_mutation,
            {"id": policy.data['createMotorPolicy']['motorPolicy']['additionalPremiums'][0]['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['deleteAdditionalPremium']['status'], "Success")

    def test_delete_additional_benefits_succeeds(self):
        """
        Test delete additional benefit with valid data succeeds
        """
        policy, _, _ = self.create_motor_policy()
        response = self.client.execute(
            additional_benefit_delete_mutation,
            {"id": policy.data['createMotorPolicy']['motorPolicy']['additionalBenefits'][0]['id']})
        self.assertIsNone(response.errors)
        self.assertIsInstance(response.data, dict)
        data = dict(response.data)
        self.assertEqual(data['deleteAdditionalBenefit']['status'], "Success")
