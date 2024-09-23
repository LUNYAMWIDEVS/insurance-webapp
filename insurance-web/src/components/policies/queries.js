import gql from "graphql-tag";

export const FETCH_INSURANCE_COMP = gql`
  query getInsuranceCompany($search: String, $page: Int, $limit: Int) {
    insuranceCompanies(limit: $limit, page: $page, search: $search) {
      count
      pages
      hasNext
      hasPrev
      items {
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
  }
`;
export const CREATE_MOTOR_POLICY = gql`
  mutation createMotorPolicy(
    $policyNo: String!
    $individualClient: String
    $corporateClient: String
    $insuranceCompany: String!
    $transactionType: String!
    $transactionDate: Date!
    $startDate: Date!
    $endDate: Date!
    $renewalDate: Date
    $premiumType: String!
    $insuranceClass: String!
    $remarks: String
    $value: Float
    $policyCommissionRate: Float!
    $withholdingTax: Float!
    $commissionRate: Float!
    $minimumPremiumAmount: Float!
    $additionalBenefits: [AdditionalBenefitInput]
    $additionalPremiums: [AdditionalPremiumInput]
    $vehicles: [VehicleInput]
    $policyDetails: [PolicyTypeInput]
    $policyDetailSet: [PolicyTypeSetInput]
  ) {
    createMotorPolicy(
      input: {
        policyNo: $policyNo
        individualClient: $individualClient
        corporateClient: $corporateClient
        transactionDate: $transactionDate
        insuranceCompany: $insuranceCompany
        startDate: $startDate
        endDate: $endDate
        renewalDate: $renewalDate
        minimumPremiumAmount: $minimumPremiumAmount
        insuranceClass: $insuranceClass
        transactionType: $transactionType
        remarks: $remarks
        value: $value
        commissionRate: $commissionRate
        premiumType: $premiumType
        policyCommissionRate: $policyCommissionRate
        withholdingTax: $withholdingTax
        additionalBenefits: $additionalBenefits
        additionalPremiums: $additionalPremiums
        policyDetails: $policyDetails
        policyDetailSet: $policyDetailSet
        vehicles: $vehicles
      }
    ) {
      status
      message
      motorPolicy {
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        value
        policyCommissionRate
        withholdingTax
        remarks
        policyDetails {
          deletedAt
          id
          name
          fields {
            id
            field
            value
          }
        }
        policyDetailSet {
          deletedAt
          id
          name {
            deletedAt
            id
            name
          }
          fields {
            id
            field {
              deletedAt
              id
              field
            }
            value
          }
        }
        additionalBenefits {
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        value
        vehicles {
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          value
          body
        }
        individualClient {
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency {
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
      }
    }
  }
`;

export const RENEW_MOTOR_POLICY = gql`
  mutation createPolicyRenewal(
    $policyNo: String!
    $insuranceCompany: String!
    $transactionType: String!
    $transactionDate: Date!
    $startDate: Date!
    $endDate: Date!
    $renewalDate: Date
    $premiumType: String!
    $remarks: String
    $policyCommissionRate: Float!
    $commissionRate: Float!
    $minimumPremiumAmount: Float!
    $policyId: ID!
    $additionalBenefits: [AdditionalBenefitInput]
    $additionalPremiums: [AdditionalPremiumInput]
    $withholdingTax: Float!
    $policyDetailSet: [PolicyTypeSetInput]
    $insuranceClass: String!
    $value: Int!
  ) {
    createPolicyRenewal(
      input: {
        policyNo: $policyNo
        insuranceCompany: $insuranceCompany
        transactionDate: $transactionDate
        startDate: $startDate
        endDate: $endDate
        renewalDate: $renewalDate
        minimumPremiumAmount: $minimumPremiumAmount
        transactionType: $transactionType
        remarks: $remarks
        commissionRate: $commissionRate
        premiumType: $premiumType
        policyCommissionRate: $policyCommissionRate
        policyId: $policyId
        additionalBenefits: $additionalBenefits
        additionalPremiums: $additionalPremiums
        withholdingTax: $withholdingTax
        policyDetailSet: $policyDetailSet
        insuranceClass: $insuranceClass
        value: $value
      }
    ) {
      status
      message
      policyRenewal {
        id
        createdAt
        value
        updatedAt
        debitNoteNo
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
        insuranceClass
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        transactionType
        policyNo
        withholdingTax
        policy {
          id
        }
        policyDetailSet {
          deletedAt
          id
          name {
            deletedAt
            id
            name
          }
          fields {
            id
            field {
              deletedAt
              id
              field
            }
            value
          }
        }
      }
    }
  }
`;

