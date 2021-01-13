import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryCache } from "react-query";
import ReactToPrint from "react-to-print";
import moment from "moment";
import { contractsByType } from "../../src/graphql/customQueries";
import Layout from "../../components/layout";
import { API, withSSRContext } from "aws-amplify";
import DatePicker from "react-datepicker";
import { listCommoditys } from "../../src/graphql/queries.ts";
import { groupBy } from "../../utils";

const InventoryReductionReport = () => {
  const cache = useQueryCache();
  let toPrint = useRef(null);
  const [beginDate, setBeginDate] = useState(
    cache.getQueryData("invReductionDates")
      ? cache.getQueryData("invReductionDates").beginDate
      : null
  );
  const [endDate, setEndDate] = useState(
    cache.getQueryData("invReductionDates")
      ? cache.getQueryData("invReductionDates").endDate
      : null
  );
  const [contracts, setContracts] = useState([]);
  const [totals, setTotals] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [reportedCommodities, setReportedCommodities] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const { data: contractsData, refetch: refetch } = useQuery(
    "tth",
    async () => {
      const {
        data: { contractsByType: myContracts },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          contractType: "PURCHASE",
          filter: {
            contractState: {
              eq: "ACTIVE",
            },
          },
          ticketFilter: {
            ticketDate: {
              between: [
                moment(beginDate).startOf("day"),
                moment(endDate).endOf("day"),
              ],
            },
          },
          limit: 3000,
        },
      });
      return myContracts;
    },
    {
      enabled: false,
    }
  );

  const { data: commoditiesData } = useQuery(
    "commodities",
    async () => {
      const {
        data: { listCommoditys: myCommodities },
      } = await API.graphql({
        query: listCommoditys,
      });
      return myCommodities;
    },
    {
      cacheTime: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (commoditiesData) {
      setCommodities(commoditiesData.items);
    }
  }, [commoditiesData]);

  useEffect(() => {
    if (contractsData) {
      setContracts(contractsData.items);
    }
  }, [contractsData]);

  useEffect(() => {
    if (contracts.length) {
      computeTotals();
    }
  }, [contracts]);

  useEffect(() => {
    if (totals.length) {
      getIncludedCommodities();
      getGrandTotal();
    }
  }, [totals]);

  const computeTotals = () => {
    let array = [];

    contracts.map((contract) => {
      let contractTotals = {};
      contractTotals.commodity = contract.commodity.name;
      contractTotals.contractNumber = contract.contractNumber;
      contractTotals.company = contract.contractTo.companyReportName;

      contractTotals.weeklyNetTons = contract.tickets.items.reduce(function (
        accumulator,
        currentValue
      ) {
        return accumulator + currentValue.netTons;
      },
      0);

      array.sort((a, b) => b.weeklyNetTons - a.weeklyNetTons);
      array.push(contractTotals);
    });
    array.sort((a, b) => {
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
    setTotals(array);
  };

  const getGrandTotal = () => {
    setGrandTotal(totals.reduce((acc, cv) => acc + cv.weeklyNetTons, 0));
  };

  const getIncludedCommodities = () => {
    const group = groupBy(totals, (total) => total.commodity);
    let array = [];
    commodities.map((c) => {
      if (group.get(c.name)) {
        array.push(group.get(c.name));
      }
    });
    array.sort((a, b) => {
      let nameA = a[0].commodity;
      let nameB = b[0].commodity;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    setReportedCommodities(array);
  };

  const handleFetchQueries = () => {
    refetch();
    computeTotals();
  };

  return (
    <Layout>
      <div>
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
        </div>
        <div className="w-4/12 mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <span>Begin Date</span>
              <DatePicker
                selected={beginDate}
                onChange={(date) => setBeginDate(date)}
                className="form-input w-full"
                startDate={beginDate}
                selectsStart
              />
            </div>
            <div>
              <span>End Date</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-input w-full"
                endDate={endDate}
                minDate={beginDate}
                selectsStart
              />
            </div>
            <div>
              <button
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                onClick={() => handleFetchQueries()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div ref={(el) => (toPrint = el)} className="pt-4 pb-24">
          <div className="text-center w-1/2 mx-auto pt-6 pb-2 text-2xl font-bold">
            <h3>Inventory Reduction Report</h3>
            {beginDate && endDate ? (
              <p className="text-lg font-light">
                {`For period: ${moment(beginDate).format(
                  "MM/DD/YY"
                )} to ${moment(endDate).format("MM/DD/YY")}`}{" "}
              </p>
            ) : (
              <p>Choose dates for report</p>
            )}
          </div>
          <div>
            {reportedCommodities.length &&
              reportedCommodities.map((c, index) => (
                <div className="w-8/12 mx-auto" key={index}>
                  <h3 className="text-base font-light pt-1 pb-1">
                    {c[0].commodity}
                  </h3>
                  <div className="pl-12">
                    <table className="w-7/12">
                      <thead>
                        <tr className="text-sm">
                          <th className="px-2">Contract Number</th>
                          <th className="px-2">Company Report Name</th>
                          <th className="px-2">Tons</th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.map((element) => (
                          <tr className="text-sm">
                            <td className="px-2">{element.contractNumber}</td>
                            <td className="px-2">{element.company}</td>
                            <td className="px-2">
                              {element.weeklyNetTons.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold text-lg border-t-4 border-gray-800">
                          <td>Totals:</td>
                          <td></td>

                          <td>
                            {c
                              .reduce(
                                (accumulator, currentValue) =>
                                  accumulator + currentValue.weeklyNetTons,
                                0
                              )
                              .toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
          <div className="w-8/12 mx-auto font-semibold pt-12">
            <div className="w-7/12 flex justify-between">
              <div>
                <span className="pl-12">Grand Total: </span>
              </div>
              <div>
                <span className="text-xl">
                  {grandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
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

export default InventoryReductionReport;
