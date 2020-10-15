/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCompanyInfo = /* GraphQL */ `
  query GetCompanyInfo($id: ID!) {
    getCompanyInfo(id: $id) {
      id
      companyName
      additionalName
      address1
      address2
      city
      state
      zipCode
      federalId
      telephoneNum
      faxNum
      createdAt
      updatedAt
    }
  }
`;
export const listCompanyInfos = /* GraphQL */ `
  query ListCompanyInfos(
    $filter: ModelCompanyInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanyInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyName
        additionalName
        address1
        address2
        city
        state
        zipCode
        federalId
        telephoneNum
        faxNum
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCommodity = /* GraphQL */ `
  query GetCommodity($id: ID!) {
    getCommodity(id: $id) {
      id
      name
      calculateCode
      billingCode
      poundsPerBushel
      contracts {
        items {
          id
          contractNumber
          contractType
          contractState
          vendorId
          commodityId
          quantity
          price
          terms
          weights
          basis
          remarks
          beginDate
          endDate
          dateSigned
          purchasedFrom
          soldTo
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listCommoditys = /* GraphQL */ `
  query ListCommoditys(
    $filter: ModelCommodityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommoditys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        calculateCode
        billingCode
        poundsPerBushel
        contracts {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVendor = /* GraphQL */ `
  query GetVendor($id: ID!) {
    getVendor(id: $id) {
      id
      vendorNumber
      companyReportName
      companyListingName
      address1
      address2
      city
      state
      zipCode
      telephoneNum
      attention
      prepayment
      prepaymentAmt
      createdAt
      updatedAt
    }
  }
`;
export const listVendors = /* GraphQL */ `
  query ListVendors(
    $filter: ModelVendorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVendors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        vendorNumber
        companyReportName
        companyListingName
        address1
        address2
        city
        state
        zipCode
        telephoneNum
        attention
        prepayment
        prepaymentAmt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getContract = /* GraphQL */ `
  query GetContract($id: ID!) {
    getContract(id: $id) {
      id
      contractNumber
      contractType
      contractState
      vendorId
      commodityId
      contractTo {
        id
        vendorNumber
        companyReportName
        companyListingName
        address1
        address2
        city
        state
        zipCode
        telephoneNum
        attention
        prepayment
        prepaymentAmt
        createdAt
        updatedAt
      }
      quantity
      price
      terms
      weights
      basis
      remarks
      beginDate
      endDate
      dateSigned
      purchasedFrom
      soldTo
      commodity {
        id
        name
        calculateCode
        billingCode
        poundsPerBushel
        contracts {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listContracts = /* GraphQL */ `
  query ListContracts(
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContracts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contractNumber
        contractType
        contractState
        vendorId
        commodityId
        contractTo {
          id
          vendorNumber
          companyReportName
          companyListingName
          address1
          address2
          city
          state
          zipCode
          telephoneNum
          attention
          prepayment
          prepaymentAmt
          createdAt
          updatedAt
        }
        quantity
        price
        terms
        weights
        basis
        remarks
        beginDate
        endDate
        dateSigned
        purchasedFrom
        soldTo
        commodity {
          id
          name
          calculateCode
          billingCode
          poundsPerBushel
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTicket = /* GraphQL */ `
  query GetTicket($id: ID!) {
    getTicket(id: $id) {
      id
      contractId
      contract {
        id
        contractNumber
        contractType
        contractState
        vendorId
        commodityId
        contractTo {
          id
          vendorNumber
          companyReportName
          companyListingName
          address1
          address2
          city
          state
          zipCode
          telephoneNum
          attention
          prepayment
          prepaymentAmt
          createdAt
          updatedAt
        }
        quantity
        price
        terms
        weights
        basis
        remarks
        beginDate
        endDate
        dateSigned
        purchasedFrom
        soldTo
        commodity {
          id
          name
          calculateCode
          billingCode
          poundsPerBushel
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      ticketDate
      fieldNum
      baleCount
      ticketNumber
      ladingNumber
      driver
      truckNumber
      grossWeight
      tareWeight
      netWeight
      netTons
      createdAt
      updatedAt
    }
  }
`;
export const listTickets = /* GraphQL */ `
  query ListTickets(
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTickets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contractId
        contract {
          id
          contractNumber
          contractType
          contractState
          vendorId
          commodityId
          quantity
          price
          terms
          weights
          basis
          remarks
          beginDate
          endDate
          dateSigned
          purchasedFrom
          soldTo
          createdAt
          updatedAt
        }
        ticketDate
        fieldNum
        baleCount
        ticketNumber
        ladingNumber
        driver
        truckNumber
        grossWeight
        tareWeight
        netWeight
        netTons
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
