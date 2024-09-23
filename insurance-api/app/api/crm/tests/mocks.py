# Mutations

contact_person_mutation = """
mutation createContactPerson ($corporateClients: [String!]) {
  createContactPerson(input:{
    name:"martinez"
    email:"martinez@gmail.com"
    position:"sales"
    gender:"M"
    phoneNumber:"0700701208"
    serviceLine:"Sales"
    dateOfBirth:"2015-02-10"
    facebookAccount:"https://aerwe.com"
    twitterAccount:"https://aerwe.com"
    instagramAccount:"https://aerwe.com"
    linkedinAccount:"https://aerwe.com"
    corporateClients:$corporateClients
  }){
    contactPerson{
      id
      position
      phoneNumber
      name
      email
      facebookAccount
      corporateClients{
        id
      }
    }
  }
}
"""

send_message_mutation = """mutation sendMessage($individualClients:[String], $contactPersons:[String]) {
  sendMessage(
    input: {
      emailSubject: "Here is a test email",
      emailBody: "Here is a test email",
      messageOption: "S",
      sms:"Text sample"
      individualClients: $individualClients,
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
        createdAt
        email
        postalAddress
        phoneNumber
        town
        location
        isActive
        facebookAccount
        twitterAccount
        instagramAccount
        linkedinAccount
        kraPin
        firstName
        lastName
        surname
        idNumber
        gender
        dateOfBirth
        occupation
      }
      contactPersons {
        id
        createdAt
        email
        name
        position
        phoneNumber
        facebookAccount
        twitterAccount
        instagramAccount
        serviceLine
        status
        gender
        corporateClients {
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
        }
      }
    }
  }
}
"""
contact_person_update_mutation = """
mutation updateContactPerson ($id: String!, $individualClients: [String!]) {
  updateContactPerson(
    id:$id
    input:{
    name:"martinez"
    email:"martinez@gmail.com"
    position:"sales"
    gender:"M"
    phoneNumber:"0700701208"
    serviceLine:"Sales"
    dateOfBirth:"2015-02-10"
    facebookAccount:"https://aerwe.com"
    twitterAccount:"https://aerwe.com"
    instagramAccount:"https://aerwe.com"
    linkedinAccount:"https://aerwe.com"
    individualClients:$individualClients


  }){
    contactPerson{
      id
      position
      phoneNumber
      name
      email
      facebookAccount
      individualclientSet{
        id
      }

    }
  }
}
"""
# Queries
get_single_contact_person_query = """
  query getContactPerson($id: String!)  {
    contactPerson(id:$id)
    {

      id
      position
      phoneNumber
      email
      name
      facebookAccount

  }
}
"""
get_single_message_query = """query getMessage($id: String!) {
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
      createdAt
      email
      postalAddress
      phoneNumber
      town
      location
      isActive
      facebookAccount
      twitterAccount
      instagramAccount
      linkedinAccount
      kraPin
      firstName
      lastName
      surname
      idNumber
      gender
      dateOfBirth
      occupation
    }
    contactPersons {
      id
      createdAt
      email
      name
      position
      phoneNumber
      facebookAccount
      twitterAccount
      instagramAccount
      serviceLine
      status
      gender
      corporateClients {
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
      }
    }
  }
}
"""
list_messages_query = """
query getCorporateClients {
  messages(search: "") {
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
      individualClients {
        id
        email
        phoneNumber
        town
        location
        firstName
        lastName
        surname
        idNumber
        gender
        dateOfBirth
        occupation
      }
      contactPersons {
        id
        createdAt
        email
        name
        position
        phoneNumber
        facebookAccount
        twitterAccount
        instagramAccount
        serviceLine
        status
        gender
        corporateClients {
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
        }
      }
    }
  }
}
"""
list_contact_people_query ="""
query getContactPeople {
  contactPersons
  (
    search:"ma"
  )
  {
    count
    pages
    hasNext
    hasPrev
    items {
      position
      phoneNumber
      name
      email
      facebookAccount
    }
  }
}

"""
