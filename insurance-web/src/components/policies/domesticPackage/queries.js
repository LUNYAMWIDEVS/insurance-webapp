import gql from "graphql-tag";

export const CREATE_DOMESTIC_PACKAGE = gql`
mutation createDomesticPackage(
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
    $packageDetails:DomesticPackageDetailsInput
) {
createDomesticPackage(input:{
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
    packageDetails: $packageDetails
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
    }}}
`