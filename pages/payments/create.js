import Layout from "../../components/layout";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import moment from "moment";
import { FormikSelect } from "../../components/formikSelect";
import { FormikMultiSelect } from "../../components/formikMultiSelect";
import { API, withSSRContext } from "aws-amplify";
import { getContractAndTickets } from "../../src/graphql/customQueries";
import { createPayment, updateTicket } from "../../src/graphql/mutations.ts";
import { listContracts } from "../../src/graphql/queries.ts";
import { useQuery, useQueryCache, useMutation } from "react-query";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import { CreatePaymentSchema } from "../../components/validationSchema";

const CreatePayment = () => {
  const cache = useQueryCache();
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [dateEntered, setDateEntered] = useState(new Date());
  const [contractId, setContractId] = useState(null);
  const [contract, setContract] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [chosenTickets, setChosenTickets] = useState([]);
  const [ticketOptions, setTicketOptions] = useState([]);
  const [calculatedTonsCredit, setCalculatedTonsCredit] = useState(0);
  const [overage, setOverage] = useState(0);
  const [underage, setUnderage] = useState(0);

  const [totalPounds, setTotalPounds] = useState(0);
  const [totalTons, setTotalTons] = useState(0);

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
    {
      value: "EFT",
      label: "EFT",
    },
    {
      value: "WIRE",
      label: "Wire",
    },
  ]);

  const [mutate, { data, error, isSuccess }] = useMutation(
    async (input) => {
      const { data: paymentData } = await API.graphql({
        query: createPayment,
        variables: {
          input,
        },
      });
      return paymentData;
    },
    {
      onSuccess: ({ createPayment }) => {
        if (chosenTickets.length) {
          chosenTickets.map(async (ticket) => {
            const {
              data: { updateTicket: myTicket },
            } = await API.graphql({
              query: updateTicket,
              variables: {
                input: {
                  id: ticket.value,
                  paymentId: createPayment.id,
                },
              },
            });
            console.log(myTicket);
          });
        }

        const lengthOfGroups = cache.getQueryData("payments").length;
        // const items =  cache.getQueryData("payments")[lengthOfGroups - 1]
        //   .items;
        let previousData = cache.getQueryData("payments");
        previousData[lengthOfGroups - 1].items.push(createPayment);
        return () => cache.setQueryData("payments", () => [previousData]);
      },
    }
  );

  const { data: ticketsData, refetch: fetchTickets } = useQuery(
    "tickets",
    async () => {
      const { data: myTickets } = await API.graphql({
        query: getContractAndTickets,
        variables: {
          id: contractId,
          limit: 3000,
        },
      });
      return myTickets;
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

  // const { data: invoicesData } = useQuery("invoices", async () => {
  //   const {
  //     data: { invoicesSorted: myInvoices },
  //   } = await API.graphql({
  //     query: invoicesSorted,
  //     variables: {
  //       type: "Invoice",
  //       sortDirection: "DESC",
  //       limit: 3000,
  //     },
  //   });
  //   return myInvoices;
  // });

  // const { data: settlementsData } = useQuery("settlements", async () => {
  //   const {
  //     data: { settlementsSorted: mySettlements },
  //   } = await API.graphql({
  //     query: settlementsSorted,
  //     variables: {
  //       type: "Settlement",
  //       sortDirection: "DESC",
  //       limit: 3000,
  //     },
  //   });
  //   return mySettlements;
  // });

  useEffect(() => {
    if (ticketsData) {
      setTickets(ticketsData.ticketsByContract.items);
      setContract(ticketsData.getContract);
    }
  }, [ticketsData]);

  useEffect(() => {
    if (tickets.length) {
      let options = [];
      tickets.map((ticket) =>
        options.push({
          value: ticket.id,
          label: `${ticket.ticketNumber} - Net Tons: ${ticket.netTons}`,
        })
      );
      setTicketOptions(options);
    }
  }, [tickets]);

  useEffect(() => {
    if (contractId) {
      fetchTickets();
    }
  }, [contractId]);

  useEffect(() => {
    const diff = calculatedTonsCredit - totalTons;
    if (diff > 0) {
      setOverage(diff);
      setUnderage(0);
    }
    if (diff < 0) {
      setUnderage(Math.abs(diff));
      setOverage(0);
    }
    if (diff == 0) {
      setUnderage(0);
      setOverage(0);
    }
  }, [calculatedTonsCredit, totalTons]);

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

  const computeTotalPounds = (ids) => {
    let myTickets = [];
    for (let i = 0; i < tickets.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (tickets[i].id === ids[j].value) {
          myTickets.push(tickets[i]);
        }
      }
    }

    let total = myTickets.reduce(
      (accumulator, currentValue) => accumulator + currentValue.netWeight,
      0
    );

    setTotalPounds(total);
  };

  const computeTotalTons = (ids) => {
    let myTickets = [];
    for (let i = 0; i < tickets.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (tickets[i].id === ids[j].value) {
          myTickets.push(tickets[i]);
        }
      }
    }
    let total = myTickets.reduce(
      (accumulator, currentValue) => accumulator + currentValue.netTons,
      0
    );

    setTotalTons(total);
  };

  const handleAmountChange = (value) => {
    contract.contractPrice
      ? setCalculatedTonsCredit(value / contract.contractPrice)
      : setCalculatedTonsCredit(value / contract.salePrice);
  };

  const handleContractChange = (value) => {
    setContractId(value);
  };

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Payment</h3>
        </div>
        <div className="flex justify-center">
          <div className="w-8/12">
            <Formik
              initialValues={{
                type: "",
                tFileNumber: "",
                contractId: "",
                checkNumber: "",
                tickets: [],
                date: "",
                amount: 0,
                totalPounds: 0,
                tonsCredit: 0,
                paymentType: "",
              }}
              validationSchema={CreatePaymentSchema}
              onSubmit={async (values, actions) => {
                setChosenTickets(values.tickets);
                let input = {
                  type: "Payment",
                  tFileNumber: values.tFileNumber,
                  contractId: values.contractId,
                  checkNumber: values.checkNumber,
                  date: dateEntered,
                  amount: values.amount,
                  totalPounds: values.totalPounds,
                  overage: overage,
                  underage: underage,
                  tonsCredit: values.tonsCredit,
                  paymentType: values.paymentType,
                };
                mutate(input);

                router.back();
              }}
            >
              {({
                isSubmitting,
                errors,
                touched,
                values,
                setFieldTouched,
                setFieldValue,
              }) => (
                <Form>
                  {values.tickets && values.tickets.length
                    ? (computeTotalPounds(values.tickets),
                      computeTotalTons(values.tickets),
                      handleAmountChange(values.amount))
                    : (setTotalPounds(0), setTotalTons(0))}
                  {values.amount ? handleAmountChange(values.amount) : null}
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
                        handleChange={handleContractChange}
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
                        htmlFor="tickets"
                      >
                        Tickets
                      </label>
                      <Field
                        name="tickets"
                        className="w-1/2"
                        component={FormikMultiSelect}
                        componentName="tickets"
                        value={values.tickets && values.tickets}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        isClearable={true}
                        options={ticketOptions}
                      ></Field>
                    </div>
                    {/* <div className="flex justify-between items-center mb-4 w-full">
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
                  </div> */}
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
                        {`Total Pounds - ${totalPounds}`}
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
                        {`Tons Credit - ${totalTons}`}
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
                        type="button"
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
          <div className="px-12 border rounded-lg shadow-lg mr-24 pb-8 h-76">
            <div className="border-b-2 border-gray-700 pt-8">
              <h6 className="text-gray-800 text-lg font-light text-center ">
                Calculations
              </h6>
            </div>
            <div className="py-2">
              <span className="font-semibold">
                <span className=" text-gray-700 font-light">
                  Tons from tickets:{" "}
                </span>
                {totalTons.toLocaleString(underage, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="py-2">
              <span className="font-semibold">
                <span className=" text-gray-700 font-light">
                  Tons credit from payment:{" "}
                </span>
                {calculatedTonsCredit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="py-2">
              <span className="font-semibold">
                <span className=" text-gray-700 font-light"> Overage: </span>
                {overage.toLocaleString(underage, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="py-2">
              <span className="font-semibold">
                <span className=" text-gray-700 font-light">Underage: </span>
                {underage.toLocaleString(underage, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
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
