import Layout from "../../components/layout";
import { useMemo, useEffect, useState } from "react";
import { API, withSSRContext } from "aws-amplify";
import { ticketsByDate } from "../../src/graphql/customQueries";
import { listContracts } from "../../src/graphql/queries.ts";
import Link from "next/link";
import Table from "../../components/table";
import moment from "moment";
import {
  useQueryCache,
  useInfiniteQuery,
  useQuery,
  queryCache,
} from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

const AllTickets = () => {
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

  const { data, isFetched, isSuccess, refetch } = useQuery(
    "tickets",
    async () => {
      const {
        data: {
          ticketsByDate: { items: myTickets },
        },
      } = await API.graphql({
        query: ticketsByDate,
        variables: {
          type: "Ticket",
          sortDirection: "DESC",
          limit: 500,
        },
      });
      return myTickets;
    },
    {
      cacheTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (data && isFetched) {
      setTickets(data);
    }
  }, [data]);

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
        accessor: "fieldNum",
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
      {
        Header: "Paid",
        accessor: "paymentId",
        Cell: ({ row, value }) =>
          value ? (
            <Link
              href="/payments/edit/[id]"
              as={`/payments/edit/${row.original.paymentId}`}
            >
              <a className="text-blue-800 underline hover:text-blue-600 hover:no-underline ">
                View
              </a>
            </Link>
          ) : null,
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
        <div className="">
          <div className="my-6 flex justify-between items-center">
            <div>
              <Link href="/tickets/create">
                <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
                  Create New
                </a>
              </Link>
            </div>
            <div>
              <Link href="/tickets/all">
                <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
                  Get All Tickets
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div>
          {isFetched ? (
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

export default AllTickets;
