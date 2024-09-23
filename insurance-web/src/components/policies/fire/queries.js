import gql from "graphql-tag"

export const CREATE_FIRE_POLICY=gql`
mutation createFirePolicy(
    $debitNoteNo: String,
    $policyNo: String
    $individualClient: String
    $transactionDate:Date
    $insuranceCompany:String
    $startDate:Date
    $endDate:Date
    $renewalDate:Date
    $commissionRate:Float
    $transactionType:String
    $premiumType:String
    $corporateClient:String
    $properties:[PropertyInput]
    
  ) {
    createFirePolicy(input:{
      debitNoteNo: $debitNoteNo
      policyNo: $policyNo
      individualClient: $individualClient
      transactionDate: $transactionDate
      insuranceCompany:$insuranceCompany
      startDate:$startDate
      endDate:$endDate
      renewalDate: $renewalDate
      commissionRate:$commissionRate
      transactionType:$transactionType
      premiumType:$premiumType
      corporateClient:$corporateClient
      properties:$properties
    }){
      status
      message
      firePolicy{
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
        additionalPremiums{
          deletedAt
          id
          premium
          commissionRate
          minimumAmount
          
        }
        
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
          status
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

export const UPDATE_FIRE_POLICY=gql`
mutation updateFirePolicy (
    $id:String!
    $patch:FirePolicyInput!
  ){
    updateFirePolicy(
      id:$id
      input:$patch
    ){
      status
      message
      firePolicy{
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
          corporateClient{
            deletedAt
            id
            name
            email
            phoneNumber
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

export const UPDATE_FIRE_PROPERTY=gql`
mutation updateFirePolicyProperty (
  $propertyId:String!
  $policyId:String!
  $patch:PropertyInput!
){
updateFirePolicyProperty(
  propertyId:$propertyId
  policyId:$policyId
  input:$patch
){
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
`

export const GET_FIRE_POLICIES=gql`
query firePolicies {
  firePolicies(search:"")
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
      corporateClient{
        deletedAt
        id
        name
        location
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

export const GET_FIRE_POLICY=gql`
query getFirePolicy ($id:String){
  firePolicy{
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
    additionalPremiums{
      deletedAt
      id
      premium
      commissionRate
      minimumAmount
      
    }
    
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
      status
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

export const GET_FIRE_PROPERTY=gql`
query getPackageDetails($id:String) {
  firePolicyProperty(id:$id)
 {id
  createdAt
  name
  description
  value  
  }}
`

export const DELETE_FIRE_POLICY=gql`
mutation deleteFirePolicyProperty(
  $propertyId:String!
  $policyId:String!
) {
  deleteFirePolicyProperty(
    propertyId:$propertyId
    policyId:$policyId
  )
 {message
  status
  }}
`