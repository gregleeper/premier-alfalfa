import Layout from "../../components/layout";
import { useMemo, useEffect, useState } from "react";
import { API, withSSRContext } from "aws-amplify";
import { listVendors } from "../../src/graphql/queries.ts";
import Link from "next/link";
import Table from "../../components/table";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
const Vendors = () => {
  const [vendorsState, setVendorsState] = useState([]);

  const { data } = useQuery(
    "vendors",
    async () => {
      const {
        data: { listVendors: vendorData },
      } = await API.graphql({
        query: listVendors,
        variables: {
          limit: 1000,
        },
      });
      return vendorData;
    },
    {
      cacheTime: 1000 * 60 * 60,
    }
  );

  useEffect(() => {
    if (data) {
      setVendorsState(data.items);
    }
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Edit",
        accessor: "id",
        Cell: ({ value }) => (
          <Link href="/vendors/edit/[id]" as={`/vendors/edit/${value}`}>
            <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline">
              {" "}
              View
            </a>
          </Link>
        ),
        disableFilters: true,
      },
      {
        Header: "Vendor #",
        accessor: "vendorNumber",
      },
      {
        Header: "Company Report Name",
        accessor: "companyReportName",
        disableFilters: true,
      },
      {
        Header: "Company Listing Name",
        accessor: "companyListingName",
        disableFilters: true,
      },
      {
        Header: "Address 1",
        accessor: "address1",
        disableFilters: true,
      },
      {
        Header: "Address 2",
        accessor: "address2",
        disableFilters: true,
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Zip",
        accessor: "zipCode",
        disableFilters: true,
      },
      {
        Header: "Phone",
        accessor: "telephoneNum",
        disableFilters: true,
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="px-6">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Vendors</h3>
        </div>
        <div className="my-6">
          <Link href="/vendors/create">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Create New
            </a>
          </Link>
        </div>
        <div>
          <Table data={vendorsState} columns={columns} />
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

export default Vendors;
