/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const batchAddVendors = /* GraphQL */ `
  mutation BatchAddVendors($vendors: [CreateVendorInput]) {
    batchAddVendors(vendors: $vendors) {
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
export const batchAddContracts = /* GraphQL */ `
  mutation BatchAddContracts($contracts: [CreateContractInput]) {
    batchAddContracts(contracts: $contracts) {
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
export const batchAddTickets = /* GraphQL */ `
  mutation BatchAddTickets($tickets: [CreateTicketInput]) {
    batchAddTickets(tickets: $tickets) {
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
export const batchAddPayments = /* GraphQL */ `
  mutation BatchAddPayments($payments: [CreatePaymentInput]) {
    batchAddPayments(payments: $payments) {
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
export const createCompanyInfo = /* GraphQL */ `
  mutation CreateCompanyInfo(
    $input: CreateCompanyInfoInput!
    $condition: ModelCompanyInfoConditionInput
  ) {
    createCompanyInfo(input: $input, condition: $condition) {
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
export const updateCompanyInfo = /* GraphQL */ `
  mutation UpdateCompanyInfo(
    $input: UpdateCompanyInfoInput!
    $condition: ModelCompanyInfoConditionInput
  ) {
    updateCompanyInfo(input: $input, condition: $condition) {
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
export const deleteCompanyInfo = /* GraphQL */ `
  mutation DeleteCompanyInfo(
    $input: DeleteCompanyInfoInput!
    $condition: ModelCompanyInfoConditionInput
  ) {
    deleteCompanyInfo(input: $input, condition: $condition) {
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
export const createCommodity = /* GraphQL */ `
  mutation CreateCommodity(
    $input: CreateCommodityInput!
    $condition: ModelCommodityConditionInput
  ) {
    createCommodity(input: $input, condition: $condition) {
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
export const updateCommodity = /* GraphQL */ `
  mutation UpdateCommodity(
    $input: UpdateCommodityInput!
    $condition: ModelCommodityConditionInput
  ) {
    updateCommodity(input: $input, condition: $condition) {
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
export const deleteCommodity = /* GraphQL */ `
  mutation DeleteCommodity(
    $input: DeleteCommodityInput!
    $condition: ModelCommodityConditionInput
  ) {
    deleteCommodity(input: $input, condition: $condition) {
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
export const createSettlement = /* GraphQL */ `
  mutation CreateSettlement(
    $input: CreateSettlementInput!
    $condition: ModelSettlementConditionInput
  ) {
    createSettlement(input: $input, condition: $condition) {
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
export const updateSettlement = /* GraphQL */ `
  mutation UpdateSettlement(
    $input: UpdateSettlementInput!
    $condition: ModelSettlementConditionInput
  ) {
    updateSettlement(input: $input, condition: $condition) {
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
export const deleteSettlement = /* GraphQL */ `
  mutation DeleteSettlement(
    $input: DeleteSettlementInput!
    $condition: ModelSettlementConditionInput
  ) {
    deleteSettlement(input: $input, condition: $condition) {
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
export const createInvoice = /* GraphQL */ `
  mutation CreateInvoice(
    $input: CreateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    createInvoice(input: $input, condition: $condition) {
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
export const updateInvoice = /* GraphQL */ `
  mutation UpdateInvoice(
    $input: UpdateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    updateInvoice(input: $input, condition: $condition) {
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
export const deleteInvoice = /* GraphQL */ `
  mutation DeleteInvoice(
    $input: DeleteInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    deleteInvoice(input: $input, condition: $condition) {
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
export const createVendor = /* GraphQL */ `
  mutation CreateVendor(
    $input: CreateVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    createVendor(input: $input, condition: $condition) {
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
export const updateVendor = /* GraphQL */ `
  mutation UpdateVendor(
    $input: UpdateVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    updateVendor(input: $input, condition: $condition) {
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
export const deleteVendor = /* GraphQL */ `
  mutation DeleteVendor(
    $input: DeleteVendorInput!
    $condition: ModelVendorConditionInput
  ) {
    deleteVendor(input: $input, condition: $condition) {
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
export const createContract = /* GraphQL */ `
  mutation CreateContract(
    $input: CreateContractInput!
    $condition: ModelContractConditionInput
  ) {
    createContract(input: $input, condition: $condition) {
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
export const updateContract = /* GraphQL */ `
  mutation UpdateContract(
    $input: UpdateContractInput!
    $condition: ModelContractConditionInput
  ) {
    updateContract(input: $input, condition: $condition) {
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
export const deleteContract = /* GraphQL */ `
  mutation DeleteContract(
    $input: DeleteContractInput!
    $condition: ModelContractConditionInput
  ) {
    deleteContract(input: $input, condition: $condition) {
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
export const createPayment = /* GraphQL */ `
  mutation CreatePayment(
    $input: CreatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    createPayment(input: $input, condition: $condition) {
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
export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment(
    $input: UpdatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    updatePayment(input: $input, condition: $condition) {
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
export const deletePayment = /* GraphQL */ `
  mutation DeletePayment(
    $input: DeletePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    deletePayment(input: $input, condition: $condition) {
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
export const createTicket = /* GraphQL */ `
  mutation CreateTicket(
    $input: CreateTicketInput!
    $condition: ModelTicketConditionInput
  ) {
    createTicket(input: $input, condition: $condition) {
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
export const updateTicket = /* GraphQL */ `
  mutation UpdateTicket(
    $input: UpdateTicketInput!
    $condition: ModelTicketConditionInput
  ) {
    updateTicket(input: $input, condition: $condition) {
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
export const deleteTicket = /* GraphQL */ `
  mutation DeleteTicket(
    $input: DeleteTicketInput!
    $condition: ModelTicketConditionInput
  ) {
    deleteTicket(input: $input, condition: $condition) {
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
