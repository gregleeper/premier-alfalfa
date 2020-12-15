import { API, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import Layout from "../../../components/layout";
import {
  getSettlement,
  paymentsByContract,
  ticketsByContract,
} from "../../../src/graphql/customQueries";
import {
  deleteSettlement,
  updateTicket,
} from "../../../src/graphql/mutations.ts";
import { formatMoney } from "../../../utils";
import { useMutation, useQueryCache } from "react-query";
import Modal from "react-modal";
import ReactToPrint from "react-to-print";

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

const Settlement = () => {
  const router = useRouter();
  const queryCache = useQueryCache();
  const { id } = router.query;
  const [settlement, setSettlement] = useState();
  const [contractId, setContractId] = useState(null);
  const [contract, setContract] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [settlementPayments, setSettlementPayments] = useState([]);
  const [settlementLoaded, setSettlementLoaded] = useState(false);
  const [beginningBalance, setBeginningBalance] = useState({
    balanceDue: 0,
    totalPounds: 0,
    totalTons: 0,
  });
  const [payments, setPayments] = useState([]);
  let toPrint = useRef(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getRequestedSettlement = async () => {
    const {
      data: { getSettlement: mySettlement },
    } = await API.graphql({
      query: getSettlement,
      variables: {
        id,
      },
    });

    setSettlement(mySettlement);
  };

  const [
    deleteSettlementMutation,
    { data: deletedSettlement, error: errorDeleting, isSuccess: deleteSuccess },
  ] = useMutation(
    async () => {
      const { data: settlementData } = await API.graphql({
        query: deleteSettlement,
        variables: {
          input: { id },
        },
      });
      return settlementData;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries("settlements");
        router.back();
      },
    }
  );

  const [updateTicketMutation, { data, error, isSuccess }] = useMutation(
    async (ticketId) => {
      const { data: ticketData } = await API.graphql({
        query: updateTicket,
        variables: {
          id: ticketId,
          settlementId: null,
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

  const getPaymentsOnContract = async () => {
    const {
      data: { paymentsByContract: myPayments },
    } = await API.graphql({
      query: paymentsByContract,
      variables: {
        contractId: contractId,
        date: {
          le: moment(settlement?.endDate).endOf("date"),
        },
      },
    });
    setPayments(myPayments.items);
    setSettlementPayments(
      myPayments.items.filter((p) =>
        moment(p.date).isBetween(
          moment(settlement.beginDate).startOf("date"),
          moment(settlement.endDate).endOf("date")
        )
      )
    );
  };

  const getUnpaidBalanceForContract = async (contractId) => {
    const {
      data: {
        ticketsByContract: { items: unpaidTickets },
      },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        contractId,
        ticketDate: { le: moment(settlement.beginDate).startOf("date") },

        filter: {
          settlementId: { ne: id },
        },
        limit: 5000,
      },
    });

    let previousPayments = payments.filter((p) =>
      moment(p.date).isBefore(moment(settlement.beginDate).startOf("date"))
    );

    if (unpaidTickets.length > 0 || payments.length > 0) {
      let array = [];

      unpaidTickets.map((ticket) => {
        if (
          moment(ticket.ticketDate).isBefore(
            moment(settlement.beginDate).startOf("date")
          )
        ) {
          array.push(ticket);
        }
      });

      setBeginningBalance({
        balanceDue:
          array.reduce((acc, cv) => acc + cv.netTons, 0) *
            settlement.contract.contractPrice -
          previousPayments.reduce((acc, cv) => acc + cv.amount, 0),
        totalPounds:
          array.reduce((acc, cv) => acc + cv.netWeight, 0) -
          previousPayments.reduce((acc, cv) => acc + cv.totalPounds, 0),
        totalTons:
          array.reduce((acc, cv) => acc + cv.netTons, 0) -
          previousPayments.reduce((acc, cv) => acc + cv.tonsCredit, 0),
      });
    }
  };

  useEffect(() => {
    if (id) {
      getRequestedSettlement();
    }
  }, [id]);

  useEffect(() => {
    if (settlement) {
      setTickets(settlement.tickets.items);
      setContractId(settlement.contractId);
      setContract(settlement.contract);
      setSettlementLoaded(true);
    }
  }, [settlement]);

  useEffect(() => {
    if (contractId) {
      getPaymentsOnContract();
    }
  }, [contractId]);

  useEffect(() => {
    if (settlementLoaded && contractId && tickets.length) {
      getUnpaidBalanceForContract(contractId);
    }
  }, [settlementLoaded]);

  useEffect(() => {
    if (contractId && payments.length) {
      getUnpaidBalanceForContract(contractId);
    }
  }, [payments]);

  console.log(settlement);

  let runningLbs = beginningBalance.totalPounds;
  let runningTons = beginningBalance.totalTons;
  let runningBalance = beginningBalance.balanceDue;
  const addToTotalPounds = (lbs) => {
    return (runningLbs += lbs).toLocaleString(undefined);
  };
  const addToTotalTons = (tons) => {
    return (runningTons += tons).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  };

  const addToBalanceDue = (amount) => {
    return formatMoney.format((runningBalance += amount));
  };

  const subtractFromBalanceDue = (amount) => {
    return formatMoney.format((runningBalance -= amount));
  };

  const handleDeleteSettlement = () => {
    tickets.map((ticket) => {
      try {
        updateTicketMutation(ticket.id);
      } catch (err) {
        console.log(err);
      }
    });
    deleteSettlementMutation({
      input: {
        id,
      },
    });
  };

  return (
    <Layout>
      <div className="flex items-center">
        <div className="px-12 py-4">
          <ReactToPrint
            trigger={() => (
              <a
                href="#"
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
              >
                Print Settlement
              </a>
            )}
            content={() => toPrint}
          />
        </div>
        <div className="px-6">
          <button
            className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white focus:outline-none"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
        <div className="px-6 ">
          <button
            className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
            onClick={() => openModal()}
          >
            Delete
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p>Are you sure you want to delete this Settlement?</p>
        <div className="flex justify-around items-center py-4">
          <div className="px-4">
            <button
              className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white focus:outline-none"
              onClick={() => closeModal()}
              type="button"
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              className="px-3 py-2 border border-red-500 shadow hover:bg-red-500 hover:text-white mr-12"
              onClick={() => handleDeleteSettlement()}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <div ref={(el) => (toPrint = el)} className="px-12 py-6">
        <div>
          <p>Date: {moment().format("MM/DD/YY")}</p>
          <p>
            Settlement Number: {settlement ? settlement.settlementNumber : ""}
          </p>
        </div>
        <div className="text-3xl font-light text-center">
          <h3>Settlement</h3>
        </div>

        <div className="text-center text-lg">
          <p className="font-light text-2xl">Premier Alfalfa</p>
          <p>PO Box 518</p>
          <p>Hugoton, KS 67951</p>
          <p>620-544-4545</p>
          <p>Fax: 620-544-4510</p>
        </div>

        {settlementLoaded ? (
          <div>
            <div className="py-3 w-full mx-auto flex justify-start items-start">
              <div className="mr-4">
                <p>To:</p>
              </div>
              <div>
                <h6 className="text-lg font-light">
                  {settlement.vendor.companyListingName}
                </h6>
                <p>{settlement.vendor.address1}</p>
                <p>{settlement.vendor.address2}</p>
                <div className="flex justify-start">
                  <p className="mr-2">{settlement.vendor.city}, </p>
                  <p className="mr-2">{settlement.vendor.state}</p>
                  <p>{settlement.vendor.zipCode}</p>
                </div>
              </div>
            </div>
            <div>
              <p>
                Settlement for commodity to:{" "}
                {moment(settlement.endDate).add(12, "hours").format("MM/DD/YY")}
              </p>
              <p>
                Contract:{" "}
                <span className="font-semibold">{contract.contractNumber}</span>{" "}
                {contract.commodity.name} @ ${contract.contractPrice}/Ton
              </p>
            </div>

            <div className="w-full mx-auto mt-4">
              <div>
                <h6 className="font-semibold text-lg">Tickets:</h6>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ticket</th>
                      <th>Bale Ct.</th>
                      <th>Gross</th>
                      <th>Tare</th>
                      <th>Net Weight</th>
                      <th>NetTons</th>
                      <th>Total Pounds</th>
                      <th>Total Tons</th>
                      <th>Tons Credit</th>
                      <th>Credit Amount</th>
                      <th>Balance Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="px-2 font-bold pt-3">
                        Beginning Balance:
                      </td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4">
                        {beginningBalance.totalPounds.toLocaleString(undefined)}
                      </td>
                      <td className="px-4">
                        {beginningBalance.totalTons.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4">
                        {formatMoney.format(beginningBalance.balanceDue)}
                      </td>
                    </tr>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="text-center">
                        <td className="px-2">
                          {moment(ticket.ticketDate).format("MM/DD/YY")}
                        </td>

                        <td className="px-4">{ticket.ticketNumber}</td>
                        <td className="px-4"> {ticket.baleCount}</td>
                        <td className="px-4">{ticket.grossWeight}</td>
                        <td className="px-4">{ticket.tareWeight}</td>
                        <td className="px-4">{ticket.netWeight}</td>
                        <td className="px-4">{ticket.netTons}</td>
                        <td>{addToTotalPounds(ticket.netWeight)}</td>
                        <td>{addToTotalTons(ticket.netTons)}</td>
                        <td></td>
                        <td></td>
                        <td className="px-4">
                          {addToBalanceDue(
                            ticket.netTons * ticket.contract.contractPrice
                          )}
                        </td>
                      </tr>
                    ))}
                    {settlementPayments
                      ? settlementPayments.map((payment) => (
                          <tr key={payment.id} className="text-center">
                            <td className="px-2">
                              {moment(payment.date).format("MM/DD/YY")}
                            </td>
                            <td className="px-4">{payment.checkNumber}</td>
                            <td className="px-4"></td>
                            <td className="px-4"></td>
                            <td className="px-4"></td>
                            <td></td>
                            <td></td>
                            <td className="px-2">
                              {(
                                runningLbs - payment.totalPounds
                              ).toLocaleString(undefined)}
                            </td>
                            <td className="px-2">
                              {(
                                runningTons - payment.tonsCredit
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-2">{payment.tonsCredit}</td>
                            <td className="px-4">
                              {" "}
                              {formatMoney.format(payment.amount)}
                            </td>
                            <td className="px-4">
                              {subtractFromBalanceDue(payment.amount)}
                            </td>
                          </tr>
                        ))
                      : null}

                    <tr className="text-center">
                      <td className="px-4 font-bold text-lg">Total: </td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4">
                        {formatMoney.format(runningBalance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
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

export default Settlement;
