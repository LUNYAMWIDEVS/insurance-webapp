# Mutations

personal_accident_policy_mutation = """mutation createPersonalAccident(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createPersonalAccident(
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
    benefitLimits: ["HEARING"]
  }){
    status
    message
    personalAccident{
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
        benefitLimits
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

personal_accident_update_mutation = """mutation updatePersonalAccident(
  $id: String!,
  $individualClient: String,
  $insuranceCompany: String) {
  updatePersonalAccident(
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
    benefitLimits:["PERMDISS", "TEMPDISS"]
  }){
    status
    message
    personalAccident{
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
        benefitLimits
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

get_single_personal_accident_query = """query getPersonalAccident(
  $id: String!,
) {
    personalAccident(id: $id)
    {
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
      benefitLimits
      agency{
        id
        createdAt
        updatedAt
        name
        boxNumber
      }
      individualClient{
        deletedAt
        id
        firstName
        lastName
        email
      }
    insuranceCompany{
      id
      name
      contactPerson
      physicalAddress
    }
    }}"""
list_personal_accidents_query = """query getPersonalAccidents {
    personalAccidents(page:1, limit:1, search:"Hearing")
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
        benefitLimits
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

personal_accident_options = """query getPersonalAccidentOptions {
    personalAccidentOptions}"""