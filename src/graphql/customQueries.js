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

export const settlementsSorted = /* GraphQL */ `
  query SettlementsSorted(
    $type: String
    $dueDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSettlementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    settlementsSorted(
      type: $type
      dueDate: $dueDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        settlementNumber
        tickets {
          items {
            id
            contract {
              id
              contractNumber
            }
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
        contractId
        contract {
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
        amountOwed
        beginDate
        endDate
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
        invoiceNumber
        tickets {
          items {
            id
            contract {
              id
              contractNumber
            }
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
      invoiceNumber
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
        settlementId
        tonsCredit
        paymentType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const contractsByType = /* GraphQL */ `
  query ContractsByType(
    $contractType: ContractType
    $endDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $ticketFilter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByType(
      contractType: $contractType
      endDate: $endDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        tickets(filter: $ticketFilter, limit: 5000) {
          items {
            id
            ticketDate
            netTons
            netWeight
            tareWeight
            ticketNumber
            updatedAt
            invoiceId
          }
          nextToken
        }
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

export const invoicesByContract = /* GraphQL */ `
  query InvoicesByContract(
    $contractId: ID
    $dueDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    invoicesByContract(
      contractId: $contractId
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
            ticketDate
            netTons
            netWeight
            tareWeight
            ticketNumber
            updatedAt
            invoiceId
          }
          nextToken
        }
        vendorId
        invoiceNumber
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
        contractId

        contract {
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
        amountOwed
        beginDate
        endDate
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
export const settlementsByContract = /* GraphQL */ `
  query SettlementsByContract(
    $contractId: ID
    $dueDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSettlementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    settlementsByContract(
      contractId: $contractId
      dueDate: $dueDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        settlementNumber
        tickets {
          items {
            id
            ticketDate
            contract {
              contractNumber
            }
            netTons
            netWeight
            tareWeight
            ticketNumber
            updatedAt
            invoiceId
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
        contractId
        contract {
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
        amountOwed
        beginDate
        endDate
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
export const getSettlement = /* GraphQL */ `
  query GetSettlement($id: ID!) {
    getSettlement(id: $id) {
      id
      settlementNumber
      tickets {
        items {
          id
          contractId
          invoiceId
          contract {
            contractNumber
            commodity {
              name
            }
            contractPrice
          }

          settlementId
          correspondingContractId
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
        tickets {
          nextToken
        }
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
      amountOwed
      beginDate
      endDate
      type
      dueDate
      paymentId
      isPaid
      createdAt
      updatedAt
    }
  }
`;
