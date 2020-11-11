import Layout from "../../components/layout";
import { useMemo, useEffect, useState } from "react";
import { API, withSSRContext } from "aws-amplify";
import { ticketsByDate } from "../../src/graphql/customQueries";
import { ticketsByContract, listContracts } from "../../src/graphql/queries.ts";
import Link from "next/link";
import Table from "../../components/table";
import ReactSelect from "react-select";
import moment from "moment";
import {
  useQueryCache,
  useInfiniteQuery,
  useQuery,
  queryCache,
} from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

const Tickets = () => {
  const cache = useQueryCache();
  const [tickets, setTickets] = useState([]);
  const [contractFilter, setContractFilter] = useState();
  const [contracts, setContracts] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: contractsData } = useQuery("contracts", async () => {
    const {
      data: { listContracts: myContracts },
    } = await API.graphql({
      query: listContracts,
      variables: {
        limit: 2000,
      },
    });
    return myContracts;
  });

  const { data: initTicketsData, refetch } = useQuery(
    "tickets",
    async () => {
      const {
        data: { ticketsByDate: initTickets },
      } = await API.graphql({
        query: ticketsByDate,
        variables: {
          type: "Ticket",
          sortDirection: "DESC",
          limit: 10,
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
    }
  );

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    isFetched,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "tickets",
    async (key, nextToken = cache.getQueryData("tickets").nextToken) => {
      const {
        data: { ticketsByDate: ticketData },
      } = await API.graphql({
        query: ticketsByDate,
        variables: {
          type: "Ticket",
          limit: 2000,
          nextToken,
          sortDirection: "DESC",
        },
      });
      return ticketData;
    },
    {
      enabled: false,
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextToken,
      cacheTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!queryCache.getQueryData("tickets")) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (initTicketsData) {
      fetchMore();
    }
    if (initTicketsData && canFetchMore && !isFetchingMore) {
      fetchMore();
    }
    if (data && data.length && isFetched) {
      compileData();
    }
  }, [data, initTicketsData]);

  useEffect(() => {
    if (contractsData) {
      let options = [];
      contractsData.items.map((c) => {
        options.push({
          value: c.id,
          label: `${c.contractNumber} - ${c.contractTo.companyReportName} - ${c.contractType}`,
        });
      });
      setContracts(options);
    }
  }, [contractsData]);

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

  const columns = useMemo(
    () => [
      {
        Header: "Edit",
        accessor: "id",
        disableFilters: true,
        Cell: ({ value }) => (
          <Link href="/tickets/edit/[id]" as={`/tickets/edit/${value}`}>
            <a className="text-blue-800 underline hover:text-blue-800 hover:no-underline pl-2">
              {" "}
              Edit
            </a>
          </Link>
        ),
      },
      {
        Header: "Ticket #",
        accessor: "ticketNumber",
      },
      {
        Header: "Contract #",
        accessor: "contract.contractNumber",
        Cell: ({ row, value }) => (
          <Link
            href="/contracts/view/[id]"
            as={`/contracts/view/${row.original.contractId}`}
          >
            <a className="text-blue-800 underline hover:text-blue-600 hover:no-underline ">
              {value}
            </a>
          </Link>
        ),
      },
      {
        Header: "Company Name",
        accessor: "contract.contractTo.companyReportName",
      },
      {
        Header: "Ticket Date",
        accessor: "ticketDate",
        Cell: ({ value }) => <span>{moment(value).format("MM/DD/YY")}</span>,
      },
      {
        Header: "Corresponding Contract",
        accessor: "corresondingContract.contractNumber",
        Cell: ({ row, value }) => (
          <Link
            href="/contracts/view/[id]"
            as={`/contracts/view/${row.original.correspondingContractId}`}
          >
            <a className="text-blue-800 underline hover:text-blue-600 hover:no-underline ">
              {value}
            </a>
          </Link>
        ),
      },
      {
        Header: "Driver",
        accessor: "driver",
        disableFilters: true,
      },
      {
        Header: "Field #",
        accessor: "fieldNumber",
        disableFilters: true,
      },
      {
        Header: "BaleCt",
        accessor: "baleCount",
        disableFilters: true,
      },
      {
        Header: "Gross W",
        accessor: "grossWeight",
        disableFilters: true,
      },
      {
        Header: "Tare W",
        accessor: "tareWeight",
        disableFilters: true,
      },
      {
        Header: "Net W",
        accessor: "netWeight",
        disableFilters: true,
      },
      {
        Header: "Net Tons",
        accessor: "netTons",
        disableFilters: true,
        Footer: ({ rows }) => {
          const total = useMemo(
            () => rows.reduce((sum, row) => row.values.netTons + sum, 0),
            [rows]
          );
          return (
            <div className="py-2 text-center flex justify-around items-center border-t-4 border-gray-900">
              <div>
                <span className="text-gray-600">Total:</span>{" "}
              </div>
              <div>
                <span className="text-lg font-bold">{total.toFixed(2)}</span>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="px-6">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Tickets</h3>
        </div>
        <div className="flex justify-start items-center">
          <div className="my-6">
            <Link href="/tickets/create">
              <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
                Create New
              </a>
            </Link>
          </div>
          {/* <div className="w-1/4">
            <label htmlFor="ticketsByContract">Filter By Contract</label>
            <ReactSelect
              name="ticketsByContract"
              className="w-full"
              onChange={(target) => target ? setContractFilter(target.value) : (setContractFilter(), getAllTickets()) }
              options={contracts}
              isClearable
              
            />
          </div> */}
        </div>
        <div>
          {isFetched && !isFetchingMore ? (
            <Table data={tickets} columns={columns} />
          ) : (
            <p className="text-2xl text-gray-900">
              Loading... This could take a couple minutes while all the tickets
              are fetched.
            </p>
          )}
        </div>
      </div>
      <ReactQueryDevtools />
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    const { Auth } = withSSRContext({ req });
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
      props: {},
    };
  }
}

export default Tickets;