export const POLICY_ADDITION = gql`
  mutation createPolicyAddition(
    $policyNo: String!
    $insuranceCompany: String!
    $transactionType: String!
    $transactionDate: Date!
    $startDate: Date!
    $endDate: Date!
    $renewalDate: Date
    $premiumType: String!
    $remarks: String
    $policyCommissionRate: Float!
    $commissionRate: Float!
    $minimumPremiumAmount: Float!
    $policyId: ID!
    $additionalBenefits: [AdditionalBenefitInput]
    $additionalPremiums: [AdditionalPremiumInput]
    $withholdingTax: Float!
    $policyDetailSet: [PolicyTypeSetInput]
    $insuranceClass: String!
    $value: Int!
  ) {
    createPolicyAddition(
      input: {
        policyNo: $policyNo
        insuranceCompany: $insuranceCompany
        transactionDate: $transactionDate
        startDate: $startDate
        endDate: $endDate
        renewalDate: $renewalDate
        minimumPremiumAmount: $minimumPremiumAmount
        transactionType: $transactionType
        remarks: $remarks
        commissionRate: $commissionRate
        premiumType: $premiumType
        policyCommissionRate: $policyCommissionRate
        policyId: $policyId
        additionalBenefits: $additionalBenefits
        additionalPremiums: $additionalPremiums
        withholdingTax: $withholdingTax
        policyDetailSet: $policyDetailSet
        insuranceClass: $insuranceClass
        value: $value
      }
    ) {
      status
      message
      policyAddition {
        id
        createdAt
        value
        updatedAt
        debitNoteNo
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
        insuranceClass
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        transactionType
        policyNo
        withholdingTax
        policy {
          id
        }
        policyDetailSet {
          deletedAt
          id
          name {
            deletedAt
            id
            name
          }
          fields {
            id
            field {
              deletedAt
              id
              field
            }
            value
          }
        }
      }
    }
  }
`;

export const POLICY_DELETION = gql`
  mutation createPolicyDeletion(
    $policyNo: String!
    $insuranceCompany: String!
    $transactionType: String!
    $transactionDate: Date!
    $startDate: Date!
    $endDate: Date!
    $renewalDate: Date
    $premiumType: String!
    $remarks: String
    $policyCommissionRate: Float!
    $commissionRate: Float!
    $minimumPremiumAmount: Float!
    $policyId: ID!
    $additionalBenefits: [AdditionalBenefitInput]
    $additionalPremiums: [AdditionalPremiumInput]
    $withholdingTax: Float!
    $policyDetailSet: [PolicyTypeSetInput]
    $insuranceClass: String!
    $value: Int!
  ) {
    createPolicyDeletion(
      input: {
        policyNo: $policyNo
        insuranceCompany: $insuranceCompany
        transactionDate: $transactionDate
        startDate: $startDate
        endDate: $endDate
        renewalDate: $renewalDate
        minimumPremiumAmount: $minimumPremiumAmount
        transactionType: $transactionType
        remarks: $remarks
        commissionRate: $commissionRate
        premiumType: $premiumType
        policyCommissionRate: $policyCommissionRate
        policyId: $policyId
        additionalBenefits: $additionalBenefits
        additionalPremiums: $additionalPremiums
        withholdingTax: $withholdingTax
        policyDetailSet: $policyDetailSet
        insuranceClass: $insuranceClass
        value: $value
      }
    ) {
      status
      message
      policyDeletion {
        id
        createdAt
        value
        updatedAt
        debitNoteNo
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
        insuranceClass
        policyNo
        transactionDate
        premiumType
        startDate
        endDate
        renewalDate
        transactionType
        policyNo
        withholdingTax
        policy {
          id
        }
        policyDetailSet {
          deletedAt
          id
          name {
            deletedAt
            id
            name
          }
          fields {
            id
            field {
              deletedAt
              id
              field
            }
            value
          }
        }
      }
    }
  }
`;

export const GET_POLICY_TYPES = gql`
  query getPolicyTypes($search: String) {
    policyTypes(search: $search) {
      count
      pages
      hasNext
      hasPrev
      items {
        id
        createdAt
        name
        fields {
          deletedAt
          id
          field
          value
        }
      }
    }
  }
`;

