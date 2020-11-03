import { useQuery, useQueryCache, useInfiniteQuery } from "react-query";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { API } from "aws-amplify";
import { paymentsSorted } from "../../src/graphql/customQueries";
import Layout from "../../components/layout";
import Table from "../../components/table";
import { formatMoney } from "../../utils";
import { ReactQueryDevtools } from "react-query-devtools";

const Payments = () => {
  const cache = useQueryCache();
  const [payments, setPayments] = useState([]);
  //const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  // const { data, fetchMore, canFetchMore, isLoading } = useInfiniteQuery(
  //   "payments",
  //   async (key, nextToken = cache.getQueryData("payments").nextToken) => {
  //     const {
  //       data: { paymentsSorted: myPayments },
  //     } = await API.graphql({
  //       query: paymentsSorted,
  //       variables: {
  //         limit: 3000,
  //         sortDirection: "ASC",
  //         type: "Payment",
  //         nextToken,
  //       },
  //     });
  //     return myPayments;
  //   },
  //   {
  //     enabled: false,
  //     getFetchMore: (lastGroup, allGroups) => lastGroup.nextToken,
  //     cacheTime: 1000 * 60 * 60,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  useEffect(() => {
    if (data) {
      setPayments(data.items);
    }
  }, [data]);

  // useEffect(() => {
  //   if (data && canFetchMore && !isLoading) {
  //     fetchMore();
  //   }
  //   if (data && !data.length) {
  //     setPayments(data.items);
  //   }
  //   if (data && data.length && !canFetchMore && !isLoading) {
  //     compileData();
  //   }
  // }, [data]);

  // const compileData = () => {
  //   if (isInitialLoad) {
  //     let array = [...payments];

  //     data &&
  //       data.map((group, i) => {
  //         group.items.map((item) => array.push(item));
  //       });
  //     setPayments(array);
  //     setIsInitialLoad(false);
  //   } else {
  //     let array = [];
  //     data &&
  //       data.map((group, i) => {
  //         group.items.map((item) => array.push(item));
  //       });
  //     setPayments(array);
  //   }
  // };

  const columns = useMemo(() => [
    {
      Header: "Edit",
      accessor: "id",
      disableFilters: true,
      Cell: ({ value }) => (
        <Link href="/payments/edit/[id]" as={`/payments/edit/${value}`}>
          <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline">
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
      Header: "Invoice",
      accessor: "invoiceId",
      Cell: ({ value }) =>
        value ? (
          <Link href="/reports/invoices/[id]" as={`/reports/invoices/${value}`}>
            <a>View</a>
          </Link>
        ) : (
          ""
        ),
    },
    {
      Header: "Settlement",
      accessor: "settlementId",
      Cell: ({ value }) =>
        value ? (
          <Link
            href="/reports/settlements/[id]"
            as={`/reports/settlements/${value}`}
          >
            <a>View</a>
          </Link>
        ) : (
          ""
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

export default Payments;
