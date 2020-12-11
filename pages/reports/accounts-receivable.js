import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryCache } from "react-query";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import ReactToPrint from "react-to-print";
import Layout from "../../components/layout";
import { formatMoney, groupBy } from "../../utils";
import { contractsByType } from "../../src/graphql/queries.ts";
import {
  invoicesSorted,
  paymentsByContract,
  ticketsByContract,
} from "../../src/graphql/customQueries";
import DatePicker from "react-datepicker";

const AccountsReceivable = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeSaleContracts, setActiveSaleContracts] = useState([]);
  const [activeContractIds, setActiveContractIds] = useState([]);
  const [contractsTotals, setContractsTotals] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [totals, setTotals] = useState([]);
  const [vendorTotals, setVendorTotals] = useState([]);
  let toPrint = useRef(null);

  const { data: contractData } = useQuery("activeSaleContracts", async () => {
    const {
      data: { contractsByType: myContracts },
    } = await API.graphql({
      query: contractsByType,
      variables: {
        contractType: "SALE",
        filter: {
          contractState: {
            eq: "ACTIVE",
          },
          salePrice: {
            gt: 0,
          },
        },
        limit: 3000,
      },
    });
    return myContracts;
  });

  const getPaymentsByContract = async (contractId) => {
    const {
      data: {
        paymentsByContract: { items: myPayments },
      },
    } = await API.graphql({
      query: paymentsByContract,
      variables: {
        contractId,
        sortDirection: "DESC",
        limit: 2000,
        date: { le: moment(endDate).endOf("date") },
      },
    });
    return myPayments;
  };

  const getAllTicketsByContract = async (contractId) => {
    const {
      data: {
        ticketsByContract: { items: myTickets },
      },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        contractId,
        limit: 2000,
      },
    });

    return myTickets;
  };

  const getTicketsByContract = async () => {
    let array = [...contractsTotals];
    activeSaleContracts.map(async (contract) => {
      const {
        data: {
          ticketsByContract: { items: myTickets },
        },
      } = await API.graphql({
        query: ticketsByContract,
        variables: {
          contractId: contract.id,
          type: "Ticket",
          sortDirection: "DESC",
          ticketDate: { le: moment(endDate).endOf("date") },
          limit: 2000,
          filter: {
            paymentId: { attributeExists: false },
          },
        },
      });
      const allTickets = await getAllTicketsByContract(contract.id);
      const myPayments = await getPaymentsByContract(contract.id);

      let contractTotals = {};

      contractTotals.contractNumber = contract.contractNumber;
      contractTotals.contractId = contract.id;
      contractTotals.company = contract.contractTo.companyReportName;
      contractTotals.quantity = contract.quantity;
      contractTotals.salePrice = contract.salePrice;
      contractTotals.tonsHauled = allTickets.reduce(
        (acc, cv) => acc + cv.netTons,
        0
      );
      contractTotals.tonsCredited =
        myPayments.reduce((acc, cv) => acc + cv.amount, 0) / contract.salePrice;

      contractTotals.totalOverages = myPayments.reduce(
        (acc, cv) => acc + cv.overage,
        0
      );
      contractTotals.totalUnderages = myPayments.reduce(
        (acc, cv) => acc + cv.underage,
        0
      );

      contractTotals.totalBalanceDue =
        (contractTotals.tonsHauled - contractTotals.tonsCredited) *
        contractTotals.salePrice;
      contractTotals.tickets = myTickets;
      contractTotals.payments = myPayments;

      array.push(contractTotals);
      setContractsTotals(array);
    });
    computeTotalsFromTickets();
  };

  const handleFetchTickets = () => {
    setContractsTotals([]);
    setVendorTotals([]);
    getTicketsByContract();
  };

  const clearReport = () => {
    setContractsTotals([]);
    setVendorTotals([]);
  };

  useEffect(() => {
    if (contractData) {
      setActiveSaleContracts(contractData.items);
    }
  }, [contractData]);

  const computeTotalsFromTickets = () => {
    const byVendor = groupBy(contractsTotals, (contract) => contract.company);
    let vendors = [];
    contractsTotals.map((contract) => vendors.push(contract.company));
    let uniqureVendors = [...new Set(vendors)];
    let array = [];
    uniqureVendors.map((v) => {
      const myContracts = byVendor.get(v);
      let obj = {};
      obj.company = v;
      obj.contracts = myContracts;
      array.push(obj);
    });
    array.sort((a, b) => {
      let nameA = a.company;
      let nameB = b.company;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    setVendorTotals(array);
  };

  const getZeroToSevenDaysOld = (tickets, payments) => {
    let zeroToSeven = {};
    const myTickets = tickets.filter(
      (ticket) => moment(endDate).diff(moment(ticket.ticketDate), "days") < 8
    );
    const myPayments = payments.filter(
      (payment) => moment(endDate).diff(moment(payment.date), "days") < 8
    );
    let overages = myPayments.reduce((acc, cv) => acc + cv.overage, 0);
    let underages = myPayments.reduce((acc, cv) => acc + cv.underage, 0);
    zeroToSeven.tickets = myTickets;
    zeroToSeven.overages = overages;
    zeroToSeven.underages = underages;
    return calculateTonsBalance(zeroToSeven);
  };

  function calculateTonsBalance(myObj) {
    let ticketTotalTons = myObj.tickets.reduce(
      (acc, cv) => acc + cv.netTons,
      0
    );
    let myUnderages = 0;
    let myOverages = 0;
    if (myObj.underages > 0) {
      myUnderages = myObj.underages;
    }
    if (myObj.overages > 0) {
      myOverages = myObj.overages;
    }
    return ticketTotalTons + myUnderages - myOverages;
  }

  const getEightToFourteenDaysOld = (tickets, payments) => {
    let eightToFourteen = {};
    const myTickets = tickets.filter(
      (ticket) =>
        moment(endDate).diff(moment(ticket.ticketDate), "days") >= 8 &&
        moment(endDate).diff(moment(ticket.ticketDate), "days") < 15
    );

    const myPayments = payments.filter(
      (payment) =>
        moment(endDate).diff(moment(payment.date), "days") >= 8 &&
        moment(endDate).diff(moment(payment.date), "days") < 15
    );
    let overages = myPayments.reduce((acc, cv) => acc + cv.overage, 0);
    let underages = myPayments.reduce((acc, cv) => acc + cv.underage, 0);
    eightToFourteen.tickets = myTickets;
    eightToFourteen.overages = overages;
    eightToFourteen.underages = underages;

    return calculateTonsBalance(eightToFourteen);
  };

  const getFifteenToTwentyOneDaysOld = (tickets, payments) => {
    let fifteenToTwentyOne = {};
    const myTickets = tickets.filter(
      (ticket) =>
        moment(endDate).diff(moment(ticket.ticketDate), "days") >= 15 &&
        moment(endDate).diff(moment(ticket.ticketDate), "days") < 22
    );

    const myPayments = payments.filter(
      (payment) =>
        moment(endDate).diff(moment(payment.date), "days") >= 15 &&
        moment(endDate).diff(moment(payment.date), "days") < 22
    );
    let overages = myPayments.reduce((acc, cv) => acc + cv.overage, 0);
    let underages = myPayments.reduce((acc, cv) => acc + cv.underage, 0);
    fifteenToTwentyOne.tickets = myTickets;
    fifteenToTwentyOne.overages = overages;
    fifteenToTwentyOne.underages = underages;

    return calculateTonsBalance(fifteenToTwentyOne);
  };

  const getTwentyTwoandOverDays = (tickets, payments) => {
    let twentyTwoAndOver = {};
    const myTickets = tickets.filter(
      (ticket) => moment(endDate).diff(moment(ticket.ticketDate), "days") >= 22
    );

    const myPayments = payments.filter(
      (payment) => moment(endDate).diff(moment(payment.date), "days") >= 22
    );
    let overages = myPayments.reduce((acc, cv) => acc + cv.overage, 0);
    let underages = myPayments.reduce((acc, cv) => acc + cv.underage, 0);

    twentyTwoAndOver.tickets = myTickets;
    twentyTwoAndOver.overages = overages;
    twentyTwoAndOver.underages = underages;

    return calculateTonsBalance(twentyTwoAndOver);
  };

  return (
    <Layout>
      <div className="mx-16">
        <div>
          <span>End Date</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="form-input w-full"
          />
        </div>
        <div className="px-12 py-4">
          <ReactToPrint
            trigger={() => (
              <a
                href="#"
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
              >
                Print Report
              </a>
            )}
            content={() => toPrint}
          />
          <div className="mt-4">
            <button
              className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
              onClick={() => handleFetchTickets()}
            >
              Get Data
            </button>
          </div>
          <div className="mt-4">
            <button
              className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
              onClick={() => clearReport()}
            >
              Clear
            </button>
          </div>
        </div>
        <div ref={(el) => (toPrint = el)}>
          <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
            <h3>Accounts Receivable Report</h3>
            <span className="text-gray-900 font-light">
              Ending: {moment(endDate).format("MM/DD/YY")}
            </span>
          </div>

          <div className="mx-12 mb-12">
            {vendorTotals.length > 0 ? (
              vendorTotals.map((item, index) => (
                <div className="mr-4" key={index}>
                  <table className="mb-6">
                    <thead>
                      <tr className="">
                        <th className="px-2 w-48 text-xs font-semibold ">
                          {item.company}
                        </th>
                        <th className="px-10 ">Contract</th>
                        <th className="px-10">Balance Due</th>
                        <th className="px-10">0-7</th>
                        <th className="px-10">8-14</th>
                        <th className="px-10">15-21</th>
                        <th className="px-10">22-Over</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className=""></tr>
                      {item.contracts.map((contract) => (
                        <>
                          <tr>
                            <td className="pl-4 pr-2 "></td>
                            <td className="text-center">
                              {contract.contractNumber}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                (
                                  getZeroToSevenDaysOld(
                                    contract.tickets,
                                    contract.payments
                                  ) +
                                  getEightToFourteenDaysOld(
                                    contract.tickets,
                                    contract.payments
                                  ) +
                                  getFifteenToTwentyOneDaysOld(
                                    contract.tickets,
                                    contract.payments
                                  ) +
                                  getTwentyTwoandOverDays(
                                    contract.tickets,
                                    contract.payments
                                  )
                                ).toFixed(4) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getZeroToSevenDaysOld(
                                  contract.tickets,
                                  contract.payments
                                ).toFixed(4) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getEightToFourteenDaysOld(
                                  contract.tickets,
                                  contract.payments
                                ).toFixed(4) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getFifteenToTwentyOneDaysOld(
                                  contract.tickets,
                                  contract.payments
                                ).toFixed(4) * contract.salePrice
                              )}
                            </td>

                            <td className="text-center">
                              {formatMoney.format(
                                getTwentyTwoandOverDays(
                                  contract.tickets,
                                  contract.payments
                                ).toFixed(4) * contract.salePrice
                              )}
                            </td>
                          </tr>
                        </>
                      ))}
                      <tr className="border-t-2 border-gray-700">
                        <td className="pl-2 py-2"></td>
                        <td className="py-2 text-base text-center">Totals:</td>
                        <td className="text-center py-2 font-semibold">
                          {formatMoney.format(
                            item.contracts.reduce(
                              (acc, cv) =>
                                acc +
                                (
                                  cv.tickets.reduce(
                                    (a, c) => a + c.netTons,
                                    0
                                  ) +
                                  cv.payments.reduce(
                                    (a, c) => a + c.underage,
                                    0
                                  ) -
                                  cv.payments.reduce((a, c) => a + c.overage, 0)
                                ).toFixed(8) *
                                  cv.salePrice,
                              0
                            )
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div>Loading</div>
            )}
          </div>
        </div>
        <div>
          <div>
            {contractsTotals.length > 0 &&
              contractsTotals.map((contract) => (
                <div className="py-4">
                  <p>{contract.contractNumber}</p>
                  <ul>
                    <li>{contract.company}</li>
                    <li>
                      Tickets:
                      <ul>
                        {contract.tickets.map((ticket) => (
                          <li>
                            <span>
                              {ticket.ticketNumber} -{" "}
                              {moment(ticket.ticketDate).format("MM/DD/YYYY")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>Payments</li>
                    <ul className="list-disc ml-8">
                      {contract.payments.map((p) => (
                        <li>
                          <span>
                            {p.checkNumber} -{" "}
                            {moment(p.date).format("MM/DD/YYYY")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ul>
                </div>
              ))}
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

export default AccountsReceivable;
