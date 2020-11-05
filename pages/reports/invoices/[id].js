import { API, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import Layout from "../../../components/layout";
import {
  getInvoice,
  invoicesByContract,
} from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import ReactToPrint from "react-to-print";
const Invoice = () => {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState();
  const [tickets, setTickets] = useState([]);
  const [beginningBalance, setBeginningBalance] = useState(0);
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
    setInvoice(myInvoice);
  };

  const getUnpaidBalanceForContract = async (contractId) => {
    const {
      data: {
        invoicesByContract: { items: contractInvoices },
      },
    } = await API.graphql({
      query: invoicesByContract,
      variables: {
        contractId,
        filter: {
          isPaid: { eq: false },
        },
        limit: 5000,
      },
    });

    if (contractInvoices.length) {
      let array = [];
      contractInvoices.map((myInvoice) => {
        if (myInvoice.dueDate < invoice.dueDate) {
          array.push(myInvoice);
          setBeginningBalance(beginningBalance + myInvoice.amountOwed);
        }
      });
      setPreviousUnpaidInvoices(array);
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
    }
  }, [invoice]);

  useEffect(() => {
    if (tickets.length) {
      getUnpaidBalanceForContract(tickets[0].contractId);
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
            <div className="mt-3">
              <p className="font-semibold">Unpaid Invoices: </p>
              {previousUnpaidInvoices.map((invoice) => (
                <div>
                  <span className="mr-4">
                    Invoice Number: {invoice.invoiceNumber}
                  </span>
                  <span className="mr-4">
                    Net Tons:{" "}
                    {invoice.tickets.items
                      .reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue.netTons;
                      }, 0)
                      .toFixed(2)}
                  </span>
                  <span>
                    Amount Owed: {formatMoney.format(invoice.amountOwed)}
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
                              ticket.netTons * ticket.contract.salePrice
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t border-gray-700">
                      <td className="px-4 font-bold pt-3">Invoice Totals: </td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4"></td>
                      <td className="px-4">{computeTotalPounds()}</td>
                      <td className="px-4">{computeTotalTons()}</td>
                      <td className="px-4 font-bold">
                        {formatMoney.format(invoice.amountOwed)}
                      </td>
                    </tr>
                    {previousUnpaidInvoices.map((upInvoice) => (
                      <tr>
                        <td className="px-4">{upInvoice.invoiceNumber} </td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4"></td>
                        <td className="px-4">
                          {formatMoney.format(upInvoice.amountOwed)}
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
                          previousUnpaidInvoices.reduce(function (
                            accumulator,
                            currentValue
                          ) {
                            return accumulator + currentValue.amountOwed;
                          },
                          invoice.amountOwed)
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

export default Invoice;
