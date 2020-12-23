import { useQuery, useQueryCache, useInfiniteQuery } from "react-query";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import {
  paymentsSorted,
  ticketsByContract,
} from "../../src/graphql/customQueries";
import Layout from "../../components/layout";
import Table from "../../components/table";
import { formatMoney } from "../../utils";
import { ReactQueryDevtools } from "react-query-devtools";

const Payments = () => {
  const cache = useQueryCache();
  const [payments, setPayments] = useState([]);

  const { data } = useQuery(
    "payments",
    async () => {
      const {
        data: { paymentsSorted: myPayments },
      } = await API.graphql({
        query: paymentsSorted,
        variables: {
          limit: 3000,
          sortDirection: "ASC",
          type: "Payment",
        },
      });
      return myPayments;
    },
    {
      cacheTime: 1000 * 60 * 59,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (data) {
      setPayments(data.items);
    }
  }, [data]);
  console.log(payments);
  const columns = useMemo(() => [
    {
      Header: "Edit",
      accessor: "id",
      disableFilters: true,
      Cell: ({ value }) => (
        <Link href="/payments/edit/[id]" as={`/payments/edit/${value}`}>
          <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline px-2">
            {" "}
            View
          </a>
        </Link>
      ),
    },
    {
      Header: "Contract",
      accessor: "contract.contractNumber",
    },
    {
      Header: "Company",
      accessor: "contract.contractTo.companyReportName",
    },
    {
      Header: "Check Number",
      accessor: "checkNumber",
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ value }) => <span>{moment(value).format("MM/DD/YY")}</span>,
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }) => formatMoney.format(value),
    },
    {
      Header: "Tons Credit",
      accessor: "tonsCredit",
      disableFilters: true,
    },
    {
      Header: "Overage",
      accessor: "overage",
      disableFilters: true,
      Cell: ({ value }) => {
        if (value) {
          return (
            <span>
              {value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        } else {
          return <span>0.00</span>;
        }
      },
    },
    {
      Header: "Underage",
      accessor: "underage",
      disableFilters: true,
      Cell: ({ value }) => {
        if (value) {
          return (
            <span>
              {value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        } else {
          return <span>0.00</span>;
        }
      },
    },
    {
      Header: "Tickets Paid",
      accessor: "tickets",
      Cell: ({ value }) => (
        <div>
          {value.items.map((ticket) => (
            <span className="mr-2">{ticket.ticketNumber}</span>
          ))}
        </div>
      ),
    },
  ]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Payments</h3>
        </div>
        <div className="my-6 px-12">
          <Link href="/payments/create">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Create New
            </a>
          </Link>
        </div>
        <div className="px-12">
          <Table data={payments} columns={columns} />
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

export default Payments;
