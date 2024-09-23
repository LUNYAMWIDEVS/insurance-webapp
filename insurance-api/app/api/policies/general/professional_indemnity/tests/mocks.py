# Mutations

prof_ind_policy_mutation = """mutation createProfessionalIndemnity(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createProfessionalIndemnity(
    input:{
    individualClient: $individualClient
    insuranceCompany: $insuranceCompany
    startDate: "2020-06-17"
    transactionDate: "2020-06-17"
    debitNoteNo: "KJB45654VJGsdfY"
    policyNo: "KJB45654VJGsdfY22"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    sumInsured: 127085.90
    excessAmount:123123124
    levies:23425
    totalPremium:3465346
    commissionRate:0.8
    commissionAmount:3253
    transactionType: "NEW"
    premiumType: "BASIC"
    specialtyClass:"DEL"
  }){
    status
    message
     professionalIndemnity{
               id
        createdAt
        updatedAt
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        sumInsured
        excessAmount
        levies
        totalPremium
        commissionRate
        commissionAmount
        transactionType
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

prof_ind_update_mutation = """mutation updateProfessionalIndemnity(
  $id: String!,
  $individualClient: String,
  $insuranceCompany: String) {
  updateProfessionalIndemnity(
    id: $id
    input:{
    individualClient: $individualClient
    insuranceCompany: $insuranceCompany
    startDate: "2020-06-17"
    transactionDate: "2020-06-17"
    policyNo: "KJB45654VJGsdfY2233"
    endDate: "2020-10-17"
    renewalDate: "2020-12-17"
    sumInsured: 127085.90
    excessAmount:123123124
    levies:23425
    totalPremium:3465346
    commissionRate:0.8
    commissionAmount:3253
    transactionType: "RENEW"
    premiumType: "BASIC"
    specialtyClass:"DEL"
  }){
    status
    message
     professionalIndemnity{
               id
        createdAt
        updatedAt
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        sumInsured
        excessAmount
        levies
        totalPremium
        commissionRate
        commissionAmount
        transactionType
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
get_single_prof_ind_query = """query getProfessionalIndemnity(
  $id: String!,
) {
    professionalIndemnity(id: $id)
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
      sumInsured
      excessAmount
      levies
      totalPremium
      commissionRate
      commissionAmount
      transactionType
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

list_prof_indemnities_query = """query ProfessionalIndemnities {
    professionalIndemnities(page:2, limit:1, search:"BASIC")
    {
      count
      pages
      hasNext
      hasPrev
      items
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
      sumInsured
      excessAmount
      levies
      totalPremium
      commissionRate
      commissionAmount
      transactionType
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
search_prof_indemnities_query = """query ProfessionalIndemnities {
    professionalIndemnities (search:"individual@gmail.com")
    {
      count
      pages
      hasNext
      hasPrev
      items
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
      sumInsured
      excessAmount
      levies
      totalPremium
      commissionRate
      commissionAmount
      transactionType
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
prof_ind_options = """query getProfessionalIndemnityOptions {
    professionalIndemnityOptions}"""