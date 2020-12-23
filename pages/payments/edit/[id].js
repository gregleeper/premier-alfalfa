import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { FormikSelect } from "../../../components/formikSelect";
import AmountInput from "../../../components/amountInput";
import { FormikMultiSelect } from "../../../components/formikMultiSelect";
import { API, withSSRContext } from "aws-amplify";
import Modal from "react-modal";
import {
  updatePayment,
  updateSettlement,
  updateTicket,
  updateInvoice,
  deletePayment,
} from "../../../src/graphql/mutations.ts";
import { listContracts } from "../../../src/graphql/queries.ts";
import {
  invoicesSorted,
  settlementsSorted,
  getContractAndTickets,
  getPayment,
} from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import moment from "moment";
import { useQuery, useMutation } from "react-query";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useQueryCache } from "react-query";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const UpdatePayment = () => {
  const queryCache = useQueryCache();
  const router = useRouter();
  const { id } = router.query;
  const [contracts, setContracts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketOptions, setTicketOptions] = useState([]);
  const [contractId, setContractId] = useState(null);
  const [calculatedTonsCredit, setCalculatedTonsCredit] = useState(0);
  const [contract, setContract] = useState({});
  const [totalPounds, setTotalPounds] = useState(0);
  const [totalTons, setTotalTons] = useState(0);
  const [payment, setPayment] = useState();
  const [ticketsOnPayment, setTicketsOnPayment] = useState([]);
  const [dateEntered, setDateEntered] = useState(new Date());
  const [modalIsOpen, setIsOpen] = useState(false);
  const [overage, setOverage] = useState(0);
  const [underage, setUnderage] = useState(0);
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
        // const items = queryCache.getQueryData("payments")[lengthOfGroups - 1]
        //   .items;
        let previousData = queryCache.getQueryData("payments");
        previousData[lengthOfGroups - 1].items.push(updatePayment);
        queryCache.invalidateQueries(["payment", { id }]);
        return () => queryCache.setQueryData("payments", () => [previousData]);
      },
    }
  );

  const { data: ticketsData, refetch: fetchTickets } = useQuery(
    ["tickets", id],
    async () => {
      const { data: myContractAndTickets } = await API.graphql({
        query: getContractAndTickets,
        variables: {
          id: contractId,
          limit: 3000,
        },
      });
      return myContractAndTickets;
    },
    {
      enabled: false,
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
        // const items = queryCache.getQueryData("settlements")[lengthOfGroups - 1]
        //   .items;
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
        // const items = queryCache.getQueryData("invoices")[lengthOfGroups - 1]
        //   .items;
        let previousData = queryCache.getQueryData("invoices");
        previousData[lengthOfGroups - 1].items.push(updateInvoice);
        return () => queryCache.setQueryData("invoices", () => [previousData]);
      },
    }
  );

  const [
    deletePaymentMutation,
    { data: deletedPayment, error: errorDeleting, isSuccess: deleteSuccess },
  ] = useMutation(
    async () => {
      const { data: paymentData } = await API.graphql({
        query: deletePayment,
        variables: {
          input: { id },
        },
      });
      return paymentData;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries("payments");
        router.back();
      },
    }
  );

  const { data: paymentData, refetch } = useQuery(
    ["payment", { id }],
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
      refetchOnMount: true,
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
    if (payment) {
      setContractId(payment.contract.id);
    }
  }, [payment]);

  // useEffect(() => {
  //   if (invoicesData) {
  //     let options = [];

  //     invoicesData.items.map((invoice) => {
  //       options.push({
  //         value: invoice.id,
  //         label: `${invoice.invoiceNumber} - ${
  //           invoice.vendor.companyReportName
  //         } - Due ${moment(invoice.dueDate).format("MM/DD/YY")} - ${
  //           invoice.tickets.items[0].contract.contractNumber
  //         } - ${formatMoney.format(invoice.amountOwed)}`,
  //       });
  //     });

  //     setInvoices(options);
  //   }
  // }, [invoicesData]);

  // useEffect(() => {
  //   if (settlementsData) {
  //     let options = [];
  //     settlementsData.items.map((settlement) => {
  //       options.push({
  //         value: settlement.id,
  //         label: `${settlement.settlementNumber} - ${
  //           settlement.vendor.companyReportName
  //         } - Due ${moment(settlement.dueDate).format("MM/DD/YY")}`,
  //       });
  //     });

  //     setSettlements(options);
  //   }
  // }, [settlementsData]);

  useEffect(() => {
    if (contractId) {
      fetchTickets();
    }
  }, [contractId]);

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
      setOverage(0);
      setUnderage(0);
    }
  }, [calculatedTonsCredit, totalTons]);

  console.log("o", overage, "u", underage);

  let initialTickets = [];
  if (payment && payment.tickets.items.length) {
    payment.tickets.items.map((ticket) => {
      initialTickets.push({
        value: ticket.id,
        label: `${ticket.ticketNumber} - ${ticket.netTons}`,
      });
    });
  }

  const handleDeletePayment = () => {
    // if payment has tickets, set paymentId to null on each ticket
    if (payment.tickets.items.length) {
      payment.tickets.items.map(async (ticket) => {
        const {
          data: { updateTicket: myTicket },
        } = await API.graphql({
          query: updateTicket,
          variables: {
            input: {
              id: ticket.id,
              paymentId: null,
            },
          },
        });
      });
    }
    // if payment has settlement, set paymentId to null on settlement
    if (payment.settlementId) {
      const input = {
        id: payment.settlementId,
        paymentId: null,
      };
      mutateSettlement(input);
    }
    if (payment.invoiceId) {
      const input = {
        id: payment.invoiceId,
        paymentId: null,
      };
      mutateInvoice(input);
    }

    deletePaymentMutation();
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAmountChange = (value) => {
    contract.contractPrice
      ? setCalculatedTonsCredit(value / contract.contractPrice)
      : setCalculatedTonsCredit(value / contract.salePrice);
  };

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Update Payment</h3>
        </div>
        <div className="flex">
          <div className="w-8/12">
            {payment && (
              <Formik
                initialValues={{
                  type: "Payment",
                  tFileNumber: payment.tFileNumber || "",
                  contractId: payment.contractId || "",
                  invoiceId: payment.invoiceId || "",
                  settlementId: payment.settlementId || "",
                  tickets: initialTickets || [],
                  checkNumber: payment.checkNumber || "",
                  date: (payment && payment.date) || "",
                  amount: (payment && payment.amount) || "",
                  totalPounds: (payment && payment.totalPounds) || "",
                  tonsCredit: (payment && payment.tonsCredit) || "",
                  paymentType: (payment && payment.paymentType) || "",
                }}
                onSubmit={async (values, actions) => {
                  let ticketArray = [];
                  values.tickets.map((item) => ticketArray.push(item.value));

                  initialTickets.forEach(async (ticket) => {
                    if (!ticketArray.includes(ticket.value)) {
                      const {
                        data: { updateTicket: myTicket },
                      } = await API.graphql({
                        query: updateTicket,
                        variables: {
                          input: {
                            id: ticket.value,
                            paymentId: null,
                          },
                        },
                      });
                    }
                  });
                  values.tickets.map(async (ticket) => {
                    const {
                      data: { updateTicket: myTicket },
                    } = await API.graphql({
                      query: updateTicket,
                      variables: {
                        input: {
                          id: ticket.value,
                          paymentId: id,
                        },
                      },
                    });
                  });
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
                    overage: overage,
                    underage: underage,
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
                {({ isSubmitting, values, setFieldValue, setFieldTouched }) => (
                  <Form>
                    {values.tickets && values.tickets.length
                      ? (computeTotalPounds(values.tickets),
                        computeTotalTons(values.tickets),
                        handleAmountChange(values.amount))
                      : (setTotalPounds(0), setTotalTons(0))}

                    {values.amount ? handleAmountChange(values.amount) : null}

                    <div className="w-8/12 mx-auto">
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
                          className="w-3/4"
                          component={FormikSelect}
                          handleChange={() => setContractId(value)}
                          options={contracts}
                        ></Field>
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
                          value={values.tickets}
                          onChange={setFieldValue}
                          onBlur={setFieldTouched}
                          isClearable={true}
                          options={ticketOptions}
                        ></Field>
                      </div>
                      {/* <div className="flex justify-between items-center mb-4 w-full">
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
                    </div> */}
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
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <label
                          className="w-1/4 text-gray-900 md:w-1/2"
                          htmlFor="tonsCredit"
                        >
                          {`Tons Credit - (target: ${totalTons})`}
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
            )}
          </div>
          <div className="w-4/12">
            <div className="w-48 mb-24">
              <button
                className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                type="button"
                onClick={() => openModal()}
              >
                Delete Payment
              </button>
            </div>
            <div className="px-12 border rounded-lg shadow-lg mr-24 pb-8">
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
          <div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => closeModal}
              style={customStyles}
              contentLabel="Delete ticket"
            >
              <div>
                <p>Are you sure you want to delete this payment?</p>
                <div>
                  <button
                    className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                    type="button"
                    onClick={() => handleDeletePayment()}
                  >
                    Delete Payment
                  </button>
                  <button
                    className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                    type="button"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
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

export default UpdatePayment;
