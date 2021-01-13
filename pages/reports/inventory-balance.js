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

const TotalTons = () => {
  const cache = useQueryCache();
  let toPrint = useRef(null);
  const [beginDate, setBeginDate] = useState(
    cache.getQueryData("invDates")
      ? cache.getQueryData("invDates").beginDate
      : null
  );
  const [endDate, setEndDate] = useState(
    cache.getQueryData("invDates")
      ? cache.getQueryData("invDates").endDate
      : null
  );
  const [contractsYTD, setContractsYTD] = useState([]);
  const [totals, setTotals] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [reportedCommodities, setReportedCommodities] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const { data: contractsDataYTD, refetch: refetchYTD } = useQuery(
    "invYTD",
    async () => {
      const {
        data: { contractsByType: myContractsYTD },
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
            ticketDate: { le: moment(endDate).endOf("day") },
          },
          limit: 3000,
        },
      });
      return myContractsYTD;
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
    if (contractsDataYTD) {
      setContractsYTD(contractsDataYTD.items);
    }
  }, [contractsDataYTD]);

  useEffect(() => {
    if (contractsYTD.length) {
      computeTotals();
    }
  }, [contractsYTD]);

  useEffect(() => {
    if (totals.length) {
      getIncludedCommodities();
      calculateGrandTotal();
    }
  }, [totals]);

  const computeTotals = () => {
    let array = [];

    contractsYTD.map((contract) => {
      let contractTotals = {};
      contractTotals.commodity = contract.commodity.name;
      contractTotals.contractNumber = contract.contractNumber;
      contractTotals.company = contract.contractTo.companyReportName;
      const filtered = contract.tickets.items.filter(
        (ticket) =>
          moment(ticket.ticketDate) >= moment(beginDate).startOf("day")
      );
      contractTotals.weeklyNetTons = filtered.reduce(function (
        accumulator,
        currentValue
      ) {
        return accumulator + currentValue.netTons;
      },
      0);
      contractTotals.ytdNetTons = contract.tickets.items.reduce(function (
        accumulator,
        currentValue
      ) {
        return accumulator + currentValue.netTons;
      },
      0);
      contractTotals.balanceDue = contract.quantity - contractTotals.ytdNetTons;
      contractTotals.contractTotal = contract.quantity;
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

  const calculateGrandTotal = () => {
    setGrandTotal(totals.reduce((acc, cv) => acc + cv.balanceDue, 0));
  };

  const handleFetchQueries = () => {
    refetchYTD();
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
            <h3>Inventory Balance Report</h3>
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
          <div className="">
            <div className="w-10/12">
              {reportedCommodities.length &&
                reportedCommodities.map((c, index) => (
                  <div className="px-12" key={index}>
                    <h3 className="text-base font-light pt-1 pb-1">
                      {c[0].commodity}
                    </h3>
                    <div className="pl-12">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm">
                            <th className="px-2">Contract Number</th>
                            <th className="px-2">Company Report Name</th>
                            <th className="px-2">Inventory Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.map((element) => (
                            <tr className="text-sm">
                              <td className="px-2">{element.contractNumber}</td>
                              <td className="px-2">{element.company}</td>
                              <td className="px-2 text-right">
                                {element.balanceDue.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-semibold text-lg border-t-4 border-gray-800">
                            <td className="pb-4">Totals:</td>
                            <td className="pb-4"></td>

                            <td className="text-right">
                              {c
                                .reduce(
                                  (accumulator, currentValue) =>
                                    accumulator + currentValue.balanceDue,
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
            <div className="pl-24">
              <table className="w-10/12">
                <tbody>
                  <tr className="border-t-4 border-gray-900">
                    <td className="pr-12 font-semibold">Grand Total:</td>
                    <td className="px-12"></td>
                    <td className="px-14 text-right font-semibold text-lg">
                      {grandTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default TotalTons;