export const GET_POLICY_DETAILS = gql`
  query getPolicyDetails {
    policyDetails {
      count
      pages
      hasNext
      hasPrev
      items {
        id
        createdAt
        field
        value
        policytypeSet {
          deletedAt
          id
        }
      }
    }
  }
`;

export const UPDATE_MOTOR_POLICY = gql`
  mutation updateMotorPolicy(
    $id: String!
    $policyNo: String!
    $individualClient: String
    $corporateClient: String
    $insuranceCompany: String!
    $transactionType: String!
    $transactionDate: Date!
    $startDate: Date!
    $endDate: Date!
    $renewalDate: Date
    $premiumType: String!
    $insuranceClass: String!
    $remarks: String
    $value: Float
    $policyCommissionRate: Float!
    $withholdingTax: Float!
    $commissionRate: Float!
    $minimumPremiumAmount: Float!
    $additionalBenefits: [AdditionalBenefitInput]
    $additionalPremiums: [AdditionalPremiumInput]
    $vehicles: [VehicleInput]
    $policyDetails: [PolicyTypeInput]
    $policyDetailSet: [PolicyTypeSetInput]
  ) {
    updateMotorPolicy(
      id: $id
      input: {
        policyNo: $policyNo
        individualClient: $individualClient
        corporateClient: $corporateClient
        transactionDate: $transactionDate
        insuranceCompany: $insuranceCompany
        startDate: $startDate
        endDate: $endDate
        renewalDate: $renewalDate
        minimumPremiumAmount: $minimumPremiumAmount
        insuranceClass: $insuranceClass
        transactionType: $transactionType
        remarks: $remarks
        value: $value
        commissionRate: $commissionRate
        premiumType: $premiumType
        policyCommissionRate: $policyCommissionRate
        withholdingTax: $withholdingTax
        additionalBenefits: $additionalBenefits
        additionalPremiums: $additionalPremiums
        policyDetails: $policyDetails
        policyDetailSet: $policyDetailSet
        vehicles: $vehicles
      }
    ) {
      status
      message
      motorPolicy {
        id
        createdAt
        updatedAt
        debitNoteNo
        policyNo
        transactionDate
        premiumType
        policyCommissionRate
        withholdingTax
        remarks
        policyDetails {
          deletedAt
          id
          name
          fields {
            id
            field
            value
          }
        }
        policyDetailSet {
          deletedAt
          id
          name {
            deletedAt
            id
            name
          }
          fields {
            id
            field {
              deletedAt
              id
              field
            }
            value
          }
        }
        additionalBenefits {
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        transactionType
        value
        vehicles {
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          value
          body
        }
        individualClient {
          deletedAt
          id
          firstName
          lastName
          email
        }
        agency {
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
      }
    }
  }
`;
export const GET_MOTOR_POLICY_OPTS = gql`
  query getMotorPolicyOptions {
    motorPolicyOptions
  }
`;

export const FETCH_RENEWED_POLICIES = gql`
  query getPolicyRenewals {
    policyRenewals {
      id
      status
      policyNo
      debitNoteNo
      policy {
        individualClient {
          firstName
          lastName
          surname
        }
      }
    }
  }
`;

