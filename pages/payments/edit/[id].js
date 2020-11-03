import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { FormikSelect } from "../../../components/formikSelect";
import { API } from "aws-amplify";
import {
  updatePayment,
  updateSettlement,
  updateInvoice,
} from "../../../src/graphql/mutations.ts";
import { listContracts, getPayment } from "../../../src/graphql/queries.ts";
import {
  invoicesSorted,
  settlementsSorted,
} from "../../../src/graphql/customQueries";
import moment from "moment";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useQueryCache } from "react-query";

const UpdatePayment = () => {
  const queryCache = useQueryCache();
  const router = useRouter();
  const { id } = router.query;
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [payment, setPayment] = useState();
  const [dateEntered, setDateEntered] = useState(new Date());
  const [paymentTypes, setPaymentTypes] = useState([
    {
      value: "CHECKS",
      label: "Check",
    },
    {
      value: "CASH",
      label: "Cash",
    },
    {
      value: "CREDITCARD",
      label: "Credit Card",
    },
  ]);

  const [mutate, { data, error, isSuccess }] = useMutation(
    async (input) => {
      const { data: paymentData } = await API.graphql({
        query: updatePayment,
        variables: {
          input,
        },
      });
      return paymentData;
    },
    {
      onSuccess: ({ updatePayment }) => {
        const lengthOfGroups = queryCache.getQueryData("payments").length;
        const items = queryCache.getQueryData("payments")[lengthOfGroups - 1]
          .items;
        let previousData = queryCache.getQueryData("payments");
        previousData[lengthOfGroups - 1].items.push(updatePayment);
        return () => queryCache.setQueryData("payments", () => [previousData]);
      },
    }
  );

  const [
    mutateSettlement,
    {
      data: settlementData,
      error: settlementError,
      isSuccess: settlementSuccess,
    },
  ] = useMutation(
    async (input) => {
      const { data: mySettlementData } = await API.graphql({
        query: updateSettlement,
        variables: {
          input,
        },
      });
      return mySettlementData;
    },
    {
      onSuccess: ({ updateSettlement }) => {
        const lengthOfGroups = queryCache.getQueryData("settlements").length;
        const items = queryCache.getQueryData("settlements")[lengthOfGroups - 1]
          .items;
        let previousData = queryCache.getQueryData("settlements");
        previousData[lengthOfGroups - 1].items.push(updateSettlement);
        return () =>
          queryCache.setQueryData("settlements", () => [previousData]);
      },
    }
  );

  const [
    mutateInvoice,
    { data: invoiceData, error: invoiceError, isSuccess: invoiceSuccess },
  ] = useMutation(
    async (input) => {
      const { data: myInvoiceData } = await API.graphql({
        query: updateInvoice,
        variables: {
          input,
        },
      });
      return myInvoiceData;
    },
    {
      onSuccess: ({ updateInvoice }) => {
        const lengthOfGroups = queryCache.getQueryData("invoices").length;
        const items = queryCache.getQueryData("invoices")[lengthOfGroups - 1]
          .items;
        let previousData = queryCache.getQueryData("invoices");
        previousData[lengthOfGroups - 1].items.push(updateInvoice);
        return () => queryCache.setQueryData("invoices", () => [previousData]);
      },
    }
  );

  const { data: paymentData, refetch } = useQuery(
    "payment",
    async () => {
      const {
        data: { getPayment: myPayment },
      } = await API.graphql({
        query: getPayment,
        variables: {
          id,
        },
      });
      return myPayment;
    },
    {
      enabled: false,
    }
  );

  const { data: contractsData } = useQuery("contracts", async () => {
    const {
      data: { listContracts: myContracts },
    } = await API.graphql({
      query: listContracts,
      variables: {
        limit: 3000,
      },
    });
    return myContracts;
  });

  const { data: invoicesData } = useQuery("invoices", async () => {
    const {
      data: { invoicesSorted: myInvoices },
    } = await API.graphql({
      query: invoicesSorted,
      variables: {
        type: "Invoice",
        sortDirection: "DESC",
        limit: 3000,
      },
    });
    return myInvoices;
  });

  const { data: settlementsData } = useQuery("settlements", async () => {
    const {
      data: { settlementsSorted: mySettlements },
    } = await API.graphql({
      query: settlementsSorted,
      variables: {
        type: "Settlement",
        sortDirection: "DESC",
        limit: 3000,
      },
    });
    return mySettlements;
  });

  useEffect(() => {
    if (contractsData) {
      let options = [];
      contractsData.items.map((c) => {
        options.push({
          value: c.id,
          label: `${c.contractNumber} - ${c.contractTo.companyReportName} - ${c.contractType}`,
        });
      });
      setContracts(options);
    }
  }, [contractsData]);

  useEffect(() => {
    if (invoicesData) {
      let options = [];
      invoicesData.items.map((invoice) => {
        options.push({
          value: invoice.id,
          label: `${invoice.invoiceNumber} - ${
            invoice.vendor.companyReportName
          } - Due ${moment(invoice.dueDate).format("MM/DD/YY")}`,
        });
      });

      setInvoices(options);
    }
  }, [invoicesData]);

  useEffect(() => {
    if (settlementsData) {
      let options = [];
      settlementsData.items.map((settlement) => {
        options.push({
          value: settlement.id,
          label: `${settlement.settlementNumber} - ${
            settlement.vendor.companyReportName
          } - Due ${moment(settlement.dueDate).format("MM/DD/YY")}`,
        });
      });

      setSettlements(options);
    }
  }, [settlementsData]);

  useEffect(() => {
    if (paymentData) {
      setPayment(paymentData);
      setDateEntered(moment(paymentData.date)._d);
    }
  }, [paymentData]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Update Payment</h3>
        </div>
        <div>
          {payment && (
            <Formik
              initialValues={{
                type: "Payment",
                tFileNumber: payment.tFileNumber || "",
                contractId: payment.contractId || "",
                invoiceId: payment.invoiceId || "",
                settlementId: payment.settlementId || "",
                checkNumber: payment.checkNumber || "",
                date: (payment && payment.date) || "",
                amount: (payment && payment.amount) || "",
                totalPounds: (payment && payment.totalPounds) || "",
                tonsCredit: (payment && payment.tonsCredit) || "",
                paymentType: (payment && payment.paymentType) || "",
              }}
              onSubmit={async (values, actions) => {
                let input = {
                  id,
                  type: "Payment",
                  tFileNumber: values.tFileNumber,
                  contractId: values.contractId,
                  invoiceId: values.invoiceId,
                  settlementId: values.settlementId,
                  checkNumber: values.checkNumber,
                  date: dateEntered,
                  amount: values.amount,
                  totalPounds: values.totalPounds,
                  tonsCredit: values.tonsCredit,
                  paymentType: values.paymentType,
                };
                mutate(input);

                if (
                  values.settlementId !== payment.settlementId &&
                  values.settlementId
                ) {
                  let input2 = {
                    id: values.settlementId,
                    isPaid: true,
                  };
                  mutateSettlement(input2);
                }

                if (
                  values.invoiceId !== payment.invoiceId &&
                  values.invoiceId
                ) {
                  let input3 = {
                    id: values.invoiceId,
                    isPaid: true,
                  };
                  mutateInvoice(input3);
                }
                router.back();
              }}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <div className="w-7/12 mx-auto">
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="tFileNumber"
                      >
                        Ticket File Number
                      </label>
                      <Field
                        className="form-input w-full"
                        name="tFileNumber"
                        placeholder="Ticket File Number"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="checkNumber"
                      >
                        Check Number
                      </label>
                      <Field
                        className="form-input w-full"
                        name="checkNumber"
                        placeholder="Check Number"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4 ">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="date"
                      >
                        Date
                      </label>
                      <DatePicker
                        className="w-full"
                        selected={dateEntered}
                        onChange={(date) => setDateEntered(date)}
                        className="form-input w-full"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4 w-full">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                        htmlFor="contractId"
                      >
                        Contract
                      </label>
                      <Field
                        name="contractId"
                        className="w-1/2"
                        component={FormikSelect}
                        options={contracts}
                      ></Field>
                    </div>
                    <div className="flex justify-between items-center mb-4 w-full">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                        htmlFor="invoiceId"
                      >
                        Invoice
                      </label>
                      <Field
                        name="invoiceId"
                        className="w-1/2"
                        component={FormikSelect}
                        options={invoices}
                      ></Field>
                    </div>
                    <div className="flex justify-between items-center mb-4 w-full">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                        htmlFor="settlementId"
                      >
                        Settlement
                      </label>
                      <Field
                        name="settlementId"
                        className="w-1/2"
                        component={FormikSelect}
                        options={settlements}
                      ></Field>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="amount"
                      >
                        Amount
                      </label>
                      <Field
                        className="form-input w-full"
                        name="amount"
                        type="number"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="totalPounds"
                      >
                        Total Pounds
                      </label>
                      <Field
                        className="form-input w-full"
                        name="totalPounds"
                        type="number"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="tonsCredit"
                      >
                        Tons Credit
                      </label>
                      <Field
                        className="form-input w-full"
                        name="tonsCredit"
                        type="number"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4 w-full">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                        htmlFor="paymentType"
                      >
                        Payment Type
                      </label>
                      <Field
                        name="paymentType"
                        className="w-full"
                        component={FormikSelect}
                        options={paymentTypes}
                      />
                    </div>
                    <div className="flex justify-center mt-12">
                      <button
                        className="border border-blue-400 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdatePayment;
