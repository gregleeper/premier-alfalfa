import Layout from "../../../components/layout";
import Table from "../../../components/table";
import { invoicesSorted } from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import Link from "next/link";
import { useQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { useState, useEffect, useMemo } from "react";

const Invoices = () => {
  const cache = useQueryCache();
  const [invoices, setInvoices] = useState([]);

  const { data: invoicesData } = useQuery(
    "invoices",
    async () => {
      const {
        data: { invoicesSorted: invoices },
      } = await API.graphql({
        query: invoicesSorted,
        variables: {
          type: "Invoice",
          sortDirection: "DESC",
          limit: 3000,
        },
      });
      return invoices;
    },
    {
      cacheTime: 1000 * 60 * 30,
    }
  );

  useEffect(() => {
    if (invoicesData) {
      setInvoices(invoicesData.items);
    }
  }, [invoicesData]);

  const columns = useMemo(() => [
    {
      Header: "Invoice Id",
      accessor: "id",
      Cell: ({ value }) => (
        <Link href="/reports/invoices/[id]" as={`/reports/invoices/${value}`}>
          <a className="text-blue-700 underline">View</a>
        </Link>
      ),
      disableFilters: true,
    },
    {
      Header: "Company",
      accessor: "vendor.companyReportName",
    },
    {
      Header: "Ticket Count",
      accessor: "tickets.items.length",
      disableFilters: true,
    },
    {
      Header: "Contract #",
      accessor: "contract.contractNumber",
    },
    {
      Header: "Invoice Number",
      accessor: "invoiceNumber",
    },
    {
      Header: "Amount Owed",
      accessor: "amountOwed",
      Cell: ({ value }) => <span>{formatMoney.format(value)}</span>,
      disableFilters: true,
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      Cell: ({ value }) => <span>{moment(value).format("MM/DD/YY")}</span>,
    },
  ]);
  console.log(invoices);

  return (
    <Layout>
      <div className="px-12 py-4">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>All Invoices</h3>
        </div>
        <div className="my-6">
          <Link href="/reports/invoices/generate">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Generate New Invoices
            </a>
          </Link>
        </div>
        <div className="px-12 py-3">
          <Table data={invoices} columns={columns} />
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

export default Invoices;
