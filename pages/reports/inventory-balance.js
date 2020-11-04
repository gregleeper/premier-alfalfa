import { API } from "aws-amplify";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import Layout from "../../components/layout";
import {
  listReportTickets,
  contractsByType,
} from "../../src/graphql/customQueries";
import { listContracts } from "../../src/graphql/queries";
import Table from "../../components/table";
import { groupBy, computeSum } from "../../utils";
import { useQuery, useInfiniteQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
const TotalTonsHauled = () => {
  const cache = useQueryCache();
  const [beginDate, setBeginDate] = useState(
    cache.getQueryData("inventoryBalanceDates")
      ? cache.getQueryData("inventoryBalanceDates").beginDate
      : null
  );
  const [endDate, setEndDate] = useState(
    cache.getQueryData("inventoryBalanceDates")
      ? cache.getQueryData("inventoryBalanceDates").endDate
      : null
  );

  const [activeContracts, setActiveContracts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [totals, setTotals] = useState([]);
  const [commodityTotals, setCommodityTotals] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: initTicketsData, refetch, isFetched } = useQuery(
    "inventoryBalance",
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
    isSuccess,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "inventoryBalance",
    async (
      key,
      nextToken = cache.getQueryData("inventoryBalance").nextToken
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

  const { data: activeContractsData } = useQuery(
    "activeContracts",
    async () => {
      const {
        data: { contractsByType: activeContracts },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          limit: 3000,
          contractType: "PURCHASE",
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

    const byCommodity = groupBy(
      tickets,
      (ticket) => ticket.contract.commodity.name
    );
    let commoditiesHauled = [];
    byCommodity.forEach((i) => {
      let commodity = {};

      commodity.name = i[0].contract.commodity.name;
      const group = byCommodity.get(commodity.name);
      commodity.weekTotal = computeSum(group);
      commoditiesHauled.push(commodity);
    });
    setCommodityTotals(commoditiesHauled);
    let array = [];

    activeContracts.map((contract) => {
      let ticketTotals = {};
      const group = byContract.get(contract.id);

      ticketTotals.commodity = contract.commodity.name;
      ticketTotals.contractNumber = contract.contractNumber;
      ticketTotals.contractName = contract.contractTo.companyReportName;

      ticketTotals.tons = computeSum(group);

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

    setTotals([]);

    refetch();
  };

  useEffect(() => {
    if (activeContractsData) {
      setActiveContracts(activeContractsData.items);
    }
  }, [activeContractsData]);

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
    if (tickets.length > 0) {
      computeTotals();
      cache.setQueryData("inventoryBalanceDates", {
        beginDate: beginDate,
        endDate: endDate,
      });
    }
  }, [tickets]);

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
      Header: "Tons",
      accessor: "tons",
    },
  ]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Inventory Balance</h3>
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
          ) : isSuccess && !canFetchMore ? (
            <Table data={totals} columns={columns} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <ReactQueryDevtools />
    </Layout>
  );
};

export default TotalTonsHauled;
