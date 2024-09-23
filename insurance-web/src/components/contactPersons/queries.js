import gql from 'graphql-tag';

export const ADD_NEW_CONTACT_PERSON = gql`
mutation createContactPerson
  (
    $name:String!
    $email:String!
    $position:String!
    $gender:String!
    $phoneNumber:String!
    $serviceLine:String
    $dateOfBirth:Date!
    $facebookAccount:String
    $twitterAccount:String
    $instagramAccount:String
    $linkedinAccount:String
    $corporateClients: [String]
    $individualClients: [String]
  ){
  createContactPerson(input:{
    name:$name
    email:$email
    position:$position
    gender:$gender
    phoneNumber:$phoneNumber
    serviceLine:$serviceLine
    dateOfBirth:$dateOfBirth
    facebookAccount:$facebookAccount
    twitterAccount:$twitterAccount
    instagramAccount:$instagramAccount
    linkedinAccount:$linkedinAccount
    corporateClients:$corporateClients
    individualClients:$individualClients
  }){
    contactPerson{
      id
      position
      phoneNumber
      name
      email
      facebookAccount
      corporateClients {
        id
        name
        email
        phoneNumber
      }
      individualClients {
        id
        firstName
        lastName
        surname
        email
        phoneNumber
      }
    }
  }
}
`

export const GET_CONTACT_PERSON = gql`
query getContactPerson($id: String!) {
  contactPerson(id: $id) {
    id
    createdAt
    email
    name
    position
    phoneNumber
    serviceLine
    facebookAccount
    gender
    dateOfBirth
    twitterAccount
    instagramAccount
    linkedinAccount
    serviceLine
    corporateClients {
      id
      name
      email
      phoneNumber
    }
    individualClients {
      id
      firstName
      lastName
      surname
      email
      phoneNumber
    }
  }
}

`

export const GET_CONTACT_PERSONS = gql`
query getContactPeople($search:String, $page:Int, $limit:Int) {
  contactPersons(
    search:$search
    page:$page
    limit:$limit
  ){
    count
    pages
    hasNext
    hasPrev
    items {
      id
      position
      phoneNumber
      gender
      name
      email
      facebookAccount
    }
  }
}
`