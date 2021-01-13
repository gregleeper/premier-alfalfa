import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryCache } from "react-query";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import ReactToPrint from "react-to-print";
import Layout from "../../components/layout";
import { formatMoney, groupBy } from "../../utils";
import { contractsByType } from "../../src/graphql/customQueries";
import {
  invoicesSorted,
  ticketsByContract,
  paymentsByContract,
} from "../../src/graphql/customQueries";
import DatePicker from "react-datepicker";

const AccountsPayable = () => {
  const [activePurchaseContracts, setActivePurchaseContracts] = useState([]);
  const [contractsTotals, setContractsTotals] = useState([]);
  const [isFetchingTickets, setIsFetchingTickets] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [total3, setTotal3] = useState(0);
  const [total4, setTotal4] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [vendorTotals, setVendorTotals] = useState([]);
  let toPrint = useRef(null);

  const { data: contractData } = useQuery(
    "activePurchaseContracts",
    async () => {
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
          contractType: "PURCHASE",
          filter: {
            contractState: {
              eq: "ACTIVE",
            },
          },
          limit: 3000,
        },
      });
      return myContracts;
    }
  );

  const computeContractTotals = () => {
    let array = [...contractsTotals];
    activePurchaseContracts.map((contract) => {
      let contractTotals = {};

      contractTotals.contractNumber = contract.contractNumber;
      contractTotals.contractId = contract.id;
      contractTotals.company = contract.contractTo.companyReportName;
      contractTotals.quantity = contract.quantity;
      contractTotals.contractPrice = contract.contractPrice;
      contractTotals.tonsHauled = contract.tickets.items.reduce(
        (acc, cv) => acc + cv.netTons,
        0
      );
      contractTotals.tonsCredited =
        contract.payments.items.reduce((acc, cv) => acc + cv.amount, 0) /
        contract.contractPrice;

      contractTotals.totalOverages = contract.payments.items.reduce(
        (acc, cv) => acc + cv.overage,
        0
      );
      contractTotals.totalUnderages = contract.payments.items.reduce(
        (acc, cv) => acc + cv.underage,
        0
      );

      contractTotals.tickets = contract.tickets.items;
      contractTotals.payments = contract.payments.items;
      contractTotals.totalBalanceDue =
        getBalanceDueForContract(
          contractTotals.tickets,
          contractTotals.payments,
          contractTotals.contractPrice,
          contractTotals.contractNumber
        ) * contract.contractPrice;
      contractTotals.zeroToSeven =
        getZeroToSevenDaysOld(
          contractTotals.tickets,
          contractTotals.payments,
          contractTotals.contractPrice,
          contractTotals.contractNumber
        ) * contract.contractPrice;
      contractTotals.eightToFourteen =
        getEightToFourteenDaysOld(
          contractTotals.tickets,
          contractTotals.payments,
          contractTotals.contractPrice,
          contractTotals.contractNumber
        ) * contract.contractPrice;
      contractTotals.fifteenToTwentyOne =
        getFifteenToTwentyOneDaysOld(
          contractTotals.tickets,
          contractTotals.payments,
          contractTotals.contractPrice,
          contractTotals.contractNumber
        ) * contract.contractPrice;
      contractTotals.twentyTwoAndOver =
        getTwentyTwoandOverDays(
          contractTotals.tickets,
          contractTotals.payments,
          contractTotals.contractPrice,
          contractTotals.contractNumber
        ) * contract.contractPrice;

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
      setActivePurchaseContracts(contractData.items);
    }
  }, [contractData]);

  useEffect(() => {
    if (activePurchaseContracts.length) {
      computeContractTotals();
    }
  }, [activePurchaseContracts]);

  const computeTotalsFromTickets = () => {
    const byVendor = groupBy(contractsTotals, (contract) => contract.company);
    let vendors = [];
    setTotal1(contractsTotals.reduce((acc, cv) => acc + cv.zeroToSeven, 0));
    setTotal2(contractsTotals.reduce((acc, cv) => acc + cv.eightToFourteen, 0));
    setTotal3(
      contractsTotals.reduce((acc, cv) => acc + cv.fifteenToTwentyOne, 0)
    );
    setTotal4(
      contractsTotals.reduce((acc, cv) => acc + cv.twentyTwoAndOver, 0)
    );
    setGrandTotal(
      contractsTotals.reduce((acc, cv) => acc + cv.totalBalanceDue, 0)
    );
    contractsTotals.map((contract) => vendors.push(contract.company));
    let uniqureVendors = [...new Set(vendors)];
    let array = [];
    uniqureVendors.map((v) => {
      const myContracts = byVendor.get(v);

      myContracts.sort((a, b) => {
        let nameA = a.contractNumber;
        let nameB = b.contractNumber;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
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

  const getZeroToSevenDaysOld = (
    tickets,
    payments,
    contractPrice,
    contractNumber
  ) => {
    let zeroToSeven = {};

    let overages = 0;
    let underages = 0;

    payments.map((p) => {
      if (p.tickets.items.length) {
        if (
          moment(moment(endDate).endOf("day")).diff(
            moment(p.tickets.items[0].ticketDate).endOf("day"),
            "days"
          ) >= 0 &&
          moment(moment(endDate).endOf("day")).diff(
            moment(p.tickets.items[0].ticketDate).endOf("day"),
            "days"
          ) < 8 &&
          moment(moment(p.date).endOf("day")).isBefore(
            moment(endDate).endOf("day")
          ) &&
          (p.underage > 0.01 || p.overage > 0.01)
        ) {
          overages = overages + p.overage;
          underages = underages + p.underage;
        }
      }
    });

    const myTickets = tickets.filter(
      (ticket) =>
        moment(moment(endDate).endOf("day")).diff(
          moment(ticket.ticketDate).endOf("day"),
          "days"
        ) < 8 &&
        moment(moment(endDate).endOf("day")).diff(
          moment(ticket.ticketDate).endOf("day"),
          "days"
        ) >= 0 &&
        !ticket.paymentId
    );
    const paymentsBeforeEndDate = payments.filter((p) =>
      moment(p.date).isBefore(moment(endDate).endOf("date"))
    );

    const ticketsOnPaymentsBeforeEndDate = [];
    paymentsBeforeEndDate.map((p) =>
      p.tickets.items.map((t) => ticketsOnPaymentsBeforeEndDate.push(t))
    );

    const paidTicketsWithinRange = payments.map((p) =>
      tickets.filter(
        (t) =>
          t.paymentId === p.id &&
          moment(endDate).diff(moment(t.ticketDate), "days") < 8 &&
          moment(endDate).diff(moment(t.ticketDate), "days") >= 0
      )
    );
    let paidTicketsWithinRangeFlattened = paidTicketsWithinRange.flat();

    ticketsOnPaymentsBeforeEndDate.map((ticket) =>
      paidTicketsWithinRangeFlattened.map((t, index) => {
        if (t.id === ticket.id) {
          paidTicketsWithinRangeFlattened.splice(index, 1);
        }
      })
    );

    const allTicketsWithInRange = myTickets.concat(
      paidTicketsWithinRangeFlattened
    );

    zeroToSeven.tickets = allTicketsWithInRange;
    zeroToSeven.overages = overages;
    zeroToSeven.underages = underages;
    zeroToSeven.contractPrice = contractPrice;
    zeroToSeven.contractNumber = contractNumber;

    let tonsBalance = calculateTonsBalance(zeroToSeven);
    return tonsBalance;
  };

  function calculateTonsBalance(myObj) {
    let ticketTotalTons = myObj.tickets.reduce(
      (acc, cv) => acc + cv.netTons,
      0
    );

    return ticketTotalTons + myObj.underages - myObj.overages;
  }

  const getEightToFourteenDaysOld = (
    tickets,
    payments,
    contractPrice,
    contractNumber
  ) => {
    let eightToFourteen = {};
    const myTickets = tickets.filter(
      (ticket) =>
        moment(endDate).diff(moment(ticket.ticketDate), "days") >= 8 &&
        moment(endDate).diff(moment(ticket.ticketDate), "days") <= 14 &&
        !ticket.paymentId
    );

    const paymentsBeforeEndDate = payments.filter((p) =>
      moment(p.date).isBefore(moment(endDate).endOf("date"))
    );

    const ticketsOnPaymentsBeforeEndDate = [];
    paymentsBeforeEndDate.map((p) =>
      p.tickets.items.map((t) => ticketsOnPaymentsBeforeEndDate.push(t))
    );

    const paidTicketsWithinRange = payments.map((p) =>
      tickets.filter(
        (t) =>
          t.paymentId === p.id &&
          moment(endDate).diff(moment(t.ticketDate), "days") >= 8 &&
          moment(endDate).diff(moment(t.ticketDate), "days") <= 14
      )
    );
    let paidTicketsWithinRangeFlattened = paidTicketsWithinRange.flat();

    ticketsOnPaymentsBeforeEndDate.map((ticket) =>
      paidTicketsWithinRangeFlattened.map((t, index) => {
        if (t.id === ticket.id) {
          paidTicketsWithinRangeFlattened.splice(index, 1);
        }
      })
    );

    const allTicketsWithInRange = myTickets.concat(
      paidTicketsWithinRangeFlattened
    );

    let overages = 0;
    let underages = 0;

    payments.map((p) => {
      if (p.tickets.items.length) {
        if (
          moment(endDate).diff(moment(p.tickets.items[0].ticketDate), "days") >=
            8 &&
          moment(endDate).diff(moment(p.tickets.items[0].ticketDate), "days") <=
            14 &&
          moment(p.date).isBefore(moment(endDate).endOf("date")) &&
          (p.underage > 0.01 || p.overage > 0.01)
        ) {
          overages = overages + p.overage;
          underages = underages + p.underage;
        }
      }
    });

    eightToFourteen.tickets = allTicketsWithInRange;
    eightToFourteen.overages = overages;
    eightToFourteen.underages = underages;

    eightToFourteen.contractPrice = contractPrice;
    eightToFourteen.contractNumber = contractNumber;

    let tonsBalance = calculateTonsBalance(eightToFourteen);
    return tonsBalance;
  };

  const getFifteenToTwentyOneDaysOld = (
    tickets,
    payments,
    contractPrice,
    contractNumber
  ) => {
    let fifteenToTwentyOne = {};
    const myTickets = tickets.filter(
      (ticket) =>
        moment(endDate).diff(moment(ticket.ticketDate), "days") >= 15 &&
        moment(endDate).diff(moment(ticket.ticketDate), "days") <= 21 &&
        !ticket.paymentId
    );

    const paymentsBeforeEndDate = payments.filter((p) =>
      moment(p.date).isBefore(moment(endDate).endOf("date"))
    );

    const ticketsOnPaymentsBeforeEndDate = [];
    paymentsBeforeEndDate.map((p) =>
      p.tickets.items.map((t) => ticketsOnPaymentsBeforeEndDate.push(t))
    );
    const paidTicketsWithinRange = payments.map((p) =>
      tickets.filter(
        (t) =>
          t.paymentId === p.id &&
          moment(endDate).diff(moment(t.ticketDate), "days") >= 15 &&
          moment(endDate).diff(moment(t.ticketDate), "days") <= 21
      )
    );
    let paidTicketsWithinRangeFlattened = paidTicketsWithinRange.flat();

    ticketsOnPaymentsBeforeEndDate.map((ticket) =>
      paidTicketsWithinRangeFlattened.map((t, index) => {
        if (t.id === ticket.id) {
          paidTicketsWithinRangeFlattened.splice(index, 1);
        }
      })
    );

    const allTicketsWithInRange = myTickets.concat(
      paidTicketsWithinRangeFlattened
    );

    let overages = 0;
    let underages = 0;

    payments.map((p) => {
      if (p.tickets.items.length) {
        if (
          moment(endDate).diff(moment(p.tickets.items[0].ticketDate), "days") >=
            14 &&
          moment(endDate).diff(moment(p.tickets.items[0].ticketDate), "days") <
            21 &&
          moment(p.date).isBefore(moment(endDate).endOf("date")) &&
          (p.underage > 0.01 || p.overage > 0.01)
        ) {
          overages = overages + p.overage;
          underages = underages + p.underage;
        }
      }
    });
    fifteenToTwentyOne.tickets = allTicketsWithInRange;
    fifteenToTwentyOne.overages = overages;
    fifteenToTwentyOne.underages = underages;
    fifteenToTwentyOne.contractPrice = contractPrice;
    fifteenToTwentyOne.contractNumber = contractNumber;

    let tonsBalance = calculateTonsBalance(fifteenToTwentyOne);
    return tonsBalance;
  };

  const getTwentyTwoandOverDays = (
    tickets,
    payments,
    contractPrice,
    contractNumber
  ) => {
    let twentyTwoAndOver = {};
    const myTickets = tickets.filter(
      (ticket) =>
        moment(endDate).diff(moment(ticket.ticketDate), "days") >= 22 &&
        !ticket.paymentId
    );

    const paymentsBeforeEndDate = payments.filter((p) =>
      moment(p.date).isBefore(moment(endDate).endOf("date"))
    );

    const ticketsOnPaymentsBeforeEndDate = [];
    paymentsBeforeEndDate.map((p) =>
      p.tickets.items.map((t) => ticketsOnPaymentsBeforeEndDate.push(t))
    );
    const paidTicketsWithinRange = payments.map((p) =>
      tickets.filter(
        (t) =>
          t.paymentId === p.id &&
          moment(endDate).diff(moment(t.ticketDate), "days") >= 22 &&
          moment(endDate).isBefore(moment(endDate).endOf("day"))
      )
    );
    let paidTicketsWithinRangeFlattened = paidTicketsWithinRange.flat();

    ticketsOnPaymentsBeforeEndDate.map((ticket) =>
      paidTicketsWithinRangeFlattened.map((t, index) => {
        if (t.id === ticket.id) {
          paidTicketsWithinRangeFlattened.splice(index, 1);
        }
      })
    );
    myTickets.map((t) => paidTicketsWithinRangeFlattened.push(t));

    let overages = 0;
    let underages = 0;

    payments.map((p) => {
      if (p.tickets.items.length) {
        if (
          moment(endDate).diff(moment(p.tickets.items[0].ticketDate), "days") >=
            22 &&
          moment(p.date).isBefore(moment(endDate).endOf("date")) &&
          (p.underage > 0.01 || p.overage > 0.01)
        ) {
          overages = overages + p.overage;
          underages = underages + p.underage;
        }
      } else {
        overages = overages + p.overage;
      }
    });
    twentyTwoAndOver.tickets = paidTicketsWithinRangeFlattened;
    twentyTwoAndOver.overages = overages;
    twentyTwoAndOver.underages = underages;
    twentyTwoAndOver.contractPrice = contractPrice;
    twentyTwoAndOver.contractNumber = contractNumber;
    let tonsBalance = calculateTonsBalance(twentyTwoAndOver);
    return tonsBalance;
  };

  const getBalanceDueForContract = (
    tickets,
    payments,
    contractPrice,
    contractNumber
  ) => {
    let contractTotal = {};

    let overages = 0;
    let underages = 0;
    payments.map((p, index) => {
      console.log(p, contractNumber);
      if (p.tickets.items.length) {
        if (
          moment(endDate).diff(moment(p.tickets.items[0].ticketDate), "days") >=
            0 &&
          moment(p.date).isBefore(moment(endDate).endOf("day")) &&
          (p.underage > 0.01 || p.overage > 0.01)
        ) {
          overages = overages + p.overage;
          underages = underages + p.underage;
        }
      }
      if (p.tickets.items.length == 0) {
        if (
          moment(p.date).isBefore(moment(endDate).endOf("date")) &&
          (p.underage > 0.01 || p.overage > 0.01)
        ) {
          overages = overages + p.overage;
          underages = underages + p.underage;
        }
      }
    });

    const myTickets = tickets.filter(
      (ticket) =>
        moment(moment(endDate).endOf("day")).diff(
          moment(ticket.ticketDate).endOf("day"),
          "days"
        ) >= 0 && !ticket.paymentId
    );

    const paymentsBeforeEndDate = payments.filter((p) =>
      moment(p.date).isBefore(moment(endDate).endOf("date"))
    );

    const ticketsOnPaymentsBeforeEndDate = [];
    paymentsBeforeEndDate.map((p) =>
      p.tickets.items.map((t) => ticketsOnPaymentsBeforeEndDate.push(t))
    );

    const paidTicketsWithinRange = payments.map((p) =>
      tickets.filter(
        (t) =>
          t.paymentId === p.id &&
          moment(endDate).diff(moment(t.ticketDate), "days") >= 0
      )
    );
    let paidTicketsWithinRangeFlattened = paidTicketsWithinRange.flat();

    ticketsOnPaymentsBeforeEndDate.map((ticket) =>
      paidTicketsWithinRangeFlattened.map((t, index) => {
        if (t.id === ticket.id) {
          paidTicketsWithinRangeFlattened.splice(index, 1);
        }
      })
    );

    const allTicketsWithInRange = myTickets.concat(
      paidTicketsWithinRangeFlattened
    );

    contractTotal.tickets = allTicketsWithInRange;
    contractTotal.overages = overages;
    contractTotal.underages = underages;
    contractTotal.contractPrice = contractPrice;
    contractTotal.contractNumber = contractNumber;

    return calculateTonsBalance(contractTotal);
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
          <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold mt-6">
            <h3>Accounts Payable Report</h3>
            <span className="text-gray-900 font-light">
              Ending: {moment(endDate).format("MM/DD/YY")}
            </span>
          </div>

          <div className="mx-12 ">
            {vendorTotals.length > 0 ? (
              vendorTotals.map((item, index) => (
                <div className="mr-4" key={index}>
                  {console.log(item.contracts)}
                  <table className="mb-6">
                    <thead>
                      <tr className="">
                        <th className="px-2 w-48 text-sm font-semibold ">
                          {item.company}
                        </th>
                        <th className="text-xs px-10 ">Contract</th>
                        <th className="px-10 text-xs">Balance Due</th>
                        <th className="px-10 text-xs">0-7</th>
                        <th className="px-10 text-xs">8-14</th>
                        <th className="px-10 text-xs">15-21</th>
                        <th className="px-10 text-xs">22-Over</th>
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
                              {/* TODO - Need new function here */}
                              {formatMoney.format(contract.totalBalanceDue)}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(contract.zeroToSeven)}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(contract.eightToFourteen)}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(contract.fifteenToTwentyOne)}
                            </td>

                            <td className="text-center">
                              {formatMoney.format(contract.twentyTwoAndOver)}
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

                        <td className="text-center py-2 font-semibold">
                          {formatMoney.format(
                            item.contracts.reduce(
                              (acc, cv) => acc + cv.zeroToSeven,
                              0
                            )
                          )}
                        </td>
                        <td className="text-center py-2 font-semibold">
                          {formatMoney.format(
                            item.contracts.reduce(
                              (acc, cv) => acc + cv.eightToFourteen,
                              0
                            )
                          )}
                        </td>
                        <td className="text-center py-2 font-semibold">
                          {formatMoney.format(
                            item.contracts.reduce(
                              (acc, cv) => acc + cv.fifteenToTwentyOne,
                              0
                            )
                          )}
                        </td>
                        <td className="text-center py-2 font-semibold">
                          {formatMoney.format(
                            item.contracts.reduce(
                              (acc, cv) => acc + cv.twentyTwoAndOver,
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
          <div className="pb-24 border-t-2 border-gray-900 ">
            <table className="mx-24">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Total</th>
                  <th>0-7</th>
                  <th>8-14</th>
                  <th>15-21</th>
                  <th>22-Over</th>
                </tr>
              </thead>
              <tbody>
                <tr className="w-48">
                  <td className=" w-32 px-10"></td>
                  <td className="px-6">Grand Totals:</td>
                  <td className="px-6 text-center">
                    {formatMoney.format(grandTotal)}
                  </td>
                  <td className="px-5 text-center">
                    {formatMoney.format(total1)}
                  </td>
                  <td className="px-5 text-center">
                    {formatMoney.format(total2)}
                  </td>
                  <td className="px-5 text-center">
                    {formatMoney.format(total3)}
                  </td>
                  <td className="px-5 text-center">
                    {formatMoney.format(total4)}
                  </td>
                </tr>
              </tbody>
            </table>
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

export default AccountsPayable;
