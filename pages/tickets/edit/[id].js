import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import { FormikSelect } from "../../../components/formikSelect";
import { API, withSSRContext } from "aws-amplify";
import { updateTicket, deleteTicket } from "../../../src/graphql/mutations.ts";
import { listContracts, getTicket } from "../../../src/graphql/queries.ts";
import { ticketsByContract } from "../../../src/graphql/customQueries";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import { QueryCache, useQuery, useMutation } from "react-query";
import Modal from "react-modal";
import { CreateTicketSchema } from "../../../components/validationSchema";

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

const EditTicket = () => {
  const queryCache = new QueryCache();
  const [contracts, setContracts] = useState([]);
  const [correspondingContracts, setCorrespondingContracts] = useState([]);
  const [ticketDate, setTicketDate] = useState(new Date());
  const [ticket, setTicket] = useState();
  const [contractId, setContractId] = useState(null);
  const [
    purchasedFromQtyRemaining,
    setPurchasedFromQuantityRemaining,
  ] = useState(null);
  const [soldToQtyRemaining, setSoldToQuantityRemaining] = useState(null);
  const [correspondingContractId, setCorrespondingContractId] = useState(null);
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);
  const { id } = router.query;

  const [mutate, { data, error, isSuccess }] = useMutation(
    async (input) => {
      const { data: ticketData } = await API.graphql({
        query: updateTicket,
        variables: {
          input,
        },
      });
      return ticketData;
    },
    {
      onSuccess: ({ updateTicket }) => {
        const lengthOfGroups = queryCache.getQueryData("tickets").length;
        const items = queryCache.getQueryData("tickets")[lengthOfGroups - 1]
          .items;
        let previousData = queryCache.getQueryData("tickets");
        previousData[lengthOfGroups - 1].items.push(updateTicket);
        return () => queryCache.setQueryData("tickets", () => [previousData]);
      },
    }
  );

  const [
    deleteTicketMutation,
    { data: deletedTicket, error: errorDeleting, isSuccess: deleteSuccess },
  ] = useMutation(
    async () => {
      const { data: ticketData } = await API.graphql({
        query: deleteTicket,
        variables: {
          input: { id },
        },
      });
      return ticketData;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries("tickets");
        router.back();
      },
    }
  );

  const getTicketToEdit = async () => {
    const {
      data: { getTicket: myTicket },
    } = await API.graphql({
      query: getTicket,
      variables: {
        id,
      },
    });
    setTicket(myTicket);
  };

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

  const { data: contractsData } = useQuery("contracts", async () => {
    const {
      data: { listContracts: myContracs },
    } = await API.graphql({
      query: listContracts,
      variables: {
        limit: 3000,
      },
    });
    return myContracs;
  });

  useEffect(() => {
    if (id) {
      getTicketToEdit();
    }
  }, [id]);

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

  useEffect(() => {
    if (ticket) {
      setContractId(ticket.contractId);
      setCorrespondingContractId(ticket.correspondingContractId);
      setTicketDate(new Date(ticket.ticketDate));
    }
  }, [ticket]);

  const handleContractIdChange = (value) => {
    setContractId(value);
  };

  const handleCorrespondingContractIdChange = (value) => {
    setCorrespondingContractId(value);
  };

  const handleDeleteTicket = () => {
    deleteTicketMutation();
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <Layout>
      <div className="">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Edit Ticket</h3>
        </div>

        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => closeModal}
            style={customStyles}
            contentLabel="Delete ticket"
          >
            <div>
              <p>Are you sure you want to delete this ticket?</p>
              <div>
                <button
                  className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                  type="button"
                  onClick={() => handleDeleteTicket()}
                >
                  Delete Ticket
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
        <div className="flex justify-around relative">
          <div className="w-3/4">
            {ticket && (
              <Formik
                initialValues={{
                  contractId: (ticket && ticket.contractId) || "",
                  correspondingContractId:
                    (ticket && ticket.correspondingContractId) || "",
                  ticketDate: (ticket && ticket.ticketDate) || ticketDate,
                  fieldNum: (ticket && ticket.fieldNum) || "",
                  baleCount: (ticket && ticket.baleCount) || null,
                  ticketNumber: (ticket && ticket.ticketNumber) || "",
                  ladingNumber: (ticket && ticket.ladingNumber) || "",
                  driver: (ticket && ticket.driver) || "",
                  truckNumber: (ticket && ticket.truckNumber) || "",
                  grossWeight: (ticket && ticket.grossWeight) || "",
                  tareWeight: (ticket && ticket.tareWeight) || "",
                  netWeight: (ticket && ticket.netWeight) || "",
                  netTons: (ticket && ticket.netTons) || "",
                }}
                validationSchema={CreateTicketSchema}
                onSubmit={async (values, actions) => {
                  let netWeight = values.grossWeight - values.tareWeight;
                  let netTons = netWeight / 2000;

                  let input = {
                    id,
                    contractId: values.contractId,
                    correspondingContractId: values.correspondingContractId,
                    ticketDate: ticketDate,
                    fieldNum: values.fieldNum,
                    baleCount: values.baleCount,
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

                  mutate(input);

                  router.push("/tickets");
                }}
              >
                {({ isSubmitting, errors, touched, values }) => (
                  <Form>
                    <div className="w-10/12 mx-auto">
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
                          Contract Number
                        </label>
                        <Field
                          className="form-select w-full"
                          component={FormikSelect}
                          options={contracts}
                          handleChange={handleContractIdChange}
                          name="contractId"
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
                          Corresponding Contract Number
                        </label>
                        <Field
                          className="form-select w-full"
                          component={FormikSelect}
                          handleChange={handleCorrespondingContractIdChange}
                          options={correspondingContracts}
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
                          onChange={(date) => setTicketDate(date)}
                          className="form-input w-full"
                        />
                        {errors.ticketDate && touched.ticketDate ? (
                          <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                            {errors.ticketDate}
                          </div>
                        ) : null}
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
                        {errors.baleCount && touched.baleCount ? (
                          <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                            {errors.baleCount}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex justify-between items-center mb-4 w-full">
                        <label
                          className="text-gray-900 w-1/4 md:w-1/2 pr-4"
                          name="ladingNumber"
                        >
                          Vendor
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
                        {errors.driver && touched.driver ? (
                          <div className="text-red-700 ml-2 bg-red-200 px-2 py-1 rounded-sm">
                            {errors.driver}
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
                              ? (
                                  values.grossWeight - values.tareWeight
                                ).toFixed(2)
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

                      <div className="flex justify-center mt-12 pb-24">
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
          <div className="w-1/ mr-4">
            <div className="mt-8 border-b-4 border-gray-600 mb-2">
              <h6>Chosen Contract Values</h6>
            </div>
            {purchasedFromQtyRemaining ? (
              <div className="bg-blue-300 bg-opacity-50 px-2 py-2">
                <p>Contract:</p>
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
                <p>Corresponding Contract:</p>
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
            <div className="mt-24">
              <button
                className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
                type="button"
                onClick={() => openModal()}
              >
                Delete Ticket
              </button>
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

export default EditTicket;
