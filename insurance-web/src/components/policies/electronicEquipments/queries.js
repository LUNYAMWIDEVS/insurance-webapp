import gql from "graphql-tag";

export const CREATE_ELECTRONIC_EQUIPMENT = gql`
mutation createElectronicEquipment (
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
    $electronicEquipmentProperties:[ElectronicEquipmentPropertyInput]
){
  createElectronicEquipment(input:{
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
    electronicEquipmentProperties:$electronicEquipmentProperties
  }){
    status
    message
    electronicEquipment{
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
        electronicEquipmentProperties{
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
