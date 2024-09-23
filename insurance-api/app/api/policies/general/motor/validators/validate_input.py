# Third party imports
from graphql import GraphQLError
from app.api.helpers.constants import (
    MOTOR_POLICY_REQUIRED_FIELD,
    MOTOR_VEHICLE_REQUIRED_FIELD,
    ADDITIONAL_PREMIUMS_REQUIRED_FIELDS,
)
from app.api.helpers.validate_input import (
    check_empty_fields,
    check_missing_fields,
)
from app.api.helpers.validation_errors import error_dict
from ..models import MotorPolicy, AdditionalBenefit, PolicyDetails, VehicleDetails
from app.api.helpers.validate_object_id import validate_object_id
from app.api.insurancecompany.models import InsuranceCompany
from app.api.client.models import CorporateClient, IndividualClient

from app.api.helpers.choices import InsuranceClasses


from datetime import datetime, timedelta


class MotorPolicyValidations:
    """Validations for the motor policy"""

    def validate_motor_policy_data(self, kwargs, agency):
        """
        Runs all the motor policy data validations in one function
        Args:
            kwargs (dict): request data
            agency (obj): agency object
        Returns:
            input_data (dict): validated data
        """
        check_missing_fields(kwargs, MOTOR_POLICY_REQUIRED_FIELD)

        input_data = {}
        input_data["policy_no"] = kwargs.get("policy_no")
        input_data["transaction_date"] = kwargs.get("transaction_date")
        input_data["start_date"] = kwargs.get("start_date")
        input_data["end_date"] = kwargs.get("end_date")
        input_data["renewal_date"] = kwargs.get("end_date") + timedelta(days=1)
        input_data["commission_rate"] = kwargs.get("commission_rate")
        input_data["insurance_class"] = kwargs.get("insurance_class")
        input_data["minimum_premium_amount"] = kwargs.get("minimum_premium_amount")
        input_data["transaction_type"] = kwargs.get("transaction_type")
        input_data["premium_type"] = kwargs.get("premium_type")
        input_data["policy_commission_rate"] = kwargs.get("policy_commission_rate")
        input_data["insurance_company"] = kwargs.get("insurance_company")
        check_empty_fields(data=input_data)
        input_data["individual_client"] = kwargs.get("individual_client")
        input_data["corporate_client"] = kwargs.get("corporate_client")
        input_data["remarks"] = kwargs.get("remarks", "")
        input_data["policy_details"] = kwargs.get("policy_details", [])
        input_data["policy_detail_set"] = kwargs.get("policy_detail_set", [])
        if input_data["policy_details"]:
            for i in range(len(input_data["policy_details"][0]["fields"])):
                if input_data["policy_details"][0]["fields"][i]["field"] == "value":
                    input_data["value"] = input_data["policy_details"][0]["fields"][i][
                        "value"
                    ]
        else:
            details = input_data["policy_detail_set"][0]["fields"]
            for item in details:
                field = PolicyDetails.objects.get(id=item.field)
                if field.field == "value":
                    input_data["value"] = item.value
        input_data["withholding_tax"] = kwargs.get("withholding_tax", 10)
        input_data["withholding_tax"] = kwargs.get("withholding_tax", 10)
        input_data["additional_premiums"] = kwargs.get("additional_premiums", [])
        # print("input value", input_data["value"])
        if input_data["additional_premiums"]:

            check_missing_fields(
                input_data["additional_premiums"], ADDITIONAL_PREMIUMS_REQUIRED_FIELDS
            )
            self.validate_choice_fields(
                input_data["additional_premiums"],
                dict(MotorPolicy.PremiumType.choices),
                "additional premium",
            )
        self.validate_client_no(input_data)

        if input_data["individual_client"]:
            input_data["individual_client"] = validate_object_id(
                input_data["individual_client"],
                IndividualClient,
                "Individual Client",
                agency,
            )
        if input_data["corporate_client"]:
            input_data["corporate_client"] = validate_object_id(
                input_data["corporate_client"],
                CorporateClient,
                "Corporate Client",
                agency,
            )

        # input_data['value'] = self.get_vehicle_value(input_data)
        self.validate_policy_no(
            input_data["policy_no"], input_data["transaction_type"], agency
        )
        self.validate_choice_fields(
            input_data["insurance_class"],
            dict(InsuranceClasses.choices),
            "insurance class",
        )
        self.validate_choice_fields(
            input_data["transaction_type"],
            dict(MotorPolicy.TransactionType.choices),
            "transaction type",
        )
        self.validate_choice_fields(
            input_data["premium_type"],
            dict(MotorPolicy.PremiumType.choices),
            "premium type",
        )
        input_data["additional_benefits"] = kwargs.get("additional_benefits", [])
        input_data["policy_details"] = kwargs.get("policy_details", [])
        input_data["agency"] = agency
        input_data["additional_benefits"] = self.validate_additional_benefit(
            input_data["additional_benefits"]
        )
        input_data["insurance_company"] = validate_object_id(
            input_data["insurance_company"], InsuranceCompany, "Insurance Company"
        )

        input_data = {k: v for k, v in input_data.items() if v}
        return input_data

    def validate_motor_policy_data_update(self, kwargs, agency, policy):
        """
        Runs all the motor policy data update validations in one function
        Args:
            kwargs (dict): request data
        Returns:
            input_data (dict): validated data
        """
        input_data = {}
        input_data["policy_no"] = kwargs.get("policy_no")
        input_data["policy_details"] = kwargs.get("policy_details", [])
        input_data["policy_detail_set"] = kwargs.get("policy_detail_set", [])
        input_data["insurance_class"] = kwargs.get("insurance_class")
        input_data["transaction_type"] = kwargs.get("transaction_type")
        input_data["premium_type"] = kwargs.get("premium_type")
        input_data["commission_rate"] = kwargs.get("commission_rate")
        input_data["minimum_premium_amount"] = kwargs.get("minimum_premium_amount")
        input_data["insurance_company_id"] = kwargs.get("insurance_company")
        input_data["individual_client"] = kwargs.get("individual_client")
        input_data["corporate_client"] = kwargs.get("corporate_client")
        input_data["additional_premiums"] = kwargs.get("additional_premiums", [])
        input_data["remarks"] = kwargs.get("remarks", "")
        input_data = {k: v for k, v in input_data.items() if v}
        VAL_MAP = {
            "policy_no": {
                "method": self.validate_policy_no,
                "params": [
                    input_data.get("policy_no", ""),
                    kwargs.get("transaction_type", ""),
                    agency,
                    policy,
                ],
            },
            "insurance_class": {
                "method": self.validate_choice_fields,
                "params": [
                    input_data.get("insurance_class", ""),
                    dict(InsuranceClasses.choices),
                    "insurance class",
                ],
            },
            "additional_premiums": {
                "method": self.validate_choice_fields,
                "params": [
                    input_data.get("additional_premiums", ""),
                    dict(MotorPolicy.PremiumType.choices),
                    "additional premimus",
                ],
            },
            "transaction_type": {
                "method": self.validate_choice_fields,
                "params": [
                    input_data.get("insurance_class", ""),
                    dict(InsuranceClasses.choices),
                    "transaction type",
                ],
            },
            "premium_type": {
                "method": self.validate_choice_fields,
                "params": [
                    input_data.get("premium_type", ""),
                    dict(MotorPolicy.PremiumType.choices),
                    "premium type",
                ],
            },
            "insurance_company_id": {
                "method": validate_object_id,
                "params": [
                    input_data.get("insurance_company_id", ""),
                    InsuranceCompany,
                    "Insurance Company",
                ],
            },
        }

        if input_data.get("individual_client"):
            input_data["individual_client"] = validate_object_id(
                input_data["individual_client"],
                IndividualClient,
                "Individual Client",
                agency,
            )
        if input_data.get("corporate_client"):
            input_data["corporate_client"] = validate_object_id(
                input_data["corporate_client"],
                CorporateClient,
                "Corporate Client",
                agency,
            )

        for item in input_data:
            validate = VAL_MAP.get(item)
            if validate:
                validate["method"](*validate["params"])
        input_data["additional_benefits"] = kwargs.get("additional_benefits")
        input_data["additional_benefits"] = self.validate_additional_benefit(
            input_data["additional_benefits"]
        )
        input_data["value"] = kwargs.get("value")
        input_data["transaction_date"] = kwargs.get("transaction_date")
        input_data["start_date"] = kwargs.get("start_date")
        input_data["end_date"] = kwargs.get("end_date")

        input_data = {k: v for k, v in input_data.items() if v}
        return input_data

    def validate_additional_benefit(self, data):
        """
        validate additional benefit
        Args:
            data (list): additional benefits
        Raise:
            raise GraphQLError if the additional benefit is invalid
        """
        if data:
            for benefit in data:
                self.validate_choice_fields(
                    benefit["benefit"],
                    dict(AdditionalBenefit.AdditionalBenefitOps.choices),
                    "additional benefit",
                )
        return data

    def validate_additional_premium(self, data):
        """
        validate additional premium
        Args:
            data (list): additional premiums
        Raise:
            raise GraphQLError if the additional premium is invalid
        """
        if data:
            for premium in data:
                self.validate_choice_fields(
                    premium["premium"],
                    dict(MotorPolicy.PremiumType.choices),
                    "additional premium",
                )
        return data

    def validate_vehicles_ind(self, vehicles, individual_client, agency):
        """
        Checks if the vehicle already exist
        Args:
            individual_client (str): individual client id
            vehicles (list): vehicles data
            agency (obj): insurance agency
        Raise:
            raise GraphQLError if a vehicle already exist
        """
        if individual_client:
            for vehicle in vehicles:
                check_empty_fields(data=vehicle)
                veh = (
                    VehicleDetails.objects.filter(
                        registration_no=vehicle["registration_no"], agency=agency
                    )
                    .order_by("-created_at")
                    .first()
                )
                if veh:
                    policy = (
                        veh.motor_motorpolicy_related.all()
                        .order_by("-updated_at")
                        .first()
                    )
                    if (
                        policy.individual_client
                        and policy.individual_client.id != individual_client
                    ):
                        raise GraphQLError(
                            error_dict["already_exist"].format(
                                f"Vehicle {vehicle['registration_no']}"
                            )
                        )

    def validate_vehicles_cor(self, vehicles, corporate_client, agency):
        """
        Checks if the vehicle already exist
        Args:
            corporate_client (str): corporate client id
            vehicles (list): vehicles data
            agency (obj): insurance agency
        Raise:
            raise GraphQLError if a vehicle already exist
        """
        if corporate_client:
            for vehicle in vehicles:
                check_empty_fields(data=vehicle)
                veh = (
                    VehicleDetails.objects.filter(
                        registration_no=vehicle["registration_no"], agency=agency
                    )
                    .order_by("-created_at")
                    .first()
                )
                if veh:
                    policy = (
                        veh.motor_motorpolicy_related.all()
                        .order_by("-updated_at")
                        .first()
                    )
                    if (
                        policy.corporate_client
                        and policy.corporate_client.id != corporate_client
                    ):
                        raise GraphQLError(
                            error_dict["already_exist"].format(
                                f"Vehicle {vehicle['registration_no']}"
                            )
                        )

    def validate_policy_no(self, policy_no, transaction_type, agency, policy=None):
        """
        Checks if the registration no already exist
        Args:
            policy_no (str): registration no
            individual_client (str): Individual client ID
            transaction_type (str): transaction type
            agency (obj): insurance agency
        Raise:
            raise GraphQLError if registration no already exist
        """
        motor_policy = (
            MotorPolicy.objects.all()
            .order_by("-created_at")
            .filter(policy_no=policy_no, agency=agency)
            .first()
        )
        if motor_policy and policy and motor_policy != policy:
            raise GraphQLError(
                error_dict["already_exist"].format("motor policy number")
            )
        if motor_policy and transaction_type.upper() == "NEW":
            raise GraphQLError(
                error_dict["already_exist"].format("motor policy number")
            )

    def validate_client_no(self, data):
        """
        Checks if the no client is provided
        Args:
            client_no (str): registration no
            data (dict): input data
        Raise:
            raise GraphQLError if no client is provided
        """
        if not data.get("individual_client", "") and not data.get(
            "corporate_client", ""
        ):
            raise GraphQLError(
                error_dict["either_required"].format(
                    "Individual client ID", "Corporate client ID"
                )
            )
        if data.get("individual_client", "") and data.get("corporate_client", ""):
            raise GraphQLError(
                error_dict["either_required"].format(
                    "Individual client ID", "Corporate client ID"
                )
            )

    def validate_choice_fields(self, input_, choices, field):
        """
        Checks if the registration no already exist
        Args:
            input_ (str): registration no
            field (str): field being validated
            required (dict): required
        Raise:
            raise GraphQLError if input not in choices
        """
        if isinstance(input_, list):
            for i in input_:
                if i["premium"] not in choices:
                    raise GraphQLError(
                        error_dict["valid_options"].format(field, [*choices])
                    )
        else:
            if input_ not in choices:
                raise GraphQLError(
                    error_dict["valid_options"].format(field, [*choices])
                )

    def get_vehicle_value(self, input_data):
        """
        Checks if the registration no already exist
        Args:
            input_data (dict): input data
        Raise:
            raise GraphQLError if input not in choices
        """
        value = input_data["value"]
        if not value:
            value = 0
        return value
