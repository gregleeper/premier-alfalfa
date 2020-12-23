import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryCache } from "react-query";
import { useRouter } from "next/router";
import { formatMoney } from "../../../utils";
import Table from "../../../components/table";
import Link from "next/link";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import {
  getContractAndTickets,
  paymentsByContract,
} from "../../../src/graphql/customQueries";
import Layout from "../../../components/layout";

const ContractInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tickets, setTickets] = useState([]);
  const [contractInfo, setContractInfo] = useState();
  const [tonsCredit, setTonsCredit] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  const { data: info, refetch } = useQuery(
    ["contractInfo", id],
    async () => {
      const { data } = await API.graphql({
        query: getContractAndTickets,
        variables: {
          id,
          limit: 3000,
          sortDirection: "DESC",
        },
      });
      return data;
    },
    {
      enable: false,
      cacheTime: 1000 * 60 * 20,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const { data: paymentsData, refetch: fetchPayments } = useQuery(
    ["contractPayments", id],
    async () => {
      const {
        data: { paymentsByContract: myPayments },
      } = await API.graphql({
        query: paymentsByContract,
        variables: {
          contractId: id,
          limit: 3000,
          sortDirection: "DESC",
        },
      });
      return myPayments;
    },
    {
      enabled: false,
      cacheTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const getPaidTicketsTotalNetTons = () => {
    const paidTickets = tickets.filter((ticket) => ticket.paymentId);
    setTonsCredit(paidTickets.reduce((acc, cv) => acc + cv.netTons, 0));
  };

  useEffect(() => {
    if (tickets.length) {
      getPaidTicketsTotalNetTons();
    }
  }, [tickets]);

  useEffect(() => {
    if (paymentsData?.items?.length) {
      setTotalPaid(paymentsData.items.reduce((acc, cv) => acc + cv.amount, 0));
    }
  }, [paymentsData]);

  useEffect(() => {
    if (info) {
      setTickets(info.ticketsByContract.items);
      setContractInfo(info.getContract);
    }
  }, [info]);

  useEffect(() => {
    if (id) {
      refetch();
      fetchPayments();
    }
  }, [id]);

  const columns = useMemo(
    () => [
      {
        Header: "Edit",
        accessor: "id",
        disableFilters: true,
        Cell: ({ value }) => (
          <Link href="/tickets/edit/[id]" as={`/tickets/edit/${value}`}>
            <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline px-2">
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
            <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline ">
              {value}
            </a>
          </Link>
        ),
      },
      {
        Header: "Field",
        accessor: "fieldNum",
      },
      {
        Header: "Company Name",
        accessor: "contract.contractTo.companyReportName",
      },
      {
        Header: "Ticket Date",
        accessor: "ticketDate",
        Cell: ({ value }) => (
          <span>{moment(value).format("MMM Do, YYYY")}</span>
        ),
      },
      {
        Header: "Corresponding Contract",
        accessor: "corresondingContract.contractNumber",
        Cell: ({ row, value }) => (
          <Link
            href="/contracts/view/[id]"
            as={`/contracts/view/${row.original.correspondingContractId}`}
          >
            <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline ">
              {value}
            </a>
          </Link>
        ),
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
        disableFilters: true,
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
      {contractInfo ? (
        <div className="py-12">
          <div className="text-2xl text-center text-gray-900 font-light pb-4">
            <h3>Contract {contractInfo.contractNumber}</h3>
          </div>
          <div className="flex justify-between">
            <div className="w-1/4 mx-auto">
              <h6 className="text-gray-900 font-light text-xl text-center">
                Contract Info
              </h6>
              <div className="">
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Contract Number:</span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Begin Date: </span>
                  <span className="text-lg text-gray-900">
                    {moment(contractInfo.beginDate).format("MM/DD/YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">End Date: </span>
                  <span className="text-lg text-gray-900">
                    {moment(contractInfo.endDate).format("MM/DD/YYYY")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Commodity: </span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.commodity.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Quantity: </span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Contract Price: </span>
                  <span className="text-lg text-gray-900">
                    {formatMoney.format(contractInfo.contractPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Sale Price: </span>
                  <span className="text-lg text-gray-900">
                    {formatMoney.format(contractInfo.salePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Contract Type: </span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Contract State: </span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractState}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Last Updated: </span>
                  <span className="text-lg text-gray-900">
                    {moment(contractInfo.updatedAt).format("MM/DD/YYYY")}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-1/4 mx-auto">
              <h6 className="text-gray-900 font-light text-xl text-center">
                Vendor Info
              </h6>
              <div className="">
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Company Name:</span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractTo.companyReportName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">Vendor Number: </span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractTo.vendorNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">City</span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractTo.city
                      ? contractInfo.contractTo.city
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">State</span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractTo.state
                      ? contractInfo.contractTo.state
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 mr-2">City</span>
                  <span className="text-lg text-gray-900">
                    {contractInfo.contractTo.zipCode
                      ? contractInfo.contractTo.zipCode
                      : ""}
                  </span>
                </div>
                <div className="mt-6">
                  <div>
                    <h6 className="text-gray-900 font-light text-xl text-center">
                      Running Totals{" "}
                    </h6>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">Number of Loads:</span>
                    <span className="text-lg text-gray-900">
                      {tickets.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">
                      Total Tons Hauled:
                    </span>
                    <span className="text-lg text-gray-900">
                      {tickets.length &&
                        tickets
                          .reduce((acc, cv) => acc + cv.netTons, 0)
                          .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">Qty Remaining:</span>
                    <span
                      className={`text-lg ${
                        tickets.length &&
                        contractInfo.quantity -
                          tickets.reduce((acc, cv) => acc + cv.netTons, 0) >=
                          0
                          ? "text-gray-900"
                          : "text-red-600"
                      } `}
                    >
                      {(
                        contractInfo.quantity -
                        tickets.reduce((acc, cv) => acc + cv.netTons, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">Avg Load Size:</span>
                    <span className="text-lg text-gray-900">
                      {tickets.length &&
                        (
                          tickets.reduce((acc, cv) => acc + cv.netTons, 0) /
                          tickets.length
                        ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">
                      Tons Credit Used:
                    </span>
                    <span className="text-lg text-gray-900">
                      {tonsCredit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">Total Paid:</span>
                    <span className="text-lg text-gray-900">
                      {formatMoney.format(totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 mr-2">
                      Tons Credit Paid:
                    </span>
                    <span className="text-lg text-gray-900">
                      {contractInfo.contractPrice
                        ? (
                            totalPaid / contractInfo.contractPrice
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : (totalPaid / contractInfo.salePrice).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6">
            <div>
              <Table columns={columns} data={tickets} />
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
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

export default ContractInfo;
