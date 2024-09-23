import gql from 'graphql-tag';

export const GET_CLIENT_QUERY = gql`
query getIndividualType($id:String!) {
  individualClient(id:$id)
  {
    id
    createdAt
    clientNumber
    surname
    email
    deletedAt
    updatedAt
    firstName
    lastName
    occupation
    status
    town
    location
    dateOfBirth
    gender
    phoneNumber
    idNumber
    kraPin
    postalAddress
    agency{
      id
      name
      agencyEmail
    }
    contactPersons{
      id
      name
      email
      position
    }
}
}`
export const FETCH_CLIENTS_QUERY = gql`
query getIndividualType($search:String, $page:Int, $limit:Int) {
  individualClients(search:$search, page:$page, limit:$limit)
  {
    count
    pages
    hasNext
    hasPrev
    items
    {
    id
    clientNumber
    createdAt
    lastName
    email
    updatedAt
    firstName
    lastName
    surname
    occupation
    town
    location
    dateOfBirth
    gender
    phoneNumber
    idNumber
    kraPin
    postalAddress
    agency{
      id
      name
      agencyEmail
    }


    }}}`
export const FETCH_CORPORATE_CLIENTS_QUERY = gql`
query getCorporateClients($search:String, $page:Int, $limit:Int) {
  corporateClients(
    search:$search
    page:$page
    limit:$limit
  ) {
    count
    pages
    hasNext
    hasPrev
    items {
      id
      createdAt
      clientNumber
      name
      about
      email
      postalAddress
      town
      kraPin
      linkedinAccount
      twitterAccount
      facebookAccount
      instagramAccount
      phoneNumber
      location
      agency {
        id
        name
        agencyEmail
      }
    }
  }
}
`


export const ADD_NEW_CLIENT = gql`
mutation createIndividualClient(
    $email: String
    $firstName: String!
    $lastName: String!
    $phoneNumber: String
    $surname: String!
    $town: String!
    $occupation: String!
    $dateOfBirth: Date!
    $gender:  String!
    $status:  String!
    $idNumber: Int!
    $kraPin: String!
    $contactPersons:[String]
    ) {
      createIndividualClient(
        input:{
          email: $email
          firstName: $firstName
          lastName: $lastName
          phoneNumber: $phoneNumber
          surname: $surname
          town: $town
          status: $status
          occupation: $occupation
          dateOfBirth: $dateOfBirth
          gender: $gender
          idNumber: $idNumber
          kraPin: $kraPin
          contactPersons: $contactPersons
  }){
    status
    message
    individualClient {
      id
      createdAt
      clientNumber
      lastName
      email
      deletedAt
      updatedAt
      firstName
      lastName
      occupation
      status
      town
      dateOfBirth
      gender
      phoneNumber
      idNumber
      kraPin
      postalAddress
      agency{
        id
        name
        agencyEmail
      }
      contactPersons{
        id
        name
        email
        position
      }
      }
  }
}
`
export const ADD_NEW_CORPORATE_CLIENT = gql`
mutation createCorporateClient(
  $email:String
  $name:String!
  $phoneNumber:String
  $kraPin:String!
  $town:String!
  $about:String!
  $twitterAccount:String
  $status:String!
  $postalAddress:String!
  $instagramAccount:String
  $facebookAccount:String
  $linkedinAccount:String
  $contactPersons:[String]
)
  {
  createCorporateClient(
    input:{
    email:$email
    name:$name
    phoneNumber:$phoneNumber
    town:$town
    status: $status
    kraPin:$kraPin
    about: $about
    postalAddress:$postalAddress
    twitterAccount:$twitterAccount
    instagramAccount: $instagramAccount
    facebookAccount: $facebookAccount
    linkedinAccount: $linkedinAccount
    contactPersons: $contactPersons
  }
  ){
    status
    message
     corporateClient{
      id
      createdAt
      clientNumber
      name
      about
      email
      postalAddress
      town
      status
      kraPin
      linkedinAccount
      twitterAccount
      facebookAccount
      instagramAccount
      phoneNumber
      location
      agency{
        id
        name
        agencyEmail
      }
      contactPersons{
        id
        name
        email
        position
      }
    }
  }
}`

