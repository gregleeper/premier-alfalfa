import Layout from "../../components/layout";
import { useMemo, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listTickets } from "../../src/graphql/queries.ts";
import Link from "next/link";
import Table from "../../components/table";
import moment from "moment";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getAllTickets();
  }, []);

  const getAllTickets = async () => {
    const myTickets = await API.graphql({
      query: listTickets,
      variables: {
        limit: 3000,
      },
    });
    setTickets(myTickets.data.listTickets.items);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Ticket #",
        accessor: "ticketNumber",
      },
      {
        Header: "Contract #",
        accessor: "contract.contractNumber",
      },
      {
        Header: "Ticket Date",
        accessor: "ticketDate",
        Cell: ({ value }) => (
          <span>{moment(value).format("MMM Do, YYYY")}</span>
        ),
      },
      {
        Header: "Field #",
        accessor: "fieldNum",
      },
      {
        Header: "Bale Count",
        accessor: "baleCount",
      },
      {
        Header: "Lading #",
        accessor: "ladingNumber",
      },
      {
        Header: "Driver",
        accessor: "driver",
      },
      {
        Header: "Truck #",
        accessor: "tuckNumber",
      },
      {
        Header: "Gross Weight",
        accessor: "grossWeight",
      },
      {
        Header: "Tare Weight",
        accessor: "tareWeight",
      },
      {
        Header: "Net Weight",
        accessor: "netWeight",
      },
      {
        Header: "Net Tons",
        accessor: "netTons",
      },
      {
        Header: "Edit",
        accessor: "id",
        Cell: ({ value }) => (
          <Link href="/contracts/edit/[id]" as={`/contracts/edit/${value}`}>
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
          <h3>Tickets</h3>
        </div>
        <div className="my-6">
          <Link href="/tickets/create">
            <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
              Create New
            </a>
          </Link>
        </div>
        <div>
          <Table data={tickets} columns={columns} />
        </div>
      </div>
    </Layout>
  );
};

export default Tickets;
