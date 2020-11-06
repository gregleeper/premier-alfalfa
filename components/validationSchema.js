import { yupToFormErrors } from "formik";
import * as Yup from "yup";

export const CreateTicketSchema = Yup.object().shape({
  ticketNumber: Yup.string().min(2, "Should be longer").required("Required"),
  contractId: Yup.string().min(2, "Select a contract").required("Required"),
  correspondingContractId: Yup.string()
    .min(2, "Select a corresponding contract")
    .required("Required"),
  ticketDate: Yup.date().required("Required"),
  type: Yup.string(),
  fieldNum: Yup.string(),
  baleCount: Yup.number(),

  ladingNumber: Yup.string().min(2, "Should be longer"),
  driver: Yup.string().min(2, "Should be longer"),
  truckNumber: Yup.string(),
  grossWeight: Yup.number(),
  tareWeight: Yup.number(),
  netWeight: Yup.number().required("Required"),
  netTons: Yup.number().required("Required"),
});

export const CreateCommoditySchema = Yup.object().shape({
  name: Yup.string().min(2, "Needs to be longer").required("Required"),
  calculateCode: Yup.number().required("Required"),
  billingCode: Yup.number().required("Required"),
});

export const CreateVendorSchema = Yup.object().shape({
  vendorNumber: Yup.string().min(3, "Needs to be longer").required("Required"),
  companyReportName: Yup.string().min(3, "Needs to be longer").optional(),
  companyListingName: Yup.string()
    .optional()
    .min(3, "Needs to be longer")
    .required("Required"),
  address1: Yup.string().min(3, "needs to be longer"),
  address2: Yup.string().optional(),
  city: Yup.string().min(2, "Needs to be longer"),
  state: Yup.string().min(2, "Needs to be longer"),
  zipCode: Yup.string().min(5, "Needs to be longer"),
  telephoneNumber: Yup.string().min(7, "Needs to be longer").optional(),
  attention: Yup.string().optional(),
  prePayment: Yup.boolean(),
  prePaymentAmount: Yup.number(),
});

export const CreateContractSchema = Yup.object().shape({
  contractNumber: Yup.string()
    .min(3, "Needs to be longer")
    .required("Required"),
  dateSigned: Yup.date().required("Required"),
  beginDate: Yup.date().required("Required"),
  endDate: Yup.date().required("Required"),
  contractType: Yup.string().oneOf(["PURCHASE", "SALE"]).required("Required"),
  contractState: Yup.string().oneOf(["ACTIVE", "CLOSED"]).required("Required"),
  vendorId: Yup.string().required("Required"),
  commodityId: Yup.string().required("Required"),
  quantity: Yup.number()
    .moreThan(0, "Needs to be greater than 0")
    .required("Required"),
  contractPrice: Yup.number().required("Required"),
  salePrice: Yup.number().required("Required"),
  terms: Yup.string(),
  weights: Yup.string(),
  basis: Yup.string(),
  remarks: Yup.string(),
});

export const CreatePaymentSchema = Yup.object().shape({
  tFileNumber: Yup.string().required("Required"),
  checkNumber: Yup.string().required("Required"),
  date: Yup.date().required("Required"),
  contractId: Yup.string().required("Required"),
  invoiceId: Yup.string(),
  settlementId: Yup.string(),
  amount: Yup.number()
    .moreThan(0, "Must be greater than 0")
    .required("Required"),
  totalPounds: Yup.number(),
  tonsCredit: Yup.number(),
  paymentType: Yup.string().required("Required"),
});
