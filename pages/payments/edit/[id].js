import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { FormikSelect } from "../../../components/formikSelect";
import { API } from "aws-amplify";
import { updatePayment } from "../../../src/graphql/mutations.ts";
import { listContracts, getPayment } from "../../../src/graphql/queries.ts";
import moment from "moment";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useQueryCache } from "react-query";

const UpdatePayment = () => {
  const cache = useQueryCache();
  const router = useRouter();
  const { id } = router.query;
  const [contracts, setContracts] = useState([]);
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
                checkNumber: payment.checkNumber || "",
                date: (payment && payment.date) || "",
                amount: (payment && payment.amount) || "",
                totalPounds: (payment && payment.totalPounds) || "",
                tonsCredit: (payment && payment.tonsCredit) || "",
                paymentType: (payment && payment.paymentType) || "",
              }}
              onSubmit={async (values, actions) => {
                const {
                  data: { updatePayment: myPayment },
                } = await API.graphql({
                  query: updatePayment,
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
                cache.setQueryData("payments", myPayment);
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
