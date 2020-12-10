/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCompanyInfo = /* GraphQL */ `
  subscription OnCreateCompanyInfo {
    onCreateCompanyInfo {
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
export const onUpdateCompanyInfo = /* GraphQL */ `
  subscription OnUpdateCompanyInfo {
    onUpdateCompanyInfo {
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
export const onDeleteCompanyInfo = /* GraphQL */ `
  subscription OnDeleteCompanyInfo {
    onDeleteCompanyInfo {
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
export const onCreateCommodity = /* GraphQL */ `
  subscription OnCreateCommodity {
    onCreateCommodity {
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
export const onUpdateCommodity = /* GraphQL */ `
  subscription OnUpdateCommodity {
    onUpdateCommodity {
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
export const onDeleteCommodity = /* GraphQL */ `
  subscription OnDeleteCommodity {
    onDeleteCommodity {
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
export const onCreateSettlement = /* GraphQL */ `
  subscription OnCreateSettlement {
    onCreateSettlement {
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
export const onUpdateSettlement = /* GraphQL */ `
  subscription OnUpdateSettlement {
    onUpdateSettlement {
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
export const onDeleteSettlement = /* GraphQL */ `
  subscription OnDeleteSettlement {
    onDeleteSettlement {
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
export const onCreateInvoice = /* GraphQL */ `
  subscription OnCreateInvoice {
    onCreateInvoice {
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
export const onUpdateInvoice = /* GraphQL */ `
  subscription OnUpdateInvoice {
    onUpdateInvoice {
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
export const onDeleteInvoice = /* GraphQL */ `
  subscription OnDeleteInvoice {
    onDeleteInvoice {
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
export const onCreateVendor = /* GraphQL */ `
  subscription OnCreateVendor {
    onCreateVendor {
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
export const onUpdateVendor = /* GraphQL */ `
  subscription OnUpdateVendor {
    onUpdateVendor {
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
export const onDeleteVendor = /* GraphQL */ `
  subscription OnDeleteVendor {
    onDeleteVendor {
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
export const onCreateContract = /* GraphQL */ `
  subscription OnCreateContract {
    onCreateContract {
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
export const onUpdateContract = /* GraphQL */ `
  subscription OnUpdateContract {
    onUpdateContract {
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
export const onDeleteContract = /* GraphQL */ `
  subscription OnDeleteContract {
    onDeleteContract {
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
export const onCreatePayment = /* GraphQL */ `
  subscription OnCreatePayment {
    onCreatePayment {
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
export const onUpdatePayment = /* GraphQL */ `
  subscription OnUpdatePayment {
    onUpdatePayment {
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
export const onDeletePayment = /* GraphQL */ `
  subscription OnDeletePayment {
    onDeletePayment {
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
export const onCreateTicket = /* GraphQL */ `
  subscription OnCreateTicket {
    onCreateTicket {
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
export const onUpdateTicket = /* GraphQL */ `
  subscription OnUpdateTicket {
    onUpdateTicket {
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
export const onDeleteTicket = /* GraphQL */ `
  subscription OnDeleteTicket {
    onDeleteTicket {
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
