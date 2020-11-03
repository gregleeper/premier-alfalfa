import Layout from "../../../components/layout";
import Table from "../../../components/table";
import { settlementsSorted } from "../../../src/graphql/customQueries";
import { formatMoney } from "../../../utils";
import moment from "moment";
import { API } from "aws-amplify";
import Link from "next/link";
import { useQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { useState, useEffect, useMemo } from "react";

const Settlements = () => {
  const cache = useQueryCache();
  const [settlements, setSettlements] = useState([]);

  const { data: settlementsData } = useQuery(
    "settlements",
    async () => {
      const {
        data: { settlementsSorted: settlements },
      } = await API.graphql({
        query: settlementsSorted,
        variables: {
          type: "Settlement",
          sortDirection: "DESC",
          limit: 3000,
        },
      });
      return settlements;
    },
    {
      cacheTime: 1000 * 60 * 30,
    }
  );

  useEffect(() => {
    if (settlementsData) {
      setSettlements(settlementsData.items);
    }
  }, [settlementsData]);

  const columns = useMemo(() => [
    {
      Header: "Settlement Id",
      accessor: "id",
      Cell: ({ value }) => (
        <Link
          href="/reports/settlements/[id]"
          as={`/reports/settlements/${value}`}
        >
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
      Header: "Settlement Number",
      accessor: "settlementNumber",
    },
    {
      Header: "Amount Owed",
      accessor: "amountOwed",
      Cell: ({ value }) => <span>{formatMoney.format(value)}</span>,
      disableFilters: true,
    },
    {
      Header: "Is Paid",
      accessor: "isPaid",
      Cell: ({ value }) => <span>{value ? "Yes" : "No"}</span>,
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      Cell: ({ value }) => <span>{moment(value).format("MM/DD/YY")}</span>,
    },
  ]);

  return (
    <Layout>
      <div className="px-12 py-4">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>All Settlements</h3>
        </div>
        <div className="my-6">
          <Link href="/reports/settlements/generate">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Generate New Settlements
            </a>
          </Link>
        </div>
        <div className="px-12 py-3">
          <Table data={settlements} columns={columns} />
        </div>
      </div>
      <ReactQueryDevtools />
    </Layout>
  );
};

export default Settlements;
