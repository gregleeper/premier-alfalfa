import { API, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import Layout from "../../../components/layout";
import {
  getInvoice,
  paymentsByContract,
  ticketsByContract,
  invoicesByContract,
} from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import ReactToPrint from "react-to-print";
const Invoice = () => {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState();
  const [contractId, setContractId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [beginningBalance, setBeginningBalance] = useState({
    balanceDue: 0,
    totalPounds: 0,
    totalTons: 0,
  });
  const [payments, setPayments] = useState([]);
  const [previousUnpaidInvoices, setPreviousUnpaidInvoices] = useState([]);
  let toPrint = useRef(null);

  const getRequestedInvoice = async () => {
    const {
      data: { getInvoice: myInvoice },
    } = await API.graphql({
      query: getInvoice,
      variables: {
        id,
      },
    });
    setContractId(myInvoice.contractId);
    setInvoice(myInvoice);
  };

  const getPaymentsOnContract = async () => {
    const {
      data: { paymentsByContract: myPayments },
    } = await API.graphql({
      query: paymentsByContract,
      variables: {
        contractId,
        date: {
          between: [
            moment(invoice?.endDate).subtract(7, "days"),
            invoice?.endDate,
          ],
        },
      },
    });
    setPayments(myPayments.items);
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
        filter: {
          paymentId: { attributeExists: false },
          invoiceId: { attributeExists: false },
        },
        limit: 5000,
      },
    });
    console.log("up tickets", unpaidTickets);
    if (unpaidTickets.length) {
      let array = [];

      unpaidTickets.map((ticket) => {
        if (
          moment(ticket.ticketDate).isBefore(
            moment(invoice.dueDate).subtract(7, "days")
          )
        ) {
          array.push(ticket);
        }
      });
      console.log(array);
      setBeginningBalance({
        balanceDue:
          array.reduce((acc, cv) => acc + cv.netTons, 0) *
          invoice.contract.salePrice,
        totalPounds: array.reduce((acc, cv) => acc + cv.netWeight, 0),
        totalTons: array.reduce((acc, cv) => acc + cv.netTons, 0),
      });
    }
  };

  useEffect(() => {
    if (id) {
      getRequestedInvoice();
    }
  }, [id]);

  useEffect(() => {
    if (invoice) {
      setTickets(invoice.tickets.items);
      getPaymentsOnContract();
    }
  }, [invoice]);

  useEffect(() => {
    if (tickets.length && contractId) {
      getUnpaidBalanceForContract(contractId);
    }
  }, [tickets]);

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
                Print Invoice
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
          <p>Invoice Number: {invoice ? invoice.invoiceNumber : ""}</p>
        </div>
        <div className="text-3xl font-light text-center">
          <h3>Invoice</h3>
        </div>

        <div className="text-center text-lg">
          <p className="font-light text-2xl">Premier Alfalfa</p>
          <p>PO Box 518</p>
          <p>Hugoton, KS 67951</p>
          <p>620-544-4545</p>
          <p>Fax: 620-544-4510</p>
        </div>

        {invoice && tickets.length > 0 ? (
          <div>
            <div className="py-3 w-full mx-auto flex justify-start items-start">
              <div className="mr-4">
                <p>To:</p>
              </div>
              <div>
                <h6 className="text-lg font-light">
                  {invoice.vendor.companyListingName}
                </h6>
                <p>{invoice.vendor.address1}</p>
                <p>{invoice.vendor.address2}</p>
                <div className="flex justify-start">
                  <p className="mr-2">{invoice.vendor.city}, </p>
                  <p className="mr-2">{invoice.vendor.state}</p>
                  <p>{invoice.vendor.zipCode}</p>
                </div>
              </div>
            </div>
            <div>
              <p>
                Invoice for commodity to:{" "}
                {moment(invoice.endDate).add(12, "hours").format("MM/DD/YY")}
              </p>
              <p>
                Contract:{" "}
                <span className="font-semibold">
                  {tickets[0].contract.contractNumber}
                </span>{" "}
                {tickets[0].contract.commodity.name} @ $
                {tickets[0].contract.salePrice}/Ton
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
                    {tickets.map((ticket) => {
                      return (
                        <tr className="text-center">
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
                              ticket.netTons * ticket.contract.salePrice
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {payments
                      ? payments.map((payment) => (
                          <tr key="payment.id" className="text-center">
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

export default Invoice;
