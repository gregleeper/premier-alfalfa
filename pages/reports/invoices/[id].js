import { API } from "aws-amplify";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import Layout from "../../../components/layout";
import { getInvoice } from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import ReactToPrint from "react-to-print";
const Invoice = () => {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState();
  const [tickets, setTickets] = useState([]);
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

  console.log(tickets);

  // 2020-10-04T00:00:00.761Z
  // 2020-09-28T00:00:00.761Z

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
          <span>Date: {moment().format("MM/DD/YY")}</span>
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
                Contract: {tickets[0].contract.contractNumber}{" "}
                {tickets[0].contract.commodity.name} @ $
                {tickets[0].contract.salePrice}/Ton
              </p>
            </div>
            <div className="w-full mx-auto mt-4">
              <div>
                <h6>Tickets:</h6>
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
                      <td className="px-4 font-bold pt-3">Totals: </td>
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

export default Invoice;