export const FETCH_MOTOR_POLICIES = gql`
  query getMotorPolicies($search: String, $page: Int, $limit: Int, $startDateBegin: String, $startDateEnd: String, $transactionDateBegin: String, $transactionDateEnd: String, $endDateBegin: String, $endDateEnd: String) {
    motorPolicies(limit: $limit, page: $page, search: $search, startDateBegin: $startDateBegin, startDateEnd: $startDateEnd, endDateBegin: $endDateBegin, endDateEnd: $endDateEnd, transactionDateBegin: $transactionDateBegin, transactionDateEnd: $transactionDateEnd) {
      count
      pages
      hasNext
      page
      hasPrev
      items {
        id
        history
        createdAt
        debitNoteNo
        policyNo
        transactionDate
        policyadditionSet {
          id
          policyNo
          debitNoteNo
          insuranceCompany {
            id
            name
            contactPerson
            physicalAddress
          }
          insuranceClass
          startDate
          endDate
          transactionDate
          createdAt
          value
          premiums
          policyDetailSet {
            deletedAt
            id
            name {
              deletedAt
              id
              name
            }
            fields {
              deletedAt
              id
              field {
                deletedAt
                id
                field
              }
              value
            }
          }
        }
        policydeletionSet {
          id
          policyNo
          debitNoteNo
          insuranceCompany {
            id
            name
            contactPerson
            physicalAddress
          }
          insuranceClass
          startDate
          endDate
          transactionDate
          createdAt
          value
          premiums
          policyDetailSet {
            deletedAt
            id
            name {
              deletedAt
              id
              name
            }
            fields {
              deletedAt
              id
              field {
                deletedAt
                id
                field
              }
              value
            }
          }
        }
        corporateClient {
          deletedAt
          clientNumber
          id
          email
          name
        }
        value
        calculateTotal
        calculateBalance
        startDate
        endDate
        premiumType
        policyDetails {
          deletedAt
          id
          name
          fields {
            deletedAt
            id
            field
            value
          }
        }
        policyDetailSet {
          deletedAt
          id
          name {
            deletedAt
            id
            name
          }
          fields {
            deletedAt
            id
            field {
              deletedAt
              id
              field
            }
            value
          }
        }
        policyrenewalSet {
          id
          status
          premiums
          value
          policyNo
          createdAt
          debitNoteNo
          insuranceCompany {
            id
            name
            contactPerson
            physicalAddress
          }
          insuranceClass
          startDate
          endDate
          transactionDate
          transactionType
          additionalPremiums {
            premium
            commissionRate
            minimumAmount
          }
          policyDetailSet {
            deletedAt
            id
            name {
              deletedAt
              id
              name
            }
            fields {
              deletedAt
              id
              field {
                deletedAt
                id
                field
              }
              value
            }
          }
        }

        additionalBenefits {
          id
          benefit
          commissionRate
        }
        insuranceClass
        startDate
        endDate
        renewalDate
        premiums
        transactionType
        additionalPremiums {
          id
          premium
          commissionRate
          minimumAmount
        }
        vehicles {
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient {
          deletedAt
          id
          firstName
          clientNumber
          lastName
          email
        }
        agency {
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
      }
    }
  }
`;
export const FETCH_MINIMAL_MOTOR_POLICIES = gql`
  query getMotorPolicies($search: String, $page: Int, $limit: Int) {
    motorPolicies(limit: $limit, page: $page, search: $search) {
      count
      pages
      hasNext
      page
      hasPrev
      items {
        id
        policyNo
        createdAt
        transactionDate
        transactionType
        individualClient {
          firstName
          lastName
          email
        }
        corporateClient {
          id
          name
          email
        }
        insuranceClass
      }
    }
  }
`;

export const DELETE_ADDITIONAL_BEN = gql`
  mutation deleteAdditionalBenefit($id: [String]!) {
    deleteAdditionalBenefit(id: $id) {
      status
      message
    }
  }
`;
export const DELETE_ADDITIONAL_PREM = gql`
  mutation deleteAdditionalPremium($id: [String]!) {
    deleteAdditionalPremium(id: $id) {
      status
      message
    }
  }
`;

export const GET_MOTOR_POLICY = gql`
  query getMotorPolicy($id: String!) {
    motorPolicy(id: $id) {
      id
      history
      createdAt
      debitNoteNo
      policyNo
      transactionDate
      corporateClient {
        deletedAt
        id
        email
        name
      }
      value
      calculateTotal
      calculateBalance
      startDate
      endDate
      premiumType
      policyCommissionRate
      minimumPremiumAmount
      commissionRate
      premiums
      policyDetails {
        deletedAt
        id
        name
        fields {
          deletedAt
          id
          field
          value
        }
      }
      policyDetailSet {
        deletedAt
        id
        name {
          deletedAt
          id
          name
        }
        fields {
          deletedAt
          id
          field {
            deletedAt
            id
            field
          }
          value
        }
      }
      policyadditionSet {
        id
        createdAt
        value
        premiums
        minimumPremiumAmount
        commissionRate
        premiumType
        additionalPremiums {
          premium
          minimumAmount
          commissionRate
        }
      }
      policydeletionSet {
        id
        createdAt
        value
        insuranceCompany {
          id
          name
          contactPerson
          physicalAddress
        }
        premiums
        minimumPremiumAmount
        commissionRate
        premiumType
        additionalPremiums {
          premium
          minimumAmount
          commissionRate
        }
      }
      policyrenewalSet {
        id
        status
        policyNo
        premiums
        additionalPremiums {
          premium
          commissionRate
          minimumAmount
        }
        createdAt
        debitNoteNo
        startDate
        endDate
        renewalDate
        transactionDate
        transactionType
        insuranceClass
        minimumPremiumAmount
        commissionRate
        premiumType
      }
      additionalBenefits {
        id
        benefit
        commissionRate
        minimumAmount
      }
      insuranceClass
      startDate
      endDate
      renewalDate
      transactionType
      additionalPremiums {
        id
        premium
        commissionRate
        minimumAmount
      }
      vehicles {
        id
        createdAt
        registrationNo
        yearOfManufacture
        tonnage
        body
      }
      individualClient {
        deletedAt
        id
        firstName
        clientNumber
        lastName
        email
      }
      agency {
        id
        createdAt
        updatedAt
        name
        boxNumber
      }
      insuranceCompany {
        id
        name
        contactPerson
        physicalAddress
      }
    }
  }
`;

