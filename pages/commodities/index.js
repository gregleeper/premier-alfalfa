import Table from "../../components/table";
import Layout from "../../components/layout";
import { listCommoditys } from "../../src/graphql/queries.ts";
import { useState, useEffect, useMemo } from "react";
import { API, withSSRContext } from "aws-amplify";
import Link from "next/link";

const Commodities = () => {
  const [commodities, setCommodities] = useState([]);

  const getCommodities = async () => {
    const {
      data: {
        listCommoditys: { items: myCommodities },
      },
    } = await API.graphql({
      query: listCommoditys,
    });
    setCommodities(myCommodities);
  };

  useEffect(() => {
    getCommodities();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Commodity Name",
        accessor: "name",
      },
      {
        Header: "Edit",
        accessor: "id",
        Cell: ({ value }) => (
          <Link href="/commodities/edit/[id]" as={`/commodities/edit/${value}`}>
            <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline">
              {" "}
              View
            </a>
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="px-6">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Commodities</h3>
        </div>
        <div className="my-6">
          <Link href="/commodities/create">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Create New
            </a>
          </Link>
        </div>
        <div className="">
          <Table columns={columns} data={commodities} />
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

export default Commodities;
