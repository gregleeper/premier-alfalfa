import { API, withSSRContext } from "aws-amplify";
import { useState, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import Layout from "../../components/layout";
import { listReportTickets } from "../../src/graphql/customQueries";
import { listContracts } from "../../src/graphql/queries";
import ReportsTable from "../../components/reportsTable";
import { groupBy, computeSum } from "../../utils";
import { useQuery, useInfiniteQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import ReactToPrint from "react-to-print";

const TotalTonsHauled = () => {
  let ref = useRef(null);
  const cache = useQueryCache();
  const [beginDate, setBeginDate] = useState(
    cache.getQueryData("tthDates")
      ? cache.getQueryData("tthDates").beginDate
      : null
  );
  const [endDate, setEndDate] = useState(
    cache.getQueryData("tthDates")
      ? cache.getQueryData("tthDates").endDate
      : null
  );
  const [activeContracts, setActiveContracts] = useState([]);
  const [ticketsYTD, setTicketsYTD] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [totals, setTotals] = useState([]);
  const [commodityTotals, setCommodityTotals] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: initTicketsData, refetch, isFetched } = useQuery(
    "totalTonsHauled",
    async () => {
      const {
        data: { listTickets: initTickets },
      } = await API.graphql({
        query: listReportTickets,
        variables: {
          limit: 3000,
          filter: {
            ticketDate: {
              between: [
                moment(beginDate).startOf("day"),
                moment(endDate).endOf("day"),
              ],
            },
          },
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
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "totalTonsHauled",
    async (
      key,
      nextToken = cache.getQueryData("totalTonsHauled").nextToken
    ) => {
      const {
        data: { listTickets: ticketData },
      } = await API.graphql({
        query: listReportTickets,
        variables: {
          limit: 3000,
          filter: {
            ticketDate: {
              between: [
                moment(beginDate).startOf("day"),
                moment(endDate).endOf("day"),
              ],
            },
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
    "totalTonsHauledYTD",
    async () => {
      const {
        data: { listTickets: initTickets },
      } = await API.graphql({
        query: listReportTickets,
        variables: {
          limit: 3000,
          filter: {
            ticketDate: {
              between: [moment().startOf("year"), moment(endDate).endOf("day")],
            },
          },
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
    status: ytdStatus,
    data: ytdData,
    error: ytdError,
    isFetching: ytdIsFetching,
    isSuccess,
    isFetchingMore: ytdIsFetchingMore,
    fetchMore: ytdFetchMore,
    canFetchMore: ytdCanFetchMore,
  } = useInfiniteQuery(
    "totalTonsHauledYTD",
    async (
      key,
      nextToken = cache.getQueryData("totalTonsHauledYTD").nextToken
    ) => {
      const {
        data: { listTickets: ticketData },
      } = await API.graphql({
        query: listReportTickets,
        variables: {
          limit: 3000,
          filter: {
            ticketDate: {
              between: [moment().startOf("year"), moment(endDate).endOf("day")],
            },
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
  const { data: activeContractsData } = useQuery(
    "activeContracts",
    async () => {
      const {
        data: { listContracts: activeContracts },
      } = await API.graphql({
        query: listContracts,
        variables: {
          limit: 3000,
          filter: {
            contractState: { eq: "ACTIVE" },
          },
        },
      });
      return activeContracts;
    }
  );

  const computeTotals = () => {
    const byContract = groupBy(tickets, (ticket) => ticket.contractId);

    const YTDbyContract = groupBy(ticketsYTD, (ticket) => ticket.contractId);

    const byCommodity = groupBy(
      tickets,
      (ticket) => ticket.contract.commodity.name
    );

    const byCommodityYTD = groupBy(
      ticketsYTD,
      (ticket) => ticket.contract.commodity.name
    );
    let commoditiesHauled = [];
    byCommodity.forEach((i, index) => {
      let array = [];
      let arrayYTD = [];
      let commodity = {};

      commodity.name = i[0].contract.commodity.name;
      const group = byCommodity.get(commodity.name);
      const groupYtd = byCommodityYTD.get(commodity.name);
      const commodityByContract = groupBy(group, (ticket) => ticket.contractId);
      activeContracts.map((contract, index) => {
        const commodityGroupByContract = commodityByContract.get(contract.id);
        if (commodityGroupByContract) {
          array.push(commodityGroupByContract);
        } else {
          console.log(contract, index);
        }
      });
      const commodityByContractYTD = groupBy(
        groupYtd,
        (ticket) => ticket.contractId
      );
      activeContracts.map((contract, index) => {
        const commodityGroupByContractYTD = commodityByContractYTD.get(
          contract.id
        );
        if (commodityGroupByContractYTD) {
          arrayYTD.push(commodityGroupByContractYTD);
        }
      });

      commodity.weekTotal = computeSum(group);
      commodity.ytdTotal = computeSum(groupYtd);
      commoditiesHauled.push(commodity);
      array.push(commodity);
      arrayYTD.push(commodity);
      // console.log(array);
      // console.log(arrayYTD);
      let commodityTotals = [];
      array.map((element) => {
        let commodity = {};

        if (element.name) {
          commodity.commodityName = element.name;
        }
        if (!element.name) {
          commodity.contractNumber = element[0].contract.contractNumber;
          const contractNetTons = element.reduce(function (
            accumulator,
            currentValue
          ) {
            return accumulator + currentValue.netTons;
          },
          0);
          commodity.contractNetTons = contractNetTons;
        }
        commodityTotals.push(commodity);
      });
      //console.log(commodityTotals);
    });
    setCommodityTotals(commoditiesHauled);
    let array = [];

    activeContracts.map((contract) => {
      let ticketTotals = {};
      const group = byContract.get(contract.id);
      const groupYTD = YTDbyContract.get(contract.id);
      ticketTotals.commodity = contract.commodity.name;
      ticketTotals.contractNumber = contract.contractNumber;
      ticketTotals.contractName = contract.contractTo.companyReportName;

      ticketTotals.weeklyHaul = computeSum(group);
      ticketTotals.toDate = computeSum(groupYTD);
      ticketTotals.totalContract = contract.quantity;
      ticketTotals.balanceDue = contract.quantity - ticketTotals.toDate;
      array.push(ticketTotals);
    });
    setTotals(array);
  };

  const compileData = () => {
    if (isInitialLoad) {
      let array = [...tickets];

      data &&
        data.map((group, i) => {
          group.items.map((item) => array.push(item));
        });
      setTickets(array);
      setIsInitialLoad(false);
    } else {
      let array = [];
      data &&
        data.map((group, i) => {
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

  const handleFetchQueries = () => {
    setTickets([]);
    setTicketsYTD([]);
    setTotals([]);

    refetch();
    refetchYTD();
  };

  useEffect(() => {
    if (activeContractsData) {
      setActiveContracts(activeContractsData.items);
    }
  }, [activeContractsData]);

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
      cache.setQueryData("tthDates", {
        beginDate: beginDate,
        endDate: endDate,
      });
    }
  }, [tickets, ticketsYTD]);

  const columns = useMemo(() => [
    {
      Header: "Commodity",
      accessor: "commodity",
    },
    {
      Header: "Contract Number",
      accessor: "contractNumber",
    },
    {
      Header: "Contract Name",
      accessor: "contractName",
    },
    {
      Header: "Weekly Haul",
      accessor: "weeklyHaul",
    },
    {
      Header: "To Date",
      accessor: "toDate",
    },
    {
      Header: "Balance Due",
      accessor: "balanceDue",
    },
    {
      Header: "Total Contract",
      accessor: "totalContract",
    },
  ]);

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
            content={() => ref}
          />
        </div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Total Tons Hauled</h3>
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
        <div ref={(el) => (ref = el)}>
          <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
            <h3>Total Tons Hauled</h3>
          </div>
          <div className="px-12 mt-4">
            <div className="w-5/12 mx-auto text-center">
              <h6 className="text-gray-900 text-xl font-bold">
                Commodity Subtotals for the Period{" "}
                {moment(beginDate).isValid() ? (
                  moment(beginDate).format("MM/DD/YY")
                ) : (
                  <span>no date chosen</span>
                )}{" "}
                -{" "}
                {moment(endDate).isValid() ? (
                  moment(endDate).format("MM/DD/YY")
                ) : (
                  <span>no date chosen</span>
                )}
              </h6>
              {commodityTotals.map((c, i) => (
                <div key={i} className="flex justify-between ">
                  <p className="mr-6 text-bold">{c.name}</p>
                  <p>{c.weekTotal}</p>
                </div>
              ))}
            </div>
            {!isFetched ? (
              <p>Choose dates to generate report.</p>
            ) : isSuccess && !canFetchMore && !ytdCanFetchMore ? (
              <ReportsTable data={totals} columns={columns} />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      <ReactQueryDevtools />
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

export default TotalTonsHauled;
