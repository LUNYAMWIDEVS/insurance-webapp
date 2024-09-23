import gql from "graphql-tag";

export const GET_CLIENT_QUERY = gql`
  query getIndividualType($id: String!) {
    individualClient(id: $id) {
      id
      createdAt
      lastName
      email
      deletedAt
      updatedAt
      firstName
      lastName
      occupation
      town
      dateOfBirth
      gender
      phoneNumber
      idNumber
      kraPin
      postalAddress
      agency {
        id
        name
        agencyEmail
      }
    }
  }
`;

export const ADD_NEW_CLIENT = gql`
  mutation createIndividualClient(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $surname: String!
    $town: String!
    $occupation: String!
    $dateOfBirth: Date!
    $gender: String!
    $idNumber: Int!
    $kraPin: String!
  ) {
    createIndividualClient(
      input: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        surname: $surname
        town: $town
        occupation: $occupation
        dateOfBirth: $dateOfBirth
        gender: $gender
        idNumber: $idNumber
        kraPin: $kraPin
      }
    ) {
      status
      message
      individualClient {
        id
        email
        firstName
        isActive
        phoneNumber
        agency {
          id
          name
          agencyEmail
        }
      }
    }
  }
`;

export const ADD_NEW_CONTACT_PERSON = gql`
  mutation createContactPerson(
    $name: String!
    $email: String!
    $position: String!
    $gender: String!
    $phoneNumber: String!
    $serviceLine: String
    $dateOfBirth: Date!
    $facebookAccount: String
    $twitterAccount: String
    $instagramAccount: String
    $linkedinAccount: String
    $client: String!
  ) {
    createContactPerson(
      input: {
        name: $name
        email: $email
        position: $position
        gender: $gender
        phoneNumber: $phoneNumber
        serviceLine: $serviceLine
        dateOfBirth: $dateOfBirth
        facebookAccount: $facebookAccount
        twitterAccount: $twitterAccount
        instagramAccount: $instagramAccount
        linkedinAccount: $linkedinAccount
        client: $client
      }
    ) {
      contactPerson {
        id
        position
        phoneNumber
        name
        email
        facebookAccount
        client {
          id
        }
      }
    }
  }
`;

export const GET_CONTACT_PERSON = gql`
  query getContactPerson($id: String!) {
    contactPerson(id: $id) {
      id
      position
      phoneNumber
      email
      name
      facebookAccount
    }
  }
`;

export const GET_CONTACT_PERSONS = gql`
  query getContactPeople {
    contactPersons {
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
`;
export const GET_CORPORATE_CLIENTS = gql`
  query getCorporateClients($search: String, $page: Int, $limit: Int) {
    corporateClients(search: $search, page: $page, limit: $limit) {
      count
      pages
      hasNext
      hasPrev
      items {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_INSURANCE_COMPANY = gql`
  mutation updateInsurance($input: InsuranceCompanyInput!, $id: String!) {
    updateInsuranceCompany(input: $input, id: $id) {
      insuranceCompany {
        mobileNumber
        contactPerson
        isActive
        postalAddress
        physicalAddress
        telephoneNumber
        name
        updatedAt
        email
        imageUrl
      }
    }
  }
`;

export const ADD_INSURANCE_COMPANY = gql`
  mutation addInsurance($input: InsuranceCompanyInput!) {
    createInsuranceCompany(input: $input) {
      insuranceCompany {
        mobileNumber
        contactPerson
        isActive
        postalAddress
        physicalAddress
        telephoneNumber
        name
        updatedAt
        email
        imageUrl
      }
    }
  }
`;
