# Mutations

insurance_company_mutation = """mutation createInsuranceCompany {
  createInsuranceCompany(input:{
    email:"test@gmail.com"
    contactPerson:"Humphrey"

    postalAddress: "P.O. Box 30375-00100"
    physicalAddress:"Apollo Centre, Ring Rd Parklands, Nairobi"
    name:"Jubilee insurance"
    telephoneNumber:["020 234566"]
    mobileNumber:["+254-109-790 000", "+254-330-109 000"]
    imageUrl:"https://res.cloudinary.com/dsw3onksq/image/upload/v1595314246/insurance-co_qr2qog.png"
  }){
    status
    message
     insuranceCompany{
      id
      email
      name
      isActive
      mobileNumber
      telephoneNumber
      physicalAddress
      imageUrl
      postalAddress
      contactPerson
    }
  }
}"""


insurance_company_update_mutation = """mutation updateInsuranceCompany($id: String!) {
  updateInsuranceCompany(
    id: $id
    input:{
    email:"updatedemail@gmail.com"
    contactPerson:"Hesbon"
   }){
     status
     message
      insuranceCompany{
      id
      email
      name
      isActive
      mobileNumber
      telephoneNumber
      physicalAddress
      imageUrl
      postalAddress
      contactPerson}}}"""
# # Queries
get_single_insurance_company_query = ''' query getInsuranceCompany($id: String!) {
          insuranceCompany(id: $id){
          id
          email
          name
          isActive
          mobileNumber
          telephoneNumber
          physicalAddress
          imageUrl
          postalAddress
          contactPerson
      }}'''
list_insurance_companies_query = '''query getInsuranceCompany {
    insuranceCompanies
    {
      count
      pages
      hasNext
      hasPrev
      items
      {
        id
        email
        name
        isActive
        mobileNumber
        telephoneNumber
        physicalAddress
        imageUrl
        postalAddress
        contactPerson
      }}}'''

search_insurance_companies_query = '''query getInsuranceCompany {
    insuranceCompanies (search:"Jubilee")
    {
      count
      pages
      hasNext
      hasPrev
      items
      {
        id
        email
        name
        isActive
        mobileNumber
        telephoneNumber
        physicalAddress
        imageUrl
        postalAddress
        contactPerson
      }}}'''