export const GET_CORPORATE_CLIENT = gql`
query getCorporateClient($id:String!) {
  corporateClient(id: $id) {
    id
    createdAt
    clientNumber
    name
    about
    email
    postalAddress
    town
    status
    kraPin
    linkedinAccount
    twitterAccount
    facebookAccount
    instagramAccount
    phoneNumber
    location
    agency {
      id
      name
      agencyEmail
    }
    contactPersons{
      id
      name
      email
      position
      phoneNumber
      gender
    }
  }
}
`
export const GET_CORPORATE_CLIENTS = gql`
query getCorporateClients($search:String, $page:Int, $limit:Int) {
  corporateClients(
    search:$search
    page:$page
    limit:$limit
  ) {
    count
    pages
    hasNext
    hasPrev
    items {
      id
      clientNumber
      name
      email
    }
  }
}`

export const SEND_MESSAGES = gql`
mutation sendMessage(
  $emailSubject: String,
  $emailBody: String,
  $messageOption: String,
  $sms: String,
  $individualClients: [String],
  $corporateClients:[String],
  $contactPersons:[String]
  ) {
  sendMessage(
    input: {
      emailSubject: $emailSubject,
      emailBody: $emailBody,
      messageOption: $messageOption,
      sms:$sms
      individualClients: $individualClients,
      corporateClients: $corporateClients,
      contactPersons: $contactPersons
    }) {
    status
    message {
      id
      createdAt
      sms
      emailBody
      emailSubject
      option
      sentAt
      individualClients {
        id
        email
        phoneNumber
        firstName
        lastName

      }
      contactPersons {
        id
        email
        name
        phoneNumber
        serviceLine
      }
      corporateClients{
        id
        name
        email
      }
    }
  }
}
`

export const SEND_MULTI_WHATSAPPP_MESSAGES = gql`
mutation sendMessage(
  $emailSubject: String,
  $emailBody: String,
  $messageOption: String,
  $sms: String,
  $individualClients: [String],
  $corporateClients:[String],
  $contactPersons:[String]
  ) {
  sendMessage(
    input: {
      emailSubject: $emailSubject,
      emailBody: $emailBody,
      messageOption: $messageOption,
      sms:$sms
      individualClients: $individualClients,
      corporateClients: $corporateClients,
      contactPersons: $contactPersons
    }) {
    status
    message {
      id
      createdAt
      sms
      emailBody
      emailSubject
      option
      sentAt
      individualClients {
        id
        email
        phoneNumber
        firstName
        lastName

      }
      contactPersons {
        id
        email
        name
        phoneNumber
        serviceLine
      }
      corporateClients{
        id
        name
        email
      }
    }
  }
}
`

export const GET_SENDING_OPTS = gql`
query geMessageOptions {
  messageOptions}`

export const GET_MESSAGES = gql`
query getMessages($search:String, $page:Int, $limit:Int) {
  messages(
    search:$search
    page:$page
    limit:$limit
  ) {
    count
    pages
    hasNext
    hasPrev
    items {
      id
      createdAt
      sms
      emailBody
      emailSubject
      option
      sentAt
    }
  }
}
`
export const GET_MESSAGE = gql`
query getMessage($id: String!) {
  message(id: $id) {
    id
    createdAt
    sms
    emailBody
    emailSubject
    option
    sentAt
    individualClients {
      id
      email
      firstName
      lastName
      surname
    }
    contactPersons {
      id
      email
      name
      serviceLine
    }
    corporateClients{
      id
      name
      email
    }
  }
}
`

export const GET_STATUS_OPTS = gql`
query getClientStatusOptions {
  clientStatusOptions
    }`


export const UPDATE_INDIVIDUAL_CLIENT = gql`
  mutation UpdateIndividualClient($id: String!, $input: IndividualClientInput!) {
    updateIndividualClient(id: $id, input: $input) {
        status
        message
    }
  }

`


export const UPDATE_CORPORATE_CLIENT = gql`
  mutation  UpdateCorporateClient($id: String!, $input: CorporateClientInput!){
    updateCorporateClient(id: $id, input: $input){
      status
      message
    }
  }
`


export const UPDATE_CONTACT_PERSON = gql`
  mutation UpdateContactPerson($id: String!, $input: ContactPersonInput!){
    updateContactPerson(id: $id, input: $input){
      status
      message
    }
  }
`