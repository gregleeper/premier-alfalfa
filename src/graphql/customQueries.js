export const listReportTickets = /* GraphQL */ `
  query ListTickets(
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTickets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contractId
        correspondingContractId
        type
        contract {
          id
          contractNumber
          contractType

          contractState
          contractTo {
            companyReportName
            id
          }
          commodity {
            name
            id
          }
          vendorId
          commodityId
          quantity
          contractPrice
          salePrice
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
        corresondingContract {
          id
          contractNumber
          contractType
          contractState
          vendorId
          commodityId
          quantity
          contractPrice

          salePrice
          beginDate
          endDate
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

export const invoicesSorted = /* GraphQL */ `
  query InvoicesSorted(
    $type: String
    $dueDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    invoicesSorted(
      type: $type
      dueDate: $dueDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tickets {
          items {
            id
          }
        }
        vendorId
        vendor {
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
        amountOwed
        type
        dueDate
        paymentId
        isPaid
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getInvoice = /* GraphQL */ `
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
      id
      beginDate
      endDate
      tickets {
        items {
          id
          contractId
          invoiceId
          correspondingContractId
          contract {
            contractNumber
            salePrice
            commodity {
              name
            }
          }
          type
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
      vendorId
      vendor {
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
      amountOwed
      type
      dueDate
      paymentId
      isPaid
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
        invoiceId
        correspondingContractId
        type
        contract {
          id
          contractNumber
          contractType
          contractState
          contractTo {
            companyReportName
          }

          vendorId
          commodityId
          quantity
          contractPrice
          salePrice
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
        corresondingContract {
          id
          contractNumber
          contractType
          contractState
          vendorId
          commodityId
          quantity
          contractPrice

          salePrice
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

export const ticketsByDate = /* GraphQL */ `
  query TicketsByDate(
    $type: String
    $ticketDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ticketsByDate(
      type: $type
      ticketDate: $ticketDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        invoiceId
        correspondingContractId
        type
        contract {
          id
          contractNumber
          contractType
          contractState
          contractTo {
            companyReportName
          }
          vendorId
          commodityId
          quantity
          contractPrice
          salePrice
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
        corresondingContract {
          id
          contractNumber
          contractType
          contractState
          vendorId
          commodityId
          quantity
          contractPrice
          salePrice
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

export const paymentsSorted = /* GraphQL */ `
  query PaymentsSorted(
    $type: String
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentsSorted(
      type: $type
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        tFileNumber
        contractId
        contract {
          id
          contractNumber
          contractType
          contractState
          contractTo {
            companyReportName
          }
          vendorId
          commodityId
          quantity
          contractPrice
          salePrice
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
        checkNumber
        date
        amount
        totalPounds
        invoiceId
        tonsCredit
        paymentType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getContractAndTickets = /* GraphQL */ `
  query GetContractAndTickets(
    $id: ID!
    $limit: Int
    $sortDirection: ModelSortDirection
  ) {
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
      contractPrice
      salePrice
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
    ticketsByContract(
      contractId: $id
      limit: $limit
      sortDirection: $sortDirection
    ) {
      items {
        id
        invoiceId
        ticketDate
        netTons
        ticketNumber
        contractId
        correspondingContractId
        contract {
          contractNumber
          contractTo {
            companyReportName
          }
        }
        corresondingContract {
          contractNumber
          id
        }
      }
    }
  }
`;