export const GET_POLICY_RENEWAL = gql`
  query getRenewedPolicy($id: ID!) {
    policyRenewal(id: $id) {
      id
      createdAt
      debitNoteNo
      policyNo
      transactionDate
      startDate
      endDate
      transactionType
      premiumType
      commissionRate
      policyCommissionRate
      value
      premiums
      additionalPremiums {
        id
        premium
        commissionRate
        minimumAmount
      }
      policyDetailSet {
        id
        name {
          id
          name
        }
        fields {
          id
          field {
            id
            field
          }
          value
        }
      }
      insuranceClass
      renewalDate
      insuranceCompany {
        id
        name
        contactPerson
        physicalAddress
      }
      remarks
      policy {
        id
        calculateTotal
        calculateBalance
        corporateClient {
          id
          email
          name
          kraPin
          phoneNumber
        }
        policyDetails {
          deletedAt
          id
          name
          fields {
            deletedAt
            id
            field
            value
          }
        }
        vehicles {
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient {
          deletedAt
          id
          firstName
          clientNumber
          lastName
          email
          surname
          idNumber
          phoneNumber
          kraPin
        }
        agency {
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      }
    }
  }
`;

export const GET_POLICY_ADDITION = gql`
  query getPolicyAddition($id: ID!) {
    policyAddition(id: $id) {
      id
      createdAt
      debitNoteNo
      policyNo
      transactionDate
      startDate
      endDate
      transactionType
      premiumType
      commissionRate
      policyCommissionRate
      value
      premiums
      additionalPremiums {
        id
        premium
        commissionRate
        minimumAmount
      }
      policyDetailSet {
        id
        name {
          id
          name
        }
        fields {
          deletedAt
          id
          field {
            id
            field
          }
          value
        }
      }
      insuranceClass
      renewalDate
      insuranceCompany {
        id
        name
        contactPerson
        physicalAddress
      }
      remarks
      policy {
        id
        calculateTotal
        calculateBalance
        corporateClient {
          id
          email
          name
          kraPin
          phoneNumber
        }
        policyDetails {
          deletedAt
          id
          name
          fields {
            deletedAt
            id
            field
            value
          }
        }
        vehicles {
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient {
          deletedAt
          id
          firstName
          clientNumber
          lastName
          email
          surname
          idNumber
          phoneNumber
          kraPin
        }
        agency {
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      }
    }
  }
`;

export const GET_POLICY_DELETION = gql`
  query getPolicyDeletion($id: ID!) {
    policyDeletion(id: $id) {
      id
      createdAt
      debitNoteNo
      policyNo
      transactionDate
      startDate
      endDate
      transactionType
      premiumType
      commissionRate
      policyCommissionRate
      value
      premiums
      additionalPremiums {
        id
        premium
        commissionRate
        minimumAmount
      }
      policyDetailSet {
        id
        name {
          id
          name
        }
        fields {
          deletedAt
          id
          field {
            id
            field
          }
          value
        }
      }
      insuranceClass
      renewalDate
      insuranceCompany {
        id
        name
        contactPerson
        physicalAddress
      }
      remarks
      policy {
        id
        calculateTotal
        calculateBalance
        corporateClient {
          id
          email
          name
          kraPin
          phoneNumber
        }
        policyDetails {
          deletedAt
          id
          name
          fields {
            deletedAt
            id
            field
            value
          }
        }
        vehicles {
          id
          createdAt
          registrationNo
          yearOfManufacture
          tonnage
          body
        }
        individualClient {
          deletedAt
          id
          firstName
          clientNumber
          lastName
          email
          surname
          idNumber
          phoneNumber
          kraPin
        }
        agency {
          id
          createdAt
          updatedAt
          name
          boxNumber
        }
      }
    }
  }
`;

export const DELETE_MOTOR_POLICY = gql`
  mutation deletePolicy($id: [String]!) {
    deletePolicy(id: $id) {
      status
      message
    }
  }
`;
