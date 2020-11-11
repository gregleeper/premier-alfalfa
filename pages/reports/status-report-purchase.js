import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { API, withSSRContext } from "aws-amplify";
import moment from "moment";
import Layout from "../../components/layout";
import {
  listContracts,
  listCommoditys,
  listTickets,
} from "../../src/graphql/queries.ts";
import { contractsByType } from "../../src/graphql/customQueries";
import {
  groupBy,
  computeSum,
  computeAvgContractPrice,
  formatMoney,
} from "../../utils";
import Table from "../../components/table";
import { useQuery } from "react-query";

const StatusReport = () => {
  let toPrint = useRef(null);
  const [date, setDate] = useState(new Date());
  const [tickets, setTickets] = useState([]);

  const [activeContracts, setActiveContracts] = useState([]);
  const [ticketsForContracts, setTicketsForContracts] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [summary, setSummary] = useState([]);

  const { data: activeContractsData, isFetched } = useQuery(
    "activePurchaseContracts",
    async () => {
      const {
        data: { contractsByType: contracts },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          contractType: "PURCHASE",
          filter: {
            contractState: { eq: "ACTIVE" },
          },
          limit: 3000,
        },
      });
      return contracts;
    }
  );

  const computeTotals = () => {
    let activeCommodities = [];
    const commoditiesGroup = groupBy(
      activeContracts,
      (item) => item.commodity.name
    );
    commoditiesGroup.forEach((i) =>
      activeCommodities.push(i[0].commodity.name)
    );
    setCommodities(activeCommodities);
    console.log(commodities);
    let commodityTotals = [];
    activeCommodities.map((c) => {
      const commodity = commoditiesGroup.get(c);

      let commoditySummary = { commodity: c, contracts: [] };
      commodity.map((i) => {
        let contract = {};
        let tonsHauled = computeSum(i.tickets.items);
        let avgPrice = computeAvgContractPrice(i.tickets.items);
        contract.contractNumber = i.contractNumber;
        contract.purchasedFrom = i.purchasedFrom;
        contract.commodity = i.commodity.name;
        contract.dueDate = moment(i.endDate).format("MM/DD/YY");
        contract.daysRemaining = moment(i.endDate).diff(new Date(), "days");
        contract.contractDate = moment(i.beginDate).format("MM/DD/YY");
        contract.quantity = i.quantity;
        contract.contractPrice = i.contractPrice;
        contract.avgPrice = avgPrice;
        contract.quantityRemaining = i.quantity - tonsHauled;
        contract.amount = i.contractPrice * contract.quantityRemaining;
        commoditySummary.contracts.push(contract);
      });
      commodityTotals.push(commoditySummary);
    });
    setSummary(commodityTotals);
  };
  console.log(summary);

  useEffect(() => {
    if (activeContractsData) {
      setActiveContracts(activeContractsData.items);
    }
  }, [activeContractsData]);

  return (
    <Layout>
      <div className="px-4">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Status Report - Purchases</h3>
        </div>
        <div>
          <div className="mb-8">
            {!isFetched ? (
              <p>Loading....</p>
            ) : (
              <button
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:border-red-200"
                onClick={() => computeTotals()}
                disabled={!isFetched}
              >
                Generate Report
              </button>
            )}
          </div>
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
          <div
            ref={(el) => (toPrint = el)}
            className="mb-24 pt-12 w-11/12 mx-auto"
          >
            <div className="text-center">
              <h6 className="text-xl">Status Report - Purchases</h6>
              <p className="text-base text-gray-800">
                {moment().format("MM/DD/YYYY")}
              </p>
            </div>
            {summary.map((c, i) => (
              <div key={i}>
                <h6 className="font-bold text-xl">{c.commodity}</h6>
                <table className="mr-4">
                  <thead>
                    <tr>
                      <th className="px-1">Contract Number</th>
                      <th className="px-1">Sold to</th>
                      <th className="px-1">Commodity</th>
                      <th className="px-1">Due Date</th>
                      <th className="px-1">Days Remaining</th>
                      <th className="px-1">Contract Date</th>
                      <th className="px-1">Quantity</th>
                      <th className="px-1">Price</th>
                      <th className="px-1">Quantity Remaining</th>
                      <th className="px-1">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.contracts.map((contract) => (
                      <tr>
                        {console.log(c)}
                        <td className="px-1">{contract.contractNumber}</td>
                        <td className="px-1">{contract.soldTo}</td>
                        <td className="px-1">{contract.commodity}</td>
                        <td className="px-1">{contract.dueDate}</td>
                        <td className="px-1">{contract.daysRemaining}</td>
                        <td className="px-1">{contract.contractDate}</td>
                        <td className="px-1">{contract.quantity}</td>
                        <td className="px-1">
                          {formatMoney.format(contract.contractPrice)}
                        </td>
                        <td className="px-1 text-center">
                          {contract.quantityRemaining.toFixed(2)}
                        </td>
                        <td className="px-1">
                          {formatMoney.format(contract.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-700 py-1">
                      <td>Totals:</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-center">
                        {c.contracts
                          .reduce((acc, cv) => acc + cv.quantity, 0)
                          .toFixed(2)}
                      </td>
                      <td className="text-center">
                        {formatMoney.format(
                          c.contracts.reduce(
                            (acc, cv) => acc + cv.contractPrice,
                            0
                          ) /
                            (c.contracts.length -
                              c.contracts.filter(
                                (contract) => contract.contractPrice == 0
                              ).length)
                        )}
                      </td>
                      <td className="text-center">
                        {c.contracts
                          .reduce((acc, cv) => acc + cv.quantityRemaining, 0)
                          .toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
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

export default StatusReport;
