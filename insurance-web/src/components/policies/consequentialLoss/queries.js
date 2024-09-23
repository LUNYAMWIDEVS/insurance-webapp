import gql from "graphql-tag";

export const CREATE_CONSEQUENTIAL_LOSS=gql`
mutation createComputerElectronic (
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
    $consequentialLossProperties:[ConsequentialLossPropertyInput]
){
createConsequentialLossPolicy(input:{
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
    consequentialLossProperties:$consequentialLossProperties
}){
    status
    message
    consequentialLossPolicy{
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
        consequentialLossProperties{
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

export const CONSEQUENTIAL_LOSSES=gql`
query computerElectronics {
    consequentialLosses(search:"")
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
        consequentialLossProperties{
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

export const GET_CONSEQUENTIAL_LOSS=gql`
query getComputerElectronic ($id:String){
consequentialLoss(id:$id)
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
        consequentialLossProperties{
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
}
`

export const GET_CONSEQUENTIAL_LOSS_PROPERTY=gql`
query getConsequentialLossProperty ($id:String){
    consequentialLossProperty(id:$id)
    {
        id
        createdAt
        name
        description
        value  
    }
}
`
export const DELETE_CONSEQUENTIAL_LOSS=gql`
mutation deleteConsequentialLoss(
    $propertyId:String!
    $policyId:String!
) {
    deleteConsequentialLossPolicyProperty(
        propertyId:$propertyId
        policyId:$policyId
    )
    {
        message
        status
    }
}
`

export const GET_CONSEQUENTIAL_LOSS_OPTIONS=gql`
query getConsequentialLossOptions {
    consequentialLossOptions}
`