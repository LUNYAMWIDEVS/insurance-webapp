# Mutations

domestic_package_policy_mutation = """mutation createDomesticPackage(
  $individualClient: String!,
  $insuranceCompany: String!,) {
  createDomesticPackage(
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
    packageDetails: {
      buildings: ["Building 1", "Building 2"]
      contents: ["Content 1", "Content 2"]
      allRisks: ["Risk 1", "Risk 2"]
      workManInjury: ["Injury 1", "Ingury 2"]
      ownerLiability: ["Liability 1", "Liability 2"]
      occupiersLiability: ["Liability 1", "Liability 2"]
    }
  }){
    status
    message
      domesticPackage{
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
        packageDetails{
          id
          createdAt
          buildings
          contents
          workManInjury
          ownerLiability
          occupiersLiability
          allRisks
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
domestic_package_update_details_mutation = """
mutation updateDomesticPackageDetails($id: String!) {
  updateDomesticPackageDetails(
    id: $id
    input:{
      buildings: ["Building 1", "Building 2"]
      contents: ["Content 1", "Content 2"]
      allRisks: ["Risk 1", "Risk 2"]
      workManInjury: ["Injury 1", "Ingury 2"]
      ownerLiability: ["Liability 1", "Liability 2"]
      occupiersLiability: ["Liability 1", "Liability 2"]
    }){
    status
    message
    packageDetails{
      id
      createdAt
      updatedAt
      buildings
      contents
      workManInjury
      ownerLiability
      occupiersLiability
      allRisks
    }
    }}
"""
domestic_package_update_mutation = """mutation updateDomesticPackage(
  $id: String!,
  $individualClient: String,
  $insuranceCompany: String) {
  updateDomesticPackage(
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
    packageDetails: {
      buildings: ["Building 1", "Building 2"]
      contents: ["Content 1", "Content 2"]
      allRisks: ["Risk 1", "Risk 2"]
      workManInjury: ["Injury 1", "Ingury 2"]
      ownerLiability: ["Liability 1", "Liability 2"]
      occupiersLiability: ["Liability 1", "Liability 2"]
    }
  }){
    status
    message
    domesticPackage{
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
        packageDetails{
          id
          createdAt
          buildings
          contents
          workManInjury
          ownerLiability
          occupiersLiability
          allRisks
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
get_single_domestic_package_details_query = """ getPackageDetails($id: String!){
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
get_single_domestic_package_query = """query getDomesticPackage(
  $id: String!,
) {
    domesticPackage(id: $id)
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
        packageDetails{
          id
          createdAt
          buildings
          contents
          workManInjury
          ownerLiability
          occupiersLiability
          allRisks
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

list_domestic_packages_query = """query getDomesticPackages {
    domesticPackages(page:1, limit:1, search:"Liability")
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
        packageDetails{
          id
          createdAt
          buildings
          contents
          workManInjury
          ownerLiability
          occupiersLiability
          allRisks
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

domestic_package_options = """query getDomesticPackageOptions {
    domesticPackageOptions}"""