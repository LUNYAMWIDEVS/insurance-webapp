import gql from "graphql-tag";

export const CREATE_COMPUTER_ELECTRONIC = gql`
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
    $computerElectronicProperties:[ComputerElectronicPropertyInput]
){
createComputerElectronic(input:{
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
    computerElectronicProperties:$computerElectronicProperties
}){
    status
    message
    computerElectronic{
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
        computerElectronicProperties{
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

export const GET_COMPUTER_ELECTRONIC=gql`
query getComputerElectronic ($id:String){
    computerElectronic(id:$id)
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
        computerElectronicProperties{
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
    }}
`

export const GET_COMPUTER_ELECTRONICS=gql`
query computerElectronics {
    computerElectronics(search:"")
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
        computerElectronicProperties{
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

export const GET_COMPUTER_ELECTRONIC_PROPERTY=gql`
query getComputerElectronicProperty ($id:String){
    computerElectronicProperty(id:$id)
    {
        id
        createdAt
        name
        description
        value  
    }
}
`

export const DELETE_COMPUTER_ELECTRONIC=gql`
mutation deleteComputerElectronicProperty(
    $propertyId:String!
    $policyId:String!
) {
    deleteComputerElectronicProperty(
        propertyId:$propertyId
        policyId:$policyId
    )
    {
        message
        status
    }
}
`

export const GET_COMPUTER_ELECTRONIC_OPTIONS=gql`
query getComputerElectronicOptions {
    computerElectronicOptions}
`