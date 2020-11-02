import Layout from "../../components/layout";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import moment from "moment";
import { truncateString } from "../../utils";
import { FormikSelect } from "../../components/formikSelect";
import { API } from "aws-amplify";
import {
  invoicesSorted,
  settlementsSorted,
} from "../../src/graphql/customQueries";
import { createPayment } from "../../src/graphql/mutations.ts";
import { listContracts } from "../../src/graphql/queries.ts";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useQueryCache } from "react-query";

const CreatePayment = () => {
  const cache = useQueryCache();
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [dateEntered, setDateEntered] = useState(new Date());
  const [invoices, setInvoices] = useState([]);
  const [settlements, setSettlements] = useState([]);
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

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Payment</h3>
        </div>
        <div>
          <Formik
            initialValues={{
              type: "",
              tFileNumber: "",
              contractId: "",
              checkNumber: "",
              date: "",
              amount: 0,
              totalPounds: 0,
              tonsCredit: 0,
              paymentType: "",
            }}
            onSubmit={async (values, actions) => {
              const {
                data: { createPayment: payment },
              } = await API.graphql({
                query: createPayment,
                variables: {
                  input: {
                    type: "Payment",
                    tFileNumber: values.tFileNumber,
                    contractId: values.contractId,
                    checkNumber: values.checkNumber,
                    date: dateEntered,
                    amount: values.amount,
                    totalPounds: values.totalPounds,
                    tonsCredit: values.tonsCredit,
                    paymentType: values.paymentType,
                  },
                },
              });
              cache.invalidateQueries("payments");
              cache.setQueryData("payments", payment);
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
                      className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
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
        </div>
      </div>
    </Layout>
  );
};

export default CreatePayment;
