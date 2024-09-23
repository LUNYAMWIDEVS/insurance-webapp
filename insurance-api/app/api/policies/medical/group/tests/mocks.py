# Mutations

individual_medical_policy_mutation = """mutation createIndividualMedicalIns(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createIndividualMedicalIns(
    input:{
    individualClient: $individualClient
    insuranceCompany: $insuranceCompany
    transactionDate: "2020-06-17"
    debitNoteNo: "KJB45654VJGsdfY22"
    policyNo: "KJB45654VJGsdfY22"
    startDate: "2020-06-17"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    commissionRate:0.8
    commissionAmount:3253
    transactionType: "NEW"
    premiumType: "BASIC"
    medicalInsurance: {
      inpatientLimit:1000000
      outpatientLimit:100000
      familySize: 4
      dependants:[
        {
          firstName:"Hesbon"
          lastName: "Kiptoo"
          age:12
        },
        {
          firstName:"Hello",
          lastName:"Her"
          age:15
        }
      ]
    }
  }){
    status
    message
    individualMedicalIns
     {
      id
      createdAt
      updatedAt
      policyNo
      transactionDate
      premiumType
      startDate
      endDate
      renewalDate
      transactionType
      medicalInsurance{
        id
        createdAt
        familySize
        dependants
        familySize
        inpatientLimit
        outpatientLimit

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

individual_medical_update_mutation = """mutation updateIndividualMedicalIns(
  $id: String!,
  $individualClient: String,
  $insuranceCompany: String) {
  updateIndividualMedicalIns(
    id: $id
    input:{
    individualClient: $individualClient
    insuranceCompany: $insuranceCompany
    transactionDate: "2020-06-17"
    startDate: "2020-06-17"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    commissionRate:0.8
    commissionAmount:3253
    transactionType: "NEW"
    premiumType: "BASIC"
    medicalInsurance: {
      inpatientLimit:1000000
      outpatientLimit:100000
      familySize: 4
      dependants:[
        {
          firstName:"Hesbon"
          lastName: "Hesbon"
          age:12
        },
        {
          firstName:"Hello",
          lastName:"Her"
          age:15
        }
      ]
    }
  }){
    status
    message
    individualMedicalIns
     {
      id
      createdAt
      updatedAt
      policyNo
      transactionDate
      premiumType
      startDate
      endDate
      renewalDate
      transactionType
      medicalInsurance{
        id
        createdAt
        familySize
        dependants
        familySize
        inpatientLimit
        outpatientLimit

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
get_single_group_medical_query = """query getIndividualMedicalPolicy(
  $id: String!,
) {
    individualMedicalPolicy(id: $id)
    {
      id
      createdAt
      updatedAt
      policyNo
      transactionDate
      premiumType
      startDate
      endDate
      renewalDate
      transactionType
      medicalInsurance{
        id
        createdAt
        familySize
        dependants
        familySize
        inpatientLimit
        outpatientLimit

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

    }}
    }"""

list_prof_indemnities_query = """ query getIndividualMedicalPolicies {
    individualMedicalPolicies(page:2, limit:1, search:"Hello")
     {
      count
      page
      pages
      hasNext
      hasPrev
      items{
      id
      createdAt
      updatedAt
      policyNo
      transactionDate
      premiumType
      startDate
      endDate
      renewalDate
      transactionType
      medicalInsurance{
        id
        createdAt
        familySize
        dependants
        familySize
        inpatientLimit
        outpatientLimit

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

    }}
    }}
"""
search_prof_indemnities_query = """ query getIndividualMedicalPolicies {
    individualMedicalPolicies(search:"Hello")
     {
      count
      page
      pages
      hasNext
      hasPrev
      items{
      id
      createdAt
      updatedAt
      policyNo
      transactionDate
      premiumType
      startDate
      endDate
      renewalDate
      transactionType
      medicalInsurance{
        id
        createdAt
        familySize
        dependants
        familySize
        inpatientLimit
        outpatientLimit

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

    }}
    }}
"""
individual_medical_options = """query getIndividualMedicalPolicyOptions {
    individualMedicalPolicyOptions}"""