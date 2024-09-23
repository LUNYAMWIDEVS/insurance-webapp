# Mutations

individual_client_mutation = """mutation createIndividualClient {
  createIndividualClient(input:{
    email:"individual@gmail.com"
    firstName:"Individual"
    lastName:"Client"
    phoneNumber:"+254727550256"
    surname:"Client-1"
    town:"Nairobi"
    occupation:"farmer"
    dateOfBirth:"1984-05-15"
    gender:"M"
    idNumber:123456
    kraPin:"JH746357634vgh"
  }){
    status
    message
     individualClient{
      id
      email
      firstName
      isActive
      phoneNumber
      agency{
        id
        name
        agencyEmail
      }}}}"""

individual_client_mutation = """mutation createIndividualClient {
  createIndividualClient(input:{
    email:"individual@gmail.com"
    firstName:"Individual"
    lastName:"Client"
    phoneNumber:"+254727550256"
    surname:"Client-1"
    town:"Nairobi"
    occupation:"farmer"
    dateOfBirth:"1984-05-15"
    gender:"M"
    idNumber:123456
    kraPin:"JH746357634vgh"
  }){
    status
    message
     individualClient{
      id
      email
      firstName
      isActive
      phoneNumber
      agency{
        id
        name
        agencyEmail
      }}}}"""

individual_client_update_mutation = """mutation updateIndividualClient($id: String!) {
  updateIndividualClient(
    id: $id
    input:{
    email:"individualupdate@gmail.com"
    firstName:"updateIndividual"
    lastName:"Updated"
    phoneNumber:"+254727997487"
    surname:"Kip"
    town:"Nairobi"
    occupation:"Teacher"
    dateOfBirth:"2020-05-15"
    gender:"F"
    idNumber:1234562
    kraPin:"JH746saf47634vgh"
  }){
    status
    message
     individualClient{
      id
      email
      firstName
      isActive
      phoneNumber
      agency{
        id
        name
        agencyEmail
      }}}}"""
# Queries
get_single_individual_query = ''' query getIndividualClient($id: String!) {
          individualClient(id: $id){
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
          agency{
            id
            name
            agencyEmail
          }
      }}'''
list_individual_clients_query = '''query getIndividualType {
    individualClients
    {
      count
      pages
      hasNext
      hasPrev
      items
      {
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
      agency{
        id
        name
        agencyEmail
      }}}}'''

search_individual_clients_query = '''query getIndividualType {
    individualClients(search:"Individual")
    {
      count
      pages
      hasNext
      hasPrev
      items
      {
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
      agency{
        id
        name
        agencyEmail
      }}}}'''


corporate_client_mutation="""
mutation createCorporateClient
  {
  createCorporateClient(
    input:{
    email:"Martin@gmail.com"
    name:"Test"
    phoneNumber:"+254557737477"
    town:"Nairobi"
    kraPin:"JH7422357634vgh"
    about: "Matatu sacco"
    twitterAccount:"https://twitter.com/home"
    instagramAccount: "https://twitter.com/home"
  }
  ){
    status
    message
     corporateClient{
      id
      createdAt
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
      agency{
        id
        name
        agencyEmail
      }
    }
  }
}
"""

corporate_client_update_mutation="""
mutation updateCorporateClient($id: String!) {
  updateCorporateClient(id:$id
  input:{
    email:"test@email.com"
    name:"One Sacco"
    phoneNumber:"+254557737477"
    town:"Nairobi"
    kraPin:"JH7422357634vgh"
    about: "Matatu sacco"
    twitterAccount:"https://twitter.com/home"
    instagramAccount: "https://twitter.com/home"
  }){
    corporateClient{
      id
      createdAt
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
      agency{
        id
        name
        agencyEmail
      }
    }
  }
}
"""

get_single_corporate_client_query="""
query getCorporateClient($id: String!)  {
  corporateClient(id:$id) {
    id
    createdAt
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
"""

get_corporate_clients_query="""
query getCorporateClients {
  corporateClients{
    count
    pages
    hasNext
    hasPrev
    items {
      id
      createdAt
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
"""