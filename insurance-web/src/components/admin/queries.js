import gql from "graphql-tag";

export const AGENCY_QUERY = gql`
  query getAgency {
    profile {
      agency {
        id
        createdAt
        name
        officeLocation
        boxNumber
        postalCode
        phoneNumber
        agencyEmail
        imageUrl
        isActive
        clientNumber
      }
    }
  }
`;

export const UPDATE_AGENCY = gql`
  mutation updateAgencyDetails($id: String!, $input: AgencyInput!) {
    updateAgencyDetails(id: $id, input: $input) {
      status
      message
      agency {
        id
        createdAt
        name
        officeLocation
        boxNumber
        postalCode
        phoneNumber
        agencyEmail
        imageUrl
        isActive
        clientNumber
      }
    }
  }
`;
