import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryCache } from "react-query";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import ReactToPrint from "react-to-print";
import Layout from "../../components/layout";
import { formatMoney, groupBy } from "../../utils";
import { contractsByType } from "../../src/graphql/customQueries";

import DatePicker from "react-datepicker";

const AccountsReceivable = () => {
  const [activeSaleContracts, setActiveSaleContracts] = useState([]);
  const [contractsTotals, setContractsTotals] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [vendorTotals, setVendorTotals] = useState([]);
  let toPrint = useRef(null);

  const { data: contractData } = useQuery("activeSaleContracts", async () => {
    const {
      data: { contractsByType: myContracts },
    } = await API.graphql({
      query: contractsByType,
      variables: {
        paymentDate: {
          le: moment(endDate).endOf("date"),
        },
        ticketFilter: {
          ticketDate: {
            le: moment(endDate).endOf("date"),
          },
        },
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

  const computeContractTotals = () => {
    let array = [...contractsTotals];
    activeSaleContracts.map((contract) => {
      let contractTotals = {};

      contractTotals.contractNumber = contract.contractNumber;
      contractTotals.contractId = contract.id;
      contractTotals.company = contract.contractTo.companyReportName;
      contractTotals.quantity = contract.quantity;
      contractTotals.salePrice = contract.salePrice;
      contractTotals.tonsHauled = contract.tickets.items.reduce(
        (acc, cv) => acc + cv.netTons,
        0
      );
      contractTotals.tonsCredited =
        contract.payments.items.reduce((acc, cv) => acc + cv.amount, 0) /
        contract.salePrice;

      contractTotals.totalOverages = contract.payments.items.reduce(
        (acc, cv) => acc + cv.overage,
        0
      );
      contractTotals.totalUnderages = contract.payments.items.reduce(
        (acc, cv) => acc + cv.underage,
        0
      );

      contractTotals.totalBalanceDue =
        (contractTotals.tonsHauled - contractTotals.tonsCredited) *
        contractTotals.salePrice;
      contractTotals.tickets = contract.tickets.items;
      contractTotals.payments = contract.payments.items;
      array.push(contractTotals);
      setContractsTotals(array);
    });

    computeTotalsFromTickets();
  };

  const handleFetchTickets = () => {
    setContractsTotals([]);
    setVendorTotals([]);
    computeContractTotals();
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

  useEffect(() => {
    if (activeSaleContracts.length) {
      computeContractTotals();
    }
  }, [activeSaleContracts]);

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

  const getZeroToSevenDaysOld = (tickets, payments, salePrice) => {
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
    zeroToSeven.payments = myPayments;
    zeroToSeven.salePrice = salePrice;
    return calculateTonsBalance(zeroToSeven);
  };

  function calculateTonsBalance(myObj) {
    let ticketTotalTons = myObj.tickets.reduce(
      (acc, cv) => acc + cv.netTons,
      0
    );

    let totalPaid = myObj.payments.reduce((acc, cv) => acc + cv.amount, 0);
    let creditFromPayments = totalPaid / myObj.salePrice;

    return ticketTotalTons - creditFromPayments;
  }

  const getEightToFourteenDaysOld = (tickets, payments, salePrice) => {
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
    eightToFourteen.payments = myPayments;
    eightToFourteen.salePrice = salePrice;
    return calculateTonsBalance(eightToFourteen);
  };

  const getFifteenToTwentyOneDaysOld = (tickets, payments, salePrice) => {
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
    fifteenToTwentyOne.payments = myPayments;
    fifteenToTwentyOne.salePrice = salePrice;
    return calculateTonsBalance(fifteenToTwentyOne);
  };

  const getTwentyTwoandOverDays = (tickets, payments, salePrice) => {
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
    twentyTwoAndOver.payments = myPayments;
    twentyTwoAndOver.salePrice = salePrice;
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
            {vendorTotals.length ? (
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
                                contract.tonsHauled * contract.salePrice -
                                  contract.payments.reduce(
                                    (acc, cv) => acc + cv.amount,
                                    0
                                  )
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getZeroToSevenDaysOld(
                                  contract.tickets,
                                  contract.payments,
                                  contract.salePrice
                                ) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getEightToFourteenDaysOld(
                                  contract.tickets,
                                  contract.payments,
                                  contract.salePrice
                                ) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getFifteenToTwentyOneDaysOld(
                                  contract.tickets,
                                  contract.payments,
                                  contract.salePrice
                                ) * contract.salePrice
                              )}
                            </td>

                            <td className="text-center">
                              {formatMoney.format(
                                getTwentyTwoandOverDays(
                                  contract.tickets,
                                  contract.payments,
                                  contract.salePrice
                                ) * contract.salePrice
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
                              (acc, cv) => acc + cv.totalBalanceDue,
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
