import gql from "graphql-tag";

export const CREATE_MACHINERY_BREAKDOWN=gql`
mutation createMachinreakdown (
    $policyNo:String
    $individualClient:String
    $corporateClient:String
    $transactionDate:Date
    $insuranceCompany:String
    $startDate:Date
    $endDate:Date
    $renewalDate:Date
    $commissionRate:Float
    $transactionType:String
    $premiumType:String
    $machineryBreakdownProperties:[MachineryBreakdownPropertyInput]
){
  createMachineryBreakdown(input:{
    policyNo: $policyNo
    individualClient: $individualClient
    corporateClient:$corporateClient
    transactionDate: $transactionDate
    insuranceCompany:$insuranceCompany
    startDate: $startDate
    endDate: $endDate
    renewalDate: $renewalDate
    commissionRate:$commissionRate
    transactionType: $transactionType
    premiumType: $premiumType
    machineryBreakdownProperties:$machineryBreakdownProperties
  }){
    status
    message
    machineryBreakdown{
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
        machineryBreakdownProperties{
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
        corporateClient{
          deletedAt
          id
          email
          name
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
    }}}
`

export const GET_CONTRACTORS_RISKS=gql`
query computerElectronics {
    contractorsRisks(search:"")
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
        contractorProperties{
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
        corporateClient{
            deletedAt
            id
            name
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

`

export const GET_CONTRACTORS_RISK=gql`
query getContractorsRisk ($id:String){
contractorsRisk(id:$id)
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
        contractorProperties{
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
        corporateClient{
            deletedAt
            id
            name
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
    }}
`

export const GET_CONTRACTORS_RISK_PROPERTY=gql`
query getContractorsRiskProperty ($id:String){
    contractorsRiskProperty(id:$id)
    {
        id
        createdAt
        name
        description
        value  
    }}
`

export const GET_CONTRACTORS_RISK_OPTIONS=gql`
query getContractorRiskOptions {
    contractorsRiskOptions}
`

export const DELETE_CONTRACTORS_RISK=gql`
mutation deleteContractorsRiskProperty(
    $propertyId:String!
    $policyId:String!
) {
    deleteContractorsRiskProperty(
        propertyId:$propertyId
        policyId:$policyId
    )
    {
        message
        status
    }}
`