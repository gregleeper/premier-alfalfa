import Layout from "../../components/layout";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import moment from "moment";
import { truncateString } from "../../utils";
import { FormikSelect } from "../../components/formikSelect";
import { API, withSSRContext } from "aws-amplify";
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
import { CreatePaymentSchema } from "../../components/validationSchema";

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
            validationSchema={CreatePaymentSchema}
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
            {({ isSubmitting, errors, touched }) => (
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
                    {errors.tFileNumber && touched.tFileNumber ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.tFileNumber}
                      </div>
                    ) : null}
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
                    {errors.checkNumber && touched.checkNumber ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.checkNumber}
                      </div>
                    ) : null}
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
                    {errors.date && touched.date ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.date}
                      </div>
                    ) : null}
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
                    {errors.contractId && touched.contractId ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.contractId}
                      </div>
                    ) : null}
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
                    {errors.invoiceId && touched.invoiceId ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.invoiceId}
                      </div>
                    ) : null}
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
                    {errors.settlementId && touched.settlementId ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.settlementId}
                      </div>
                    ) : null}
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
                    {errors.amount && touched.amount ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.amount}
                      </div>
                    ) : null}
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
                    {errors.totalPounds && touched.totalPounds ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.totalPounds}
                      </div>
                    ) : null}
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
                    {errors.tonsCredit && touched.tonsCredit ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.tonsCredit}
                      </div>
                    ) : null}
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
                    {errors.paymentType && touched.paymentType ? (
                      <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                        {errors.paymentType}
                      </div>
                    ) : null}
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

export async function getServerSideProps({ req, res }) {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();

    return {
      props: {
        authenticated: true,
        username: user.username,
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
    return {
      props: {
        authenticated: false,
      },
    };
  }
}

export default CreatePayment;
