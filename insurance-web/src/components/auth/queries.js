import gql from 'graphql-tag';

export const USER_PROFILE_QUERY = gql`
query getUser($id:String!) {
  user(id: $id) {
    createdAt
    isSuperuser
    id
    deletedAt
    roles
    firstName
    phoneNumber
    lastName
    isActive
    image
    email
    username
  }
}
`
export const REFRESH_TOKEN_MUTATION = gql`mutation refreshToken($token:String!)   {
  refreshToken(token:$token){
    token
    payload
    refreshExpiresIn

  }
}
`

export const LOGIN_USER = gql`
mutation tokenAuth(
    $username: String!
    $password: String!
) {
  tokenAuth (
    username: $username
    password: $password
  ){
    token
    user {
      id
      username
      email
      firstName
      isSuperuser
      isActive
      isStaff
      image
      phoneNumber
      roles
      agency {
        id
        name
        officeLocation
        imageUrl
        agencyEmail
        postalCode
        boxNumber
        isActive
      }
    }
  }
}
`
export const PASS_RESET_REQUEST = gql`
mutation passwordReset($email:String!) {
  passwordReset(input:{
    email:$email
  }){
    status
    message
  }
}
`
export const RESET_PASSWORD = gql`
mutation updateUser($password:String!) {
  updateUser(input:{
    password:$password
  }){
    message
  }
}`

export const UPDATE_USER = gql`
  mutation updateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      status
      message
    }
  }
`;