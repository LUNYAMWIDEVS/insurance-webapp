# Mutations

burglary_policy_mutation = """mutation createBurglaryPolicy(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createBurglaryPolicy(
    input:{
    individualClient: $individualClient
    insuranceCompany: $insuranceCompany
    debitNoteNo: "KJB45654VJGYC"
    policyNo: "KJB45654VJGY22"
    transactionDate: "2020-06-17"
    startDate: "2020-06-17"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    commissionRate:0.8
    transactionType: "NEW"
    premiumType: "BASIC"
    properties: [{
      name: "House"
      description: "My house"
      value: 123977.0
    },
    {
      name: "House2"
      description: "My second house"
      value: 323977.0
    }]
  }){
    status
    message
      burglaryPolicy{
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        transactionType
        properties{
          id
          createdAt
          name
          description
          value
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
burglary_policy_update_details_mutation = """
mutation updateBurglaryPolicyProperty($propertyId: String!, $policyId: String!) {
  updateBurglaryPolicyProperty(
    propertyId: $propertyId
    policyId: $policyId
    input:{
      name: "House"
      description: "My updated house"
      value: 123977.0
    }){
    status
    message
    property{
      id
      createdAt
      updatedAt
      name
      description
      value
    }
    }}
"""
burglary_policy_update_mutation = """mutation updateBurglaryPolicy(
  $id: String!,
  $individualClient: String,
  $insuranceCompany: String) {
  updateBurglaryPolicy(
    id: $id
    input:{
    individualClient: $individualClient
    insuranceCompany: $insuranceCompany
    startDate: "2020-06-17"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    commissionRate:0.8
    transactionType: "NEW"
    premiumType: "BASIC"
  }){
    status
    message
    burglaryPolicy{
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        transactionType
        properties{
          id
          createdAt
          name
          description
          value
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
get_single_burglary_policy_details_query = """ getPackageDetails($id: String!){
  packageDetails(id:$id){id
    createdAt
    buildings
    contents
    workManInjury
    ownerLiability
    occupiersLiability
    allRisks
    }
}
"""
get_single_burglary_policy_query = """query getBurglaryPolicy(
  $id: String!,
) {
    burglaryPolicy(id: $id)
    {id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        transactionType
        properties{
          id
          createdAt
          name
          description
          value
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

list_burglary_policies_query = """query getBurglaryPolicies {
    burglaryPolicies(page:1, limit:1, search:"KJB45654VJG")
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
        startDate
        endDate
        renewalDate
        transactionType
        properties{
          id
          createdAt
          name
          description
          value
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

burglary_policy_options = """query getBurglaryPolicyOptions {
    burglaryPolicyOptions}"""