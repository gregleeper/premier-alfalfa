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
          settlementId
          paymentId
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
        payments {
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
export const listSettlements = /* GraphQL */ `
  query ListSettlements(
    $filter: ModelSettlementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSettlements(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        settlementNumber
        tickets {
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
export const getInvoice = /* GraphQL */ `
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
      id
      invoiceNumber
      tickets {
        items {
          id
          contractId
          invoiceId
          settlementId
          paymentId
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
        payments {
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
export const listInvoices = /* GraphQL */ `
  query ListInvoices(
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        invoiceNumber
        tickets {
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
        items {
          id
          contractId
          invoiceId
          settlementId
          paymentId
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
      payments {
        items {
          id
          type
          tFileNumber
          contractId
          checkNumber
          date
          amount
          totalPounds
          invoiceId
          settlementId
          tonsCredit
          overage
          underage
          paymentType
          createdAt
          updatedAt
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
        payments {
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
export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      type
      tFileNumber
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
        payments {
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
      tickets {
        items {
          id
          contractId
          invoiceId
          settlementId
          paymentId
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
      checkNumber
      date
      amount
      totalPounds
      invoiceId
      settlementId
      tonsCredit
      overage
      underage
      paymentType
      createdAt
      updatedAt
    }
  }
`;
export const listPayments = /* GraphQL */ `
  query ListPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        tickets {
          nextToken
        }
        checkNumber
        date
        amount
        totalPounds
        invoiceId
        settlementId
        tonsCredit
        overage
        underage
        paymentType
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
      invoiceId
      settlementId
      paymentId
      correspondingContractId
      type
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
        payments {
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
      corresondingContract {
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
        payments {
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
        invoiceId
        settlementId
        paymentId
        correspondingContractId
        type
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
export const vendorSettlements = /* GraphQL */ `
  query VendorSettlements(
    $vendorId: ID
    $dueDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSettlementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vendorSettlements(
      vendorId: $vendorId
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
        invoiceNumber
        tickets {
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
export const vendorInvoices = /* GraphQL */ `
  query VendorInvoices(
    $vendorId: ID
    $dueDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    vendorInvoices(
      vendorId: $vendorId
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
export const contractsByStatus = /* GraphQL */ `
  query ContractsByStatus(
    $contractState: ContractState
    $contractTypeEndDate: ModelContractByStatusCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByStatus(
      contractState: $contractState
      contractTypeEndDate: $contractTypeEndDate
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
        tickets {
          nextToken
        }
        payments {
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
export const contractsByVendor = /* GraphQL */ `
  query ContractsByVendor(
    $vendorId: ID
    $endDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByVendor(
      vendorId: $vendorId
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
        tickets {
          nextToken
        }
        payments {
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
export const contractsByCommodity = /* GraphQL */ `
  query ContractsByCommodity(
    $commodityId: ID
    $endDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contractsByCommodity(
      commodityId: $commodityId
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
        tickets {
          nextToken
        }
        payments {
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
export const contractsByType = /* GraphQL */ `
  query ContractsByType(
    $contractType: ContractType
    $endDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContractFilterInput
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
        tickets {
          nextToken
        }
        payments {
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
export const paymentsByContract = /* GraphQL */ `
  query PaymentsByContract(
    $contractId: ID
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentsByContract(
      contractId: $contractId
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
        tickets {
          nextToken
        }
        checkNumber
        date
        amount
        totalPounds
        invoiceId
        settlementId
        tonsCredit
        overage
        underage
        paymentType
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
        tickets {
          nextToken
        }
        checkNumber
        date
        amount
        totalPounds
        invoiceId
        settlementId
        tonsCredit
        overage
        underage
        paymentType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const ticketsByContract = /* GraphQL */ `
  query TicketsByContract(
    $contractId: ID
    $ticketDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ticketsByContract(
      contractId: $contractId
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
        settlementId
        paymentId
        correspondingContractId
        type
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
export const ticketsByContractId = /* GraphQL */ `
  query TicketsByContractId(
    $contractId: ID
    $ticketNumber: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ticketsByContractId(
      contractId: $contractId
      ticketNumber: $ticketNumber
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        contractId
        invoiceId
        settlementId
        paymentId
        correspondingContractId
        type
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
        settlementId
        paymentId
        correspondingContractId
        type
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
