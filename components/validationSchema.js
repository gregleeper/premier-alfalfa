import { yupToFormErrors } from "formik";
import * as Yup from "yup";

export const CreateTicketSchema = Yup.object().shape({
  ticketNumber: Yup.string("must be a string")
    .min(2, "Should be longer")
    .required("Required"),
  contractId: Yup.string("must be a string")
    .min(2, "Select a contract")
    .required("Required"),
  correspondingContractId: Yup.string("must be a string")
    .min(2, "Select a corresponding contract")
    .required("Required"),
  fieldNum: Yup.string("must be a string"),

  ladingNumber: Yup.string("must be a string").min(2, "Should be longer"),
  driver: Yup.string("must be a string").min(2, "Should be longer"),
  truckNumber: Yup.string("string not entered"),
  grossWeight: Yup.number("needs to be a number").required("Required"),
  tareWeight: Yup.number("needs to be a number").required("Required"),
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
  dateSigned: Yup.date(),
  beginDate: Yup.date(),
  endDate: Yup.date(),
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
  date: Yup.date(),
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
