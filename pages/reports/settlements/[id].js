import { API, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import Layout from "../../../components/layout";
import {
  getSettlement,
  settlementsByContract,
} from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import ReactToPrint from "react-to-print";
const Settlement = () => {
  const router = useRouter();
  const { id } = router.query;
  const [settlement, setSettlement] = useState();
  const [tickets, setTickets] = useState([]);
  const [beginningBalance, setBeginningBalance] = useState(0);
  const [previousUnpaidSettlements, setPreviousUnpaidSettlements] = useState(
    []
  );
  let toPrint = useRef(null);

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

  const getUnpaidBalanceForContract = async (contractId) => {
    const {
      data: {
        settlementsByContract: { items: contractSettlements },
      },
    } = await API.graphql({
      query: settlementsByContract,
      variables: {
        contractId,
        filter: {
          isPaid: { eq: false },
        },
        limit: 5000,
      },
    });

    if (contractSettlements.length) {
      let array = [];
      contractSettlements.map((mySettlement) => {
        if (mySettlement.dueDate < settlement.dueDate) {
          array.push(mySettlement);
          setBeginningBalance(beginningBalance + mySettlement.amountOwed);
        }
      });
      setPreviousUnpaidSettlements(array);
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
    }
  }, [settlement]);

  useEffect(() => {
    if (tickets.length) {
      getUnpaidBalanceForContract(tickets[0].contractId);
    }
  }, [tickets]);

  console.log(tickets);
  const computeTotalPounds = () => {
    let total = 0;
    tickets.map((ticket) => {
      total = ticket.netWeight + total;
    });
    return total;
  };

  const computeTotalTons = () => {
    let total = 0;
    tickets.map((ticket) => {
      total = ticket.netTons + total;
    });
    return total.toFixed(2);
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
        <div>
          <button
            className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white focus:outline-none"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
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

        {settlement && tickets.length > 0 ? (
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
                <span className="font-semibold">
                  {tickets[0].contract.contractNumber}
                </span>{" "}
                {tickets[0].contract.commodity.name} @ $
                {tickets[0].contract.contractPrice}/Ton
              </p>
            </div>
            <div className="mt-3">
              <p className="font-semibold">Unpaid Settlements: </p>
              {previousUnpaidSettlements.map((settlement) => (
                <div>
                  <span className="mr-4">
                    Settlement Number: {settlement.settlementNumber}
                  </span>
                  <span className="mr-4">
                    Net Tons:{" "}
                    {settlement.tickets.items
                      .reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue.netTons;
                      }, 0)
                      .toFixed(2)}
                  </span>
                  <span>
                    Amount Owed: {formatMoney.format(settlement.amountOwed)}
                  </span>
                </div>
              ))}
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
                      {/* <th>Tons Credit</th>
                      <th>Credit Amount</th> */}
                      <th>Balance Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => {
                      return (
                        <tr>
                          <td className="px-2">
                            {moment(ticket.ticketDate).format("MM/DD/YY")}
                          </td>
                          <td className="px-4">{ticket.ticketNumber}</td>
                          <td className="px-4"> {ticket.baleCount}</td>
                          <td className="px-4">{ticket.grossWeight}</td>
                          <td className="px-4">{ticket.tareWeight}</td>
                          <td className="px-4">{ticket.netWeight}</td>
                          <td className="px-4">{ticket.netTons}</td>
                          <td className="px-4">
                            {formatMoney.format(
                              ticket.netTons * ticket.contract.contractPrice
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t border-gray-700">
                      <td className="px-4 font-bold pt-3">
                        Settlement Totals:{" "}
                      </td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4">{computeTotalPounds()}</td>
                      <td className="px-4">{computeTotalTons()}</td>
                      <td className="px-4 font-bold">
                        {formatMoney.format(settlement.amountOwed)}
                      </td>
                    </tr>
                    {previousUnpaidSettlements.map((upSettlement) => (
                      <tr>
                        <td className="px-4">
                          {upSettlement.settlementNumber}{" "}
                        </td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4">
                          {formatMoney.format(upSettlement.amountOwed)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 font-bold text-lg">Total: </td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4 font-bold text-lg">
                        {formatMoney.format(
                          previousUnpaidSettlements.reduce(function (
                            accumulator,
                            currentValue
                          ) {
                            return accumulator + currentValue.amountOwed;
                          },
                          settlement.amountOwed)
                        )}
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
