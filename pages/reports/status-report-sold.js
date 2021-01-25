import { useState, useEffect, useRef } from "react";
import { API, withSSRContext } from "aws-amplify";
import ReactToPrint from "react-to-print";
import moment from "moment";
import Layout from "../../components/layout";
import { contractsByType } from "../../src/graphql/customQueries";
import {
  groupBy,
  computeSum,
  computeAvgSalePrice,
  formatMoney,
} from "../../utils";
import { useQuery } from "react-query";
import DatePicker from "react-datepicker";

const StatusReport = () => {
  let toPrint = useRef(null);
  const [endDate, setEndDate] = useState(new Date());
  const [activeContracts, setActiveContracts] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [summary, setSummary] = useState([]);

  const {
    data: activeContractsData,
    isFetched,
    status,
    isLoading,
    isFetching,
    isSuccess,
    refetch,

    clear,
  } = useQuery(
    "activeSalesContracts",
    async () => {
      const {
        data: { contractsByType: contracts },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          ticketFilter: {
            ticketDate: {
              le: moment(endDate).endOf("date"),
            },
          },
          contractType: "SALE",
          filter: {
            contractState: { eq: "ACTIVE" },
          },
          limit: 3000,
        },
      });
      return contracts;
    },
    {
      enabled: false,
      cacheTime: 1000 * 60 * 59,

      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: true,
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
    let commodityTotals = [];
    activeCommodities.map((c) => {
      const commodity = commoditiesGroup.get(c);

      let commoditySummary = { commodity: c, contracts: [] };
      commodity.map((i) => {
        let contract = {};
        let tonsHauled = computeSum(i.tickets.items);
        let avgPrice = computeAvgSalePrice(i.tickets.items);
        contract.contractNumber = i.contractNumber;
        contract.soldTo = i.soldTo;
        contract.commodity = i.commodity.name;
        contract.dueDate = moment(i.endDate).format("MM/DD/YY");
        contract.daysRemaining = moment(i.endDate).diff(
          moment(endDate).endOf("date"),
          "days"
        );
        contract.contractDate = moment(i.beginDate).format("MM/DD/YY");
        contract.quantity = i.quantity;
        contract.salePrice = i.salePrice;
        contract.avgPrice = avgPrice;
        contract.quantityRemaining = i.quantity - tonsHauled;
        contract.amount = i.salePrice * contract.quantityRemaining;
        commoditySummary.contracts.push(contract);
      });
      commodityTotals.push(commoditySummary);
    });
    commodityTotals.sort((a, b) => {
      let nameA = a.commodity;
      let nameB = b.commodity;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    setSummary(commodityTotals);
  };

  useEffect(() => {
    if (activeContractsData) {
      setActiveContracts(activeContractsData.items);
    }
  }, [activeContractsData]);

  const clearReport = () => {
    setActiveContracts([]);
    setSummary([]);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    clearReport();
    clear();
  };

  return (
    <Layout>
      <div className="px-4">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Status Report - Sales</h3>
        </div>
        <div>
          <span className="pr-2">End Date</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => handleEndDateChange(date)}
            className="form-input w-full "
          />
          <button
            className="px-3 ml-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:border-red-200"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Get Data
          </button>
        </div>
        <div>
          <div className="py-4">
            {console.log(isSuccess)}
            {isLoading && !isFetched ? (
              <p>Loading....</p>
            ) : (
              <button
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:border-red-200 mb-8 disabled:opacity-25"
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
            <div className="w-1/2 mx-auto">
              <h6 className="text-gray-900 text-2xl font-semibold text-center">
                Status Report - Sold
              </h6>
              <p className="text-center">
                {moment(endDate).format("MM/DD/YYYY")}
              </p>
            </div>
            {summary.map((c, i) => (
              <div className="mr-4 mb-12" key={i}>
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
                      <th className="px-1">Qty</th>
                      <th className="px-1">Price</th>
                      <th className="px-1">Qty Remaining</th>
                      <th className="px-1">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.contracts.map((contract) => (
                      <tr>
                        <td className="px-1">{contract.contractNumber}</td>
                        <td className="px-1">{contract.soldTo}</td>
                        <td className="px-1">{contract.commodity}</td>
                        <td className="px-1">{contract.dueDate}</td>
                        <td className="px-1">{contract.daysRemaining}</td>
                        <td className="px-1">{contract.contractDate}</td>
                        <td className="pr-2 pl-4 text-right ">
                          {contract.quantity}
                        </td>
                        <td className="pr-2 pl-4 text-right">
                          {formatMoney.format(contract.salePrice)}
                        </td>
                        <td className="pr-2 pl-4 text-right">
                          {contract.quantityRemaining.toFixed(2)}
                        </td>
                        <td className="pr-2 pl-4 text-right">
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
                      <td className="text-right">
                        {c.contracts
                          .reduce((acc, cv) => acc + cv.quantity, 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                      </td>
                      <td className="text-right">
                        {formatMoney.format(
                          c.contracts.reduce(
                            (acc, cv) => acc + cv.salePrice,
                            0
                          ) /
                            (c.contracts.length -
                              c.contracts.filter(
                                (contract) => contract.salePrice == 0
                              ).length)
                        )}
                      </td>
                      <td className="text-right">
                        {c.contracts
                          .reduce((acc, cv) => acc + cv.quantityRemaining, 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
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
