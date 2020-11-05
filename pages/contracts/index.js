import Layout from "../../components/layout";
import { useMemo, useEffect, useState } from "react";
import { API, withSSRContext } from "aws-amplify";
import { listContracts } from "../../src/graphql/queries.ts";
import Link from "next/link";
import Table from "../../components/table";
import moment from "moment";
import { formatMoney } from "../../utils";
import { useQuery, QueryCache } from "react-query";

const Contracts = () => {
  const [contracts, setContracts] = useState([]);

  const { data } = useQuery("contracts", async () => {
    const {
      data: { listContracts: contractsData },
    } = await API.graphql({
      query: listContracts,
      variables: {
        limit: 3000,
      },
    });
    return contractsData;
  });

  useEffect(() => {
    if (data) {
      setContracts(data.items);
    }
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Edit",
        accessor: "id",
        Cell: ({ value }) => (
          <>
            <Link href="/contracts/edit/[id]" as={`/contracts/edit/${value}`}>
              <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline mr-2">
                Edit
              </a>
            </Link>
            <Link href="/contracts/view/[id]" as={`/contracts/view/${value}`}>
              <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline">
                View
              </a>
            </Link>
          </>
        ),
        disableFilters: true,
      },
      {
        Header: "Contract #",
        accessor: "contractNumber",
      },
      {
        Header: "Contract Type",
        accessor: "contractType",
      },
      {
        Header: "Vendor",
        accessor: "contractTo.companyListingName",
      },
      {
        Header: "Commodity",
        accessor: "commodity.name",
      },
      {
        Header: "Begin Date",
        accessor: "beginDate",
        Cell: ({ value }) => (
          <span>{moment(value).format("MMM Do, YYYY")}</span>
        ),
      },
      {
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ value }) => (
          <span>{moment(value).format("MMM Do, YYYY")}</span>
        ),
      },
      {
        Header: "Status",
        accessor: "contractState",
      },
      {
        Header: "Quantity in Tons",
        accessor: "quantity",
        disableFilters: true,
      },
      {
        Header: "Contract Price",
        accessor: "contractPrice",
        Cell: ({ value }) => <span>{formatMoney.format(value)}</span>,
        disableFilters: true,
      },
      {
        Header: "Sale Price",
        accessor: "salePrice",
        Cell: ({ value }) => <span>{formatMoney.format(value)}</span>,
        disableFilters: true,
      },
      {
        Header: "Contract Purchase Value",
        accessor: "",
        Cell: (row) => (
          <span>
            {formatMoney.format(
              row.row.values.quantity * row.row.values.contractPrice
            )}
          </span>
        ),
        disableFilters: true,
      },
      {
        Header: "Contract Sale Value",
        accessor: "",
        Cell: (row) => (
          <span>
            {formatMoney.format(
              row.row.values.quantity * row.row.values.salePrice
            )}
          </span>
        ),
        disableFilters: true,
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="px-6">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Contracts</h3>
        </div>
        <div className="my-6">
          <Link href="/contracts/create">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Create New
            </a>
          </Link>
        </div>
        <div>
          <Table data={contracts} columns={columns} />
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

export default Contracts;
