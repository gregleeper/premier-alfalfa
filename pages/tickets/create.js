import { Formik, Field, Form } from "formik";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FormikSelect } from "../../components/formikSelectTickets";
import Layout from "../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { createTicket } from "../../src/graphql/mutations.ts";
import { listContracts } from "../../src/graphql/queries.ts";
import { ticketsByContract } from "../../src/graphql/customQueries";
import DatePicker from "react-datepicker";
import { truncateString } from "../../utils";
import { useQuery, useMutation, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { CreateTicketSchema } from "../../components/validationSchema";

const CreateTicket = () => {
  const queryCache = useQueryCache();
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [correspondingContracts, setCorrespondingContracts] = useState([]);
  const [ticketDate, setTicketDate] = useState(new Date());
  const [ticketSuccess1, setTicketSuccess1] = useState(false);
  const [ticketSuccess2, setTicketSuccess2] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [
    purchasedFromQtyRemaining,
    setPurchasedFromQuantityRemaining,
  ] = useState(null);
  const [soldToQtyRemaining, setSoldToQuantityRemaining] = useState(null);
  const [correspondingContractId, setCorrespondingContractId] = useState(null);
  const [ticketError, setTicketError] = useState(null);

  const [createdTickets, setCreatedTickets] = useState([]);

  const [mutate, { data, error, isSuccess }] = useMutation(
    async (input) => {
      const { data: ticketData } = await API.graphql({
        query: createTicket,
        variables: {
          input,
        },
      });
      return ticketData;
    },
    {
      onSuccess: ({ createTicket }) => {
        let ticketsCreated = [...createdTickets];
        ticketsCreated.push(createTicket);

        setCreatedTickets(ticketsCreated);
        const lengthOfGroups = queryCache.getQueryData("tickets").length;

        let previousData = queryCache.getQueryData("tickets");
        previousData[lengthOfGroups - 1].items.push(createTicket);
        return () => queryCache.setQueryData("tickets", () => [previousData]);
      },
      onError: ({ ticketError }) => {
        setTicketError(ticketError);
      },
    }
  );

  const { data: contractsData } = useQuery(
    "contracts",
    async () => {
      const {
        data: { listContracts: contractsData },
      } = await API.graphql({
        query: listContracts,
        variables: {
          limit: 3000,
        },
      });
      return contractsData;
    },
    {
      cacheTime: 1000 * 60 * 20,
    }
  );

  const getPurchasedFromTickets = async () => {
    const {
      data: {
        ticketsByContract: { items: purchasedFromTickets },
      },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        contractId,
        limit: 1000,
      },
    });
    if (purchasedFromTickets.length > 0) {
      const contractNumber = purchasedFromTickets[0].contract.contractNumber;
      const contractedQty = purchasedFromTickets[0].contract.quantity;
      const qtyRemaining =
        contractedQty -
        purchasedFromTickets.reduce((acc, cv) => acc + cv.netTons, 0);

      setPurchasedFromQuantityRemaining({
        contractNumber,
        contractedQty,
        qtyRemaining,
      });
    } else {
      const contract = contractsData.items.findIndex(
        (contract) => contract.id === contractId
      );
      const myContract = contractsData.items[contract];
      console.log(myContract);
      setPurchasedFromQuantityRemaining({
        contractNumber: myContract.contractNumber,
        contractedQty: myContract.quantity,
        qtyRemaining: myContract.quantity,
      });
    }
  };

  const getSoldToTickets = async () => {
    const {
      data: {
        ticketsByContract: { items: soldToTickets },
      },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        contractId: correspondingContractId,
        limit: 1000,
      },
    });

    if (soldToTickets.length > 0) {
      const contractNumber = soldToTickets[0].contract.contractNumber;
      const contractedQty = soldToTickets[0].contract.quantity;
      const qtyRemaining =
        contractedQty - soldToTickets.reduce((acc, cv) => acc + cv.netTons, 0);

      setSoldToQuantityRemaining({
        contractNumber,
        contractedQty,
        qtyRemaining,
      });
    } else {
      const contract = contractsData.items.findIndex(
        (contract) => contract.id === correspondingContractId
      );
      const myContract = contractsData.items[contract];
      console.log(myContract);
      setSoldToQuantityRemaining({
        contractNumber: myContract.contractNumber,
        contractedQty: myContract.quantity,
        qtyRemaining: myContract.quantity,
      });
    }
  };

  const handleContractIdChange = (value) => {
    setContractId(value);
  };

  const handleCorrespondingContractIdChange = (value) => {
    console.log(value);
    setCorrespondingContractId(value);
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
      setCorrespondingContracts(options);
    }
  }, [contractsData]);

  useEffect(() => {
    if (contractId) {
      getPurchasedFromTickets();
    }
    if (correspondingContractId) {
      getSoldToTickets();
    }
  }, [contractId, correspondingContractId]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Create Ticket</h3>
        </div>
        <div className="flex justify-around relative ">
          <div className="w-1/2">
            <Formik
              initialValues={{
                contractId: "",
                correspondingContractId: "",
                ticketDate: ticketDate,
                fieldNum: "",
                baleCount: 0,
                ticketNumber: "",
                ladingNumber: "",
                driver: "",
                truckNumber: "",
                grossWeight: 0,
                tareWeight: 0,
                netWeight: 0,
                netTons: 0,
              }}
              validationSchema={CreateTicketSchema}
              onSubmit={async (values, actions) => {
                let netWeight = values.grossWeight - values.tareWeight;
                let netTons = netWeight / 2000;

                const input1 = {
                  contractId: values.contractId,
                  correspondingContractId: values.correspondingContractId,
                  ticketDate: ticketDate,
                  fieldNum: values.fieldNum,
                  baleCount: values.baleCount === "" ? null : values.baleCount,
                  ticketNumber: values.ticketNumber,
                  ladingNumber: values.ladingNumber,
                  driver: values.driver,
                  type: "Ticket",
                  truckNumber: values.truckNumber,
                  grossWeight: values.grossWeight,
                  tareWeight: values.tareWeight,
                  netWeight,
                  netTons,
                };
                try {
                  mutate(input1);
                  setTicketSuccess1(true);
                } catch (err) {
                  if (err) {
                    setTicketError(err);
                  }
                }

                const input2 = {
                  contractId: values.correspondingContractId,
                  correspondingContractId: values.contractId,
                  ticketDate: ticketDate,
                  fieldNum: values.fieldNum,
                  baleCount: values.baleCount === "" ? null : values.baleCount,
                  ticketNumber: values.ticketNumber,
                  ladingNumber: values.ladingNumber,
                  driver: values.driver,
                  type: "Ticket",
                  truckNumber: values.truckNumber,
                  grossWeight: values.grossWeight,
                  tareWeight: values.tareWeight,
                  netWeight,
                  netTons,
                };
                try {
                  mutate(input2);
                  setTicketSuccess2(true);
                } catch (err) {
                  if (err) {
                    setTicketError(err);
                  }
                }

                setTimeout(() => {
                  setTicketSuccess1(false);
                  setTicketSuccess2(false);
                  setCorrespondingContractId(null);
                  setContractId(null);
                }, 2000);
                actions.resetForm();
              }}
            >
              {({ isSubmitting, errors, touched, values }) => (
                <Form>
                  <div className="w-full mx-auto">
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="ticketNumber"
                      >
                        Ticket Number
                      </label>
                      <Field
                        className="form-input w-full"
                        name="ticketNumber"
                        placeholder="Ticket Number"
                        autoComplete="on"
                      />
                      {errors.ticketNumber && touched.ticketNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.ticketNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="contractId"
                      >
                        Contract Number - Purchased From
                      </label>
                      <Field
                        className="form-select w-full"
                        component={FormikSelect}
                        options={contracts}
                        name="contractId"
                        handleChange={handleContractIdChange}
                        placeholder="Contract Number"
                      />
                      {errors.contractId && touched.contractId ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.contractId}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="correspondingContractId"
                      >
                        Corresponding Contract Number - Sold To
                      </label>
                      <Field
                        className="form-select w-full"
                        component={FormikSelect}
                        options={correspondingContracts}
                        handleChange={handleCorrespondingContractIdChange}
                        name="correspondingContractId"
                        placeholder="Contract Number"
                      />
                      {errors.correspondingContractId &&
                      touched.correspondingContractId ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.correspondingContractId}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="ticketDate"
                      >
                        Ticket Date
                      </label>
                      <DatePicker
                        selected={ticketDate}
                        onChange={(date) => {
                          console.log(date), setTicketDate(date);
                        }}
                        className="form-input w-full"
                      />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="fieldNum"
                      >
                        Field Number
                      </label>

                      <Field
                        className="form-input w-full"
                        name="fieldNum"
                        placeholder="Field Number"
                      />
                      {errors.fieldNum && touched.fieldNum ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.fieldNum}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2"
                        htmlFor="baleCount"
                      >
                        Bale Count
                      </label>

                      <Field
                        className="form-input w-full"
                        name="baleCount"
                        placeholder="Bale Count"
                        type="number"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4 w-full">
                      <label
                        className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                        name="ladingNumber"
                      >
                        Lading Number
                      </label>
                      <Field
                        className="form-input w-full"
                        name="ladingNumber"
                        placeholder="Lading Number"
                      />
                      {errors.ladingNumber && touched.ladingNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.ladingNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="driver"
                      >
                        Driver
                      </label>
                      <Field
                        className="form-input w-full"
                        name="driver"
                        placeholder="Driver"
                      />
                      {errors.drivers && touched.drivers ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.drivers}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="truckNumber"
                      >
                        Truck Number
                      </label>
                      <Field
                        className="form-input w-full"
                        name="truckNumber"
                        placeholder="Truck Number"
                      />
                      {errors.truckNumber && touched.truckNumber ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.truckNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="grossWeight"
                      >
                        Gross Weight
                      </label>
                      <Field
                        className="form-input w-full"
                        name="grossWeight"
                        type="number"
                      />
                      {errors.grossWeight && touched.grossWeight ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.grossWeight}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="tareWeight"
                      >
                        Tare Weight
                      </label>
                      <Field
                        className="form-input w-full"
                        name="tareWeight"
                        type="number"
                      />
                      {errors.tareWeight && touched.tareWeight ? (
                        <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                          {errors.tareWeight}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="netWeight"
                      >
                        Net Weight
                      </label>
                      <div>
                        <span>
                          {values.grossWeight && values.tareWeight
                            ? (values.grossWeight - values.tareWeight).toFixed(
                                2
                              )
                            : "Not calculated"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <label
                        className="w-1/4 text-gray-900 md:w-1/2"
                        htmlFor="netTons"
                      >
                        Net Tons
                      </label>
                      <div>
                        <span>
                          {values.grossWeight && values.tareWeight
                            ? (
                                (values.grossWeight - values.tareWeight) /
                                2000
                              ).toFixed(2)
                            : "Not calculated"}
                        </span>
                      </div>
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
                        className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:opacity-25"
                        type="submit"
                        disabled={
                          isSubmitting ||
                          (purchasedFromQtyRemaining &&
                            purchasedFromQtyRemaining.qtyRemaining <= 0) ||
                          (soldToQtyRemaining &&
                            soldToQtyRemaining.qtyRemaining < 0.01)
                        }
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            {ticketError ? (
              <div className="bg-red-600 text-white">
                {console.log(ticketError)}
              </div>
            ) : (
              <div></div>
            )}
            {ticketSuccess1 && ticketSuccess2 ? (
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className=" w-64 h-24 text-white bg-green-500 bg-opacity-75 py-8">
                  <span className="px-4">Successfully created ticet.</span>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div>
            <div className="w-2/12">
              <div className="border-b-4 w-full border-gray-600 mb-3 text-center">
                <h6 className="text-gray-900 text-lg">Created Tickets</h6>
              </div>
              <div>
                <ul>
                  {createdTickets.length ? (
                    createdTickets.map((ticket) => (
                      <li>{`${truncateString(ticket.id, 7)} - ${
                        ticket.ticketNumber
                      }`}</li>
                    ))
                  ) : (
                    <div>0</div>
                  )}
                </ul>
              </div>
            </div>
            <div>
              <div className="mt-8 border-b-4 border-gray-600 mb-2">
                <h6>Chosen Contract Values</h6>
              </div>
              {purchasedFromQtyRemaining ? (
                <div className="bg-blue-300 bg-opacity-50 px-2 py-2">
                  <p>Purchased From:</p>
                  <div>
                    <span>{purchasedFromQtyRemaining.contractNumber}</span>
                  </div>
                  <div>
                    <span>Contract Qty: </span>
                    <span>{purchasedFromQtyRemaining.contractedQty}</span>
                  </div>
                  <div>
                    <span>Qty Remaining: </span>
                    <span
                      className={`${
                        purchasedFromQtyRemaining.qtyRemaining < 25
                          ? "text-red-500"
                          : "text-gray-900"
                      }`}
                    >
                      {purchasedFromQtyRemaining.qtyRemaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : null}
              {soldToQtyRemaining ? (
                <div className="bg-green-300 bg-opacity-50 px-2 py-2 mt-2">
                  <p>Sold To:</p>
                  <div>
                    <span>{soldToQtyRemaining.contractNumber}</span>
                  </div>
                  <div>
                    <span>Contract Qty: </span>
                    <span>{soldToQtyRemaining.contractedQty}</span>
                  </div>
                  <div>
                    <span>Qty Remaining: </span>
                    <span
                      className={`${
                        soldToQtyRemaining.qtyRemaining < 25
                          ? "text-red-500"
                          : "text-gray-900"
                      }`}
                    >
                      {soldToQtyRemaining.qtyRemaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ReactQueryDevtools />
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

export default CreateTicket;
