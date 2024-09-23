import graphene

from app.api.authentication.mutations import Mutation as auth_mutation
from app.api.agency.mutations import Mutation as agency_mutation
from app.api.authentication.query import Query as user_query
from app.api.client.mutation import Mutation as client_mutation
from app.api.client.query import Query as client_query
from app.api.insurancecompany.mutation import Mutation as insurance_company_mutation
from app.api.insurancecompany.query import Query as insurance_company_query
from app.api.policies.general.motor.mutation import Mutation as motor_policy_mutation
from app.api.policies.general.motor.query import Query as motor_policy_query
from app.api.policies.general.professional_indemnity.mutation import (
    Mutation as professional_indemnity_mutation,
)
from app.api.policies.general.professional_indemnity.query import (
    Query as professional_indemnity_query,
)
from app.api.policies.medical.individual.query import (
    Query as individual_medical_policy_query,
)
from app.api.policies.medical.individual.mutation import (
    Mutation as individual_medical_policy_mutation,
)
from app.api.policies.medical.group.query import Query as group_medical_policy_query
from app.api.policies.medical.group.mutation import (
    Mutation as group_medical_policy_mutation,
)
from app.api.policies.general.computerElectronics.mutation import (
    Mutation as computer_electronic_mutation,
)
from app.api.policies.general.computerElectronics.query import (
    Query as computer_electronic_query,
)
from app.api.policies.general.consequentialLoss.mutation import (
    Mutation as consequential_mutation,
)
from app.api.policies.general.consequentialLoss.query import (
    Query as consequential_query,
)
from app.api.policies.general.contractorsRisks.mutation import (
    Mutation as contractors_mutation,
)
from app.api.policies.general.contractorsRisks.query import Query as contractors_query
from app.api.policies.general.domestic_package.mutation import (
    Mutation as domestic_package_policy_mutation,
)
from app.api.policies.general.domestic_package.query import (
    Query as domestic_package_policy_query,
)
from app.api.policies.general.electronicEquipments.mutation import (
    Mutation as electronic_mutation,
)
from app.api.policies.general.electronicEquipments.query import (
    Query as electronic_query,
)
from app.api.policies.general.goodsTransit.mutation import (
    Mutation as goods_transit_mutation,
)
from app.api.policies.general.goodsTransit.query import Query as goods_transit_query
from app.api.policies.general.machineryBreakdown.mutation import (
    Mutation as machinery_mutation,
)
from app.api.policies.general.machineryBreakdown.query import Query as machinery_query
from app.api.policies.general.money.mutation import Mutation as money_mutation
from app.api.policies.general.money.query import Query as money_query
from app.api.policies.general.plateGlass.mutation import (
    Mutation as plate_glass_mutation,
)
from app.api.policies.general.plateGlass.query import Query as plate_glass_query
from app.api.policies.general.personal_accident.mutation import (
    Mutation as personal_accident_policy_mutation,
)
from app.api.policies.general.personal_accident.query import (
    Query as personal_accident_policy_query,
)
from app.api.policies.general.travel.mutation import Mutation as travel_policy_mutation
from app.api.policies.general.travel.query import Query as travel_policy_query
from app.api.policies.general.fire.mutation import Mutation as fire_policy_mutation
from app.api.policies.general.fire.query import Query as fire_policy_query
from app.api.policies.general.politicalViolence.mutation import (
    Mutation as political_mutation,
)
from app.api.policies.general.politicalViolence.query import Query as political_query
from app.api.policies.general.burglary.mutation import (
    Mutation as burglary_policy_mutation,
)
from app.api.policies.general.industrialAllRisks.mutation import (
    Mutation as industrial_mutation,
)
from app.api.policies.general.industrialAllRisks.query import Query as industrial_query
from app.api.policies.general.burglary.query import Query as burglary_policy_query
from app.api.policies.general.wiba.mutation import Mutation as wiba_policy_mutation
from app.api.policies.general.wiba.query import Query as wiba_policy_query
from app.api.crm.mutations import Mutation as contact_person_mutation
from app.api.crm.query import Query as contact_person_query
from app.api.receipt.queries import Query as receipt_queries
from app.api.receipt.mutations import Mutation as receipt_mutation
from app.api.policy_renewal.query import Query as policy_renewals_query
from app.api.policy_renewal.mutation import Mutation as policy_renewal_mutation
from app.api.policy_addition.mutation import Mutation as policy_addition_mutation
from app.api.policy_addition.query import Query as policy_addition_query
from app.api.policy_deletion.mutation import Mutation as policy_deletion_mutation
from app.api.policy_deletion.query import Query as policy_deletion_query


class Query(
    user_query,
    client_query,
    motor_policy_query,
    insurance_company_query,
    professional_indemnity_query,
    individual_medical_policy_query,
    group_medical_policy_query,
    domestic_package_policy_query,
    personal_accident_policy_query,
    travel_policy_query,
    fire_policy_query,
    contact_person_query,
    consequential_query,
    contractors_query,
    electronic_query,
    goods_transit_query,
    machinery_query,
    money_query,
    plate_glass_query,
    political_query,
    industrial_query,
    burglary_policy_query,
    computer_electronic_query,
    receipt_queries,
    wiba_policy_query,
    policy_renewals_query,
    policy_addition_query,
    policy_deletion_query,
    graphene.ObjectType,
):
    """
    This class will inherit from multiple Queries
    as we begin to add more apps to our project
    """

    pass


class Mutation(
    auth_mutation,
    agency_mutation,
    client_mutation,
    insurance_company_mutation,
    motor_policy_mutation,
    professional_indemnity_mutation,
    individual_medical_policy_mutation,
    group_medical_policy_mutation,
    domestic_package_policy_mutation,
    personal_accident_policy_mutation,
    travel_policy_mutation,
    fire_policy_mutation,
    receipt_mutation,
    burglary_policy_mutation,
    contact_person_mutation,
    electronic_mutation,
    goods_transit_mutation,
    machinery_mutation,
    money_mutation,
    plate_glass_mutation,
    political_mutation,
    industrial_mutation,
    computer_electronic_mutation,
    consequential_mutation,
    contractors_mutation,
    wiba_policy_mutation,
    policy_renewal_mutation,
    policy_addition_mutation,
    policy_deletion_mutation,
    graphene.ObjectType,
):
    """
    This class will inherit from multiple Queries
    as we begin to add more apps to our project
    """

    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
