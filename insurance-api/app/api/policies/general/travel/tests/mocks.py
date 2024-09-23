# Mutations

travel_policy_mutation = """mutation createTravelPolicy(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createTravelPolicy(
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
    travelDetails: {
      option: "Travel optio"
      passportNo: 1234567
      dateOfTravel: "2020-12-17"
      countriesOfTravel: ["Kenya", "Norway"]
      modesOfTravel: ["Plane", "Ship"]
      reasonsOfTravel: ["Work", "Having fun"]
      nextOfKin:[{
        firstName: "Hesbon"
        lastName: "Maiyo"
        relationship: "Brother"
        email: "hesbon@dev.com"
        phoneNumber: "+2547123456"
      },
      {
        firstName: "Maiyo"
        lastName: "Kip"
        relationship: "Brother"
        email: "kip@dev.com"
        phoneNumber: "+254712345"
      }]
    }
  }){
    status
    message
    travelPolicy{
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
        travelDetails{
          id
          createdAt
          option
          passportNo
          dateOfTravel
          countriesOfTravel
          modesOfTravel
          nextOfKin
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
travel_update_details_mutation = """
mutation updateTravelPolicyDetails($id: String!) {
  updateTravelPolicyDetails(
    id: $id
    input:{
      option: "Travel optio"
      passportNo: 1234567
      dateOfTravel: "2020-12-17"
      countriesOfTravel: ["Kenya", "Norway"]
      modesOfTravel: ["Plane", "Ship"]
      reasonsOfTravel: ["Work", "Having fun"]
      nextOfKin:[{
        firstName: "Hesbon"
        lastName: "Maiyo"
        relationship: "Brother"
        email: "hesbon@dev.com"
        phoneNumber: "+2547123456"
      },
      {
        firstName: "Test"
        lastName: "Kip"
        relationship: "Brother"
        email: "kip@dev.com"
        phoneNumber: "+254712345"
      }]
    }){
    status
    message
    travelPolicyDetails{
      id
      createdAt
      option
      passportNo
      dateOfTravel
      countriesOfTravel
      modesOfTravel
      nextOfKin
      }
    }}
"""
travel_update_mutation = """mutation updateTravelPolicy(
  $id: String!,
  $individualClient: String,
  $insuranceCompany: String) {
  updateTravelPolicy(
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
    travelPolicy{
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
        travelDetails{
          id
          createdAt
          option
          passportNo
          dateOfTravel
          countriesOfTravel
          modesOfTravel
          nextOfKin
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
get_single_travel_details_query = """ travelPolicyDetails($id: String!){
  travelPolicyDetails(id:$id){id
    createdAt
    option
    passportNo
    dateOfTravel
    countriesOfTravel
    modesOfTravel
    nextOfKin
    }
}
"""
get_single_travel_query = """query getTravel(
  $id: String!,
) {
    travelPolicy(id: $id)
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
        travelDetails{
          id
          createdAt
          option
          passportNo
          dateOfTravel
          countriesOfTravel
          modesOfTravel
          nextOfKin
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

list_travels_query = """query travelPolicies {
    travelPolicies(page:1, limit:1, search:"Ship")
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
        travelDetails{
          id
          createdAt
          option
          passportNo
          dateOfTravel
          countriesOfTravel
          modesOfTravel
          nextOfKin
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

travel_options = """query getTravelOptions {
    travelPolicyOptions}"""