# Mutations

motor_policy_mutation = """mutation createMotorPolicy(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createMotorPolicy(input:{
    debitNoteNo: "KJB45654VJGYC"
    policyNo: "KJB45654VJGY22"
    individualClient: $individualClient
    transactionDate: "2020-06-17"
    insuranceCompany: $insuranceCompany
    startDate: "2020-06-17"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    insuranceClass: "COMM_GEN"
    transactionType: "NEW"
    withholdingTax:10
    policyCommissionRate:2.4
    commissionRate: 1.9
    minimumPremiumAmount: 20000.00
    premiumType: "BASIC"
    additionalBenefits: [
      {
        benefit: "EXCESS"
        commissionRate:0.8
      }
    ]
    additionalPremiums:[
      {
        premium: "STAMPD"
        minimumAmount: 40
      }
    ]
    vehicles: [{
      registrationNo: "KCT 234 K"
      make: "Toyota"
      model: "Corola"
      value: 1000000
      body: "SUV"
      color: "Red"
      chassisNo: "HGVhvch543HGVC"
      cc: 1200
      engineNo: "JGC4553VCHF"
      seatingCapacity: 3
      tonnage: 1.2
      yearOfManufacture: 2020
    }]
  }){
    status
    message
     motorPolicy{
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        additionalBenefits{
          id
          benefit
          commissionRate
        }
        additionalPremiums{
          id
          deletedAt
          premium
          commissionRate
          minimumAmount
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        value
        vehicles{
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient{
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency{
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      insuranceCompany{
        id
        name
        contactPerson
        physicalAddress
      }
    }}}"""

motor_additional_benefits_update_mutation = """mutation updateAdditionalBenefit($id: String!) {
  updateAdditionalBenefit(
    id:$id
    input:{
        benefit: "EXCESS"
        commissionRate:0.8
      }){
    status
    message
    additionalBenefit{
        id
        benefit
        commissionRate
      }

    }}
"""
additional_premium_update_mutation = """mutation updateAdditionalPremium ($id: String!) {
  updateAdditionalPremium(
    id: $id
    input:{
        premium: "STAMPD"
        commissionRate:0.8
       minimumAmount: 40.0
      }){
    status
    message
    additionalPremium{
        id
        premium
        commissionRate
        minimumAmount
      }

    }}"""

additional_premium_delete_mutation = """mutation deleteAdditionalPremium($id: [String]!) {
  deleteAdditionalPremium(id:$id){
    status
    message
    }}"""

additional_benefit_delete_mutation = """mutation deleteAdditionalBenefit($id: [String]!) {
  deleteAdditionalBenefit(id:$id){
    status
    message
    }}"""

motor_policy_update_mutation = """mutation updateMotorPolicy(
  $id: String!,
  $individualClient: String!,
  $insuranceCompany: String!) {
  updateMotorPolicy(
    id: $id
    input:{
    individualClient: $individualClient
    transactionDate: "2020-06-17"
    insuranceCompany: $insuranceCompany
    startDate: "2020-06-17"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    insuranceClass: "COMM_GEN"
    transactionType: "NEW"
    premiumType: "BASIC"
    additionalBenefits: [
      {
        benefit: "EXCESS"
        commissionRate:0.8
      }
    ]
    vehicles: [{
      registrationNo: "KCT 234 K"
      make: "Toyota"
      model: "Corola"
      value: 1000000
      body: "SUV"
      color: "Red"
      chassisNo: "HGVhvch543HGVC"
      cc: 1200
      engineNo: "JGC4553VCHF"
      seatingCapacity: 3
      tonnage: 1.2
      yearOfManufacture: 2020
    }]
  }){
    status
    message
     motorPolicy{
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        additionalBenefits{
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        value
        vehicles{
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient{
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency{
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      insuranceCompany{
        id
        name
        contactPerson
        physicalAddress
      }
    }}}"""
# Queries
get_single_motor_policy_query = """query getMotorPolicy(
  $id: String!,
) {
    motorPolicy(id: $id)
    {
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        additionalBenefits{
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        value
        vehicles{
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient{
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency{
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      insuranceCompany{
        id
        name
        contactPerson
        physicalAddress
      }
    }}"""

list_motor_policies_query = """query getMotorPolicies {
    motorPolicies
    {
      count
      pages
      hasNext
      hasPrev
      items
      {
        id
        createdAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        additionalBenefits{
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        vehicles{
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient{
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency{
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      insuranceCompany{
        id
        name
        contactPerson
        physicalAddress
      }
      }
    }}
"""
search_motor_policies_query = """  query getMotorPolicies {
    motorPolicies (search:"Corola")
    {
      count
      pages
      hasNext
      hasPrev
      items
      {
        id
        createdAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        additionalBenefits{
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        vehicles{
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient{
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency{
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      insuranceCompany{
        id
        name
        contactPerson
        physicalAddress
      }
      }
    }}"""
motor_policy_options = """query getMotorPolicyOptions {
    motorPolicyOptions

      }"""