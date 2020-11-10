import { API, withSSRContext } from "aws-amplify";
import Table from "../../components/table";
import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { computeAvgNetTons, groupBy } from "../../utils";
import moment from "moment";
import Layout from "../../components/layout";
import {
  listReportTickets,
  ticketsByDate,
} from "../../src/graphql/customQueries";
import { listCommoditys } from "../../src/graphql/queries.ts";
import { useQuery, useInfiniteQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { TypeFormatFlags } from "typescript";

const CommodityTotals = () => {
  const cache = useQueryCache();
  const [beginDate, setBeginDate] = useState(
    cache.getQueryData("cctDates")
      ? cache.getQueryData("cctDates").beginDate
      : null
  );
  const [endDate, setEndDate] = useState(
    cache.getQueryData("cctDates")
      ? cache.getQueryData("cctDates").endDate
      : null
  );
  const [tickets, setTickets] = useState([]);
  const [ticketsYTD, setTicketsYTD] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [totals, setTotals] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: commodityData } = useQuery("commodities", async () => {
    const {
      data: { listCommoditys: myCommodities },
    } = await API.graphql({
      query: listCommoditys,
    });
    return myCommodities;
  });

  const { data: initTicketsData, refetch, isFetched } = useQuery(
    "commodityTonTotals",
    async () => {
      const {
        data: { ticketsByDate: initTickets },
      } = await API.graphql({
        query: ticketsByDate,

        variables: {
          type: "Ticket",
          ticketDate: {
            between: [
              moment(beginDate).startOf("day"),
              moment(endDate).endOf("day"),
            ],
          },
          limit: 2000,
        },
      });
      return initTickets;
    },
    {
      enabled: false,
      cacheTime: 1000 * 60 * 59,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: true,
      forceFetchOnMount: false,
      keepPreviousData: false,
    }
  );

  const {
    status,
    data: ticketsDataInfinite,
    error,
    isFetching,
    isFetchingMore,
    isSuccess,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "commodityTonTotals",
    async (
      key,
      nextToken = cache.getQueryData("commodityTonTotals").nextToken
    ) => {
      const {
        data: { ticketsByDate: ticketData },
      } = await API.graphql({
        query: ticketsByDate,
        variables: {
          limit: 2000,
          type: "Ticket",
          ticketDate: {
            between: [
              moment(beginDate).startOf("day"),
              moment(endDate).endOf("day"),
            ],
          },

          nextToken,
        },
      });
      return ticketData;
    },
    {
      enabled: false,
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextToken,
      cacheTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      forceFetchOnMount: false,
      keepPreviousData: false,
    }
  );

  const { data: ytdTicketsData, refetch: refetchYTD } = useQuery(
    "commodityTonTotalsYTD",
    async () => {
      const {
        data: { ticketsByDate: initTicketsYTD },
      } = await API.graphql({
        query: ticketsByDate,
        variables: {
          limit: 2000,
          type: "Ticket",
          ticketDate: {
            between: [moment().startOf("year"), moment(endDate).endOf("day")],
          },
        },
      });

      return initTicketsYTD;
    },
    {
      enabled: false,
      cacheTime: 1000 * 60 * 59,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: true,
      forceFetchOnMount: false,
      keepPreviousData: false,
    }
  );

  const {
    status: ytdStatus,
    data: ytdData,
    error: ytdError,
    isFetching: ytdIsFetching,
    isFetchingMore: ytdIsFetchingMore,
    fetchMore: ytdFetchMore,
    canFetchMore: ytdCanFetchMore,
    isSuccess: ytdInfiniteIsSuccess,
  } = useInfiniteQuery(
    "commodityTonTotalsYTD",
    async (
      key,
      nextToken = cache.getQueryData("commodityTonTotalsYTD").nextToken
    ) => {
      const {
        data: { ticketsByDate: ticketData },
      } = await API.graphql({
        query: ticketsByDate,
        variables: {
          limit: 2000,
          type: "Ticket",
          ticketDate: {
            between: [moment().startOf("year"), moment(endDate).endOf("day")],
          },

          nextToken,
        },
      });
      return ticketData;
    },
    {
      enabled: false,
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextToken,
      cacheTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      forceFetchOnMount: false,
      keepPreviousData: false,
    }
  );

  const computeTotals = () => {
    const groupedYTD = groupBy(
      ticketsYTD,
      (ticket) => ticket.contract.commodity.name
    );
    const grouped = groupBy(
      tickets,
      (ticket) => ticket.contract.commodity.name
    );
    let array = [];
    commodities.map((c) => {
      let commodityTotal = {};
      const group = grouped.get(c.name);
      const ytdGroup = groupedYTD.get(c.name);
      commodityTotal.commodity = c.name;

      commodityTotal.weekNumLoads = group ? group.length : 0;
      commodityTotal.yearNumLoads = ytdGroup ? ytdGroup.length : 0;

      commodityTotal.weekAvgTons = group ? computeAvgNetTons(group) : 0;
      commodityTotal.yearAvgTons = ytdGroup ? computeAvgNetTons(ytdGroup) : 0;

      array.push(commodityTotal);
    });

    setTotals(array);
  };

  const computeWeekTotalAvg = () => {
    let count = 0;
    totals.map((t) => {
      if (t.weekAvgTons) {
        count++;
      }
    });
    return (totals.reduce((a, cv) => a + cv.weekAvgTons, 0) / count).toFixed(2);
  };

  const computeYearTotalAvg = () => {
    let count = 0;
    totals.map((t) => {
      if (t.yearAvgTons) {
        count++;
      }
    });
    return (totals.reduce((a, cv) => a + cv.yearAvgTons, 0) / count).toFixed(2);
  };

  useEffect(() => {
    if (commodityData) {
      setCommodities(commodityData.items);
    }
  }, [commodityData]);

  useEffect(() => {
    if (totals.length) {
      console.log(totals);
      totals.sort((a, b) => {
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
    }
  }, [totals]);

  useEffect(() => {
    if (ytdTicketsData) {
      ytdFetchMore();
    }
    if (ytdCanFetchMore && !ytdIsFetching) {
      ytdFetchMore();
    }
    if (ytdTicketsData && ytdTicketsData.length && !ytdCanFetchMore) {
      compileDataYTD();
    }
  }, [ytdTicketsData]);

  useEffect(() => {
    if (initTicketsData) {
      fetchMore();
    }
    if (initTicketsData && canFetchMore && !isFetchingMore) {
      fetchMore();
    }

    if (initTicketsData && initTicketsData.length && !canFetchMore) {
      compileData();
    }
  }, [initTicketsData]);

  useEffect(() => {
    if (tickets.length > 0 && ticketsYTD.length > 0) {
      computeTotals();
      cache.setQueryData("cctDates", {
        beginDate: beginDate,
        endDate: endDate,
      });
    }
  }, [tickets, ticketsYTD]);

  const handleFetchQueries = () => {
    setTickets([]);
    setTicketsYTD([]);
    setTotals([]);

    refetch();
    refetchYTD();
  };

  const compileData = () => {
    if (isInitialLoad) {
      let array = [...tickets];

      ticketsDataInfinite &&
        ticketsDataInfinite.map((group, i) => {
          group.items.map((item) => array.push(item));
        });
      setTickets(array);
      setIsInitialLoad(false);
    } else {
      let array = [];
      ticketsDataInfinite &&
        ticketsDataInfinite.map((group, i) => {
          group.items.map((item) => array.push(item));
        });
      setTickets(array);
    }
  };

  const compileDataYTD = () => {
    if (isInitialLoad) {
      let array = [...ticketsYTD];

      ytdData &&
        ytdData.map((group, i) => {
          group.items.map((item) => array.push(item));
        });
      setTicketsYTD(array);
      setIsInitialLoad(false);
    } else {
      let array = [];
      ytdData &&
        ytdData.map((group, i) => {
          group.items.map((item) => array.push(item));
        });
      setTicketsYTD(array);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Commodity",
        accessor: "commodity",
      },
      {
        Header: "Weekly Number of Loads",
        accessor: "weekNumLoads",
      },
      {
        Header: "Year Number of Loads",
        accessor: "yearNumLoads",
      },
      {
        Header: "Week Avg Tons",
        accessor: "weekAvgTons",
      },
      {
        Header: "YTD Avg Tons",
        accessor: "yearAvgTons",
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="px-12">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Commodity Ton Totals</h3>
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
        <div>
          <div>
            <span className="text-gray-600 text-sm">Beginning Date: </span>
            <span className="mx-1 text-base text-gray-900">
              {moment(beginDate).isValid()
                ? moment(beginDate).format("MM/DD/YY")
                : `Not Set`}
            </span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">End Date: </span>
            <span className="mx-1 text-base text-gray-900 ">
              {" "}
              {moment(beginDate).isValid()
                ? moment(endDate).format("MM/DD/YY")
                : `Not Set`}
            </span>
          </div>
        </div>
        <div className="px-12">
          {!isFetched ? (
            <p>Choose dates to generate report.</p>
          ) : isSuccess &&
            ytdInfiniteIsSuccess &&
            !canFetchMore &&
            !ytdCanFetchMore ? (
            <table>
              <thead>
                <tr className="">
                  <th>Commodity</th>
                  <th className="pr-2">Week Number Loads</th>
                  <th className="pr-2">Year Number Loads</th>
                  <th className="pr-2">Week Avg Tons</th>
                  <th className="pr-2"> Year Avg Tons</th>
                </tr>
              </thead>
              <tbody>
                {totals.map((total) => (
                  <tr>
                    <td className="px-2 py-1">{total.commodity}</td>
                    <td className="px-2 py-1">{total.weekNumLoads}</td>
                    <td className="px-2 py-1">{total.yearNumLoads}</td>
                    <td className="px-2 py-1">{total.weekAvgTons}</td>
                    <td className="px-2 py-1">{total.yearAvgTons}</td>
                  </tr>
                ))}
                <tr>
                  <td className=" border-t-4 border-gray-700">Totals:</td>
                  <td className=" border-t-4 border-gray-700">
                    {totals.reduce(
                      (accumulator, cv) => accumulator + cv.weekNumLoads,
                      0
                    )}
                  </td>
                  <td className=" border-t-4 border-gray-700">
                    {totals.reduce(
                      (accumulator, cv) => accumulator + cv.yearNumLoads,
                      0
                    )}
                  </td>
                  <td className=" border-t-4 border-gray-700">
                    {totals.length && computeWeekTotalAvg()}
                  </td>
                  <td className=" border-t-4 border-gray-700">
                    {totals.length && computeYearTotalAvg()}
                  </td>
                </tr>
              </tbody>
              <tbody></tbody>
            </table>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <ReactQueryDevtools />
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

export default CommodityTotals;
