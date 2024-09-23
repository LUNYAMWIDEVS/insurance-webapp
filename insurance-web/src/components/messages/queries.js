import gql from 'graphql-tag';

export const SEND_WHATSAPP_MESSAGE = gql`
mutation sendWhatsappMessage (
  $whatsappResponse:String
  $whatsappMessageId:String
){
  sendWhatsappMessage(input:{
    whatsappResponse:$whatsappResponse
    whatsappMessageId:$whatsappMessageId

  }){

    status
    message
     whatsappMessage{
      id
      whatsappSms
      whatsappResponse
      whatsappPhoneNumber
      previousResponses{
        whatsappResponse
      }

      salesAgentAssigned{
        id
        firstName
        lastName
      }

    }
  }
}
`


export const GET_WHATSAPP_MESSAGES = gql`
query getWhatsappMessage ($page:Int, $limit:Int, $whatsappPhoneNumber:String) {
  whatsappMessages
  (
    whatsappPhoneNumber:$whatsappPhoneNumber
    page:$page
    limit:$limit
  ){
    count
    page
    pages
    items {
      id
      createdAt
      whatsappSms
      whatsappResponse
      whatsappPhoneNumber
      sentAt
      isBot
      option
      salesAgentAssigned {
        id
        email
        firstName
        lastName
      }
      previousResponses{
        id
        whatsappResponse
      }
    }
  }
}
`

export const ASSIGN_SALES_AGENT = gql`
mutation assignSalesAgent (
  $salesAgentAssigned:String
  $whatsappPhoneNumber:String
  
){
  assignSalesAgent(input:{
    salesAgentAssigned:$salesAgentAssigned
    whatsappPhoneNumber:$whatsappPhoneNumber
    
  }){
    agent{
      salesAgentAssigned{
        firstName
        lastName
      }
      
    }
   
    status
    
    
    
  }
}
`

export const FETCH_USERS_QUERY = gql`
  query getUsers($search:String,$page:Int, $limit:Int) {
    users(isStaff:true, limit:$limit,page:$page, search:$search)
    {
      items{
        createdAt
        id
        deletedAt
        firstName
        phoneNumber
        lastName
        isActive
        email
      }
      page
      count
      pages
      hasNext
      hasPrev
    }
    }
`;


export const SEND_MULTIPLE_WHATSAPP_MESSAGES=gql`
mutation sendMultipleWhatsappMessage(
  $messageOption: String,
  $whatsappSms: String,
  $individualClients: [String],
  $corporateClients:[String],
  $contactPersons:[String]
  ) {
  sendMultipleWhatsappMessages(
    input: {
      
      messageOption: $messageOption,
      whatsappSms:$whatsappSms
      individualClients: $individualClients,
      corporateClients: $corporateClients,
      contactPersons: $contactPersons
    }) {
    status
    message {
      id
      createdAt
      whatsappSms
      option
      sentAt
      individualClients {
        id
        email
        phoneNumber
        firstName
        lastName

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