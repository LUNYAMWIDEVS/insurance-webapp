import gql from 'graphql-tag';

export const GET_RECEIPT = gql`
query getMotorReceipt($id:String){
  motorReceipt(id:$id)
  {
    id
    receiptNumber
    date
    transactionDate
    createdAt
    amountWords
    amountFigures
    issuedBy{
      id
      firstName
      lastName
      email
    }
    paymentMode
    policy{
      id
      policyNo
      individualClient {
        deletedAt
        id
        clientNumber
        firstName
        lastName
        email
        kraPin
        phoneNumber
        postalAddress
        surname
        idNumber
        occupation
        dateOfBirth
        town
      }
      corporateClient {
        id
        name
        email
        email
        kraPin
        phoneNumber
        postalAddress
        town
        clientNumber
      }
    }
  }
}
`
export const GET_RECEIPTS = gql`
query getMotorReceipts ($search:String, $page:Int, $limit:Int){
  motorReceipts(
    search:$search,
    page:$page,
    limit:$limit)
  {
    count
    pages
    hasNext
    hasPrev
    items
    {
      id
      receiptNumber
      date
      createdAt
      transactionDate
      amountWords
      amountFigures
      issuedBy{
        id
        firstName
        lastName
        email
      }
      paymentMode
      policy{
        id
        policyNo

      }


    }}}
`

export const ADD_NEW_RECEIPT = gql`
mutation createReceipt (
  $transactionDate:Date
  $amountWords:String
  $amountFigures:Float
  $paymentMode:String
  $policyNumber:String!
){
  createMotorReceipt(input:{
    transactionDate:$transactionDate
    amountWords:$amountWords
    amountFigures:$amountFigures
    paymentMode:$paymentMode
    policyNumber:$policyNumber

  }){
    receipt{
      id
      receiptNumber
      date
      transactionDate
      createdAt
      amountWords
      amountFigures
      paymentMode
      policy{
        id
        policyNo

      }
    }

  }
}
`

export const UPDATE_RECEIPT = gql`
mutation updateMotorPolicyReceipt(
  $id:String!
  $receiptNumber:String
  $date:Date
  $transactionDate:Date
  $amountWords:String
  $amountFigures:Float
  $issuedBy:String
  $paymentMode:String
  $policyNumber:String
) {
  updateMotorReceipt(
    id:$id
    input:{
    receiptNumber:$receiptNumber
    date:$date
    transactionDate:$transactionDate
    amountWords:$amountWords
    amountFigures:$amountFigures
    issuedBy:$issuedBy
    paymentMode:$paymentMode
    policyNumber:$policyNumber
  }){
    status
    message
    receipt{
      id
      receiptNumber
      date
      transactionDate
      amountWords
      amountFigures
      issuedBy
      paymentMode
      policy{
        id
        policyNo

      }
    }
  }
}
`

export const GET_RECEIPT_OPTS = gql`
query getReceiptOptions {
  receiptOptions}`

