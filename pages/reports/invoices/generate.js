import Layout from "../../../components/layout";
import { getInvoice, ticketsByContract } from "../../../src/graphql/queries.ts";
import { contractsByType } from "../../../src/graphql/customQueries";
import { useRouter } from "next/router";
import {
  createInvoice,
  updateTicket,
  updateInvoice,
  deleteInvoice,
} from "../../../src/graphql/mutations.ts";
import { useQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { API, withSSRContext } from "aws-amplify";
import { getContract, getTicket } from "../../../src/graphql/queries";

const GenerateInvoices = () => {
  const queryCache = useQueryCache();
  const router = useRouter();
  const [activeSaleContracts, setActiveSaleContracts] = useState([]);
  const [beginDate, setBeginDate] = useState(moment().startOf("isoWeek")._d);
  const [endDate, setEndDate] = useState(moment().endOf("isoWeek")._d);
  const [contractsWithTickets, setContractsWithTickets] = useState([]);

  const [numberInvoicesCreated, setNumberInvoicesCreated] = useState(0);

  const { data: saleContractsData, refetch } = useQuery(
    "activeSaleContracts",
    async () => {
      const {
        data: { contractsByType: myContracts },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          contractType: "SALE",
          filter: {
            contractState: { eq: "ACTIVE" },
            salePrice: { gt: 0 },
          },
          ticketFilter: {
            ticketDate: {
              le: moment(endDate).endOf("date"),
            },
          },
          paymentDate: {
            le: moment(endDate).endOf("date"),
          },

          limit: 3000,
        },
      });
      return myContracts;
    },
    {
      enabled: false,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (saleContractsData) {
      setActiveSaleContracts(saleContractsData.items);
    }
  }, [saleContractsData]);

  useEffect(() => {
    if (activeSaleContracts.length) {
      compileData();
    }
  }, [activeSaleContracts]);

  console.log(activeSaleContracts);

  const compileData = () => {
    let array = [];
    activeSaleContracts.map((contract) => {
      if (
        (contract.tickets.items.length > 0 || contract.payments.items.length) &&
        contract.salePrice > 0
      ) {
        array.push(contract);
      }
    });
    setContractsWithTickets(array);
  };

  const createInvoices = async () => {
    contractsWithTickets.map(async (contract, index) => {
      let beginningBalance = 0;
      let previousTickets = contract.tickets.items.filter((t) =>
        moment(t.ticketDate).isBefore(moment(beginDate).startOf("date"))
      );
      let previousPayments = contract.payments.items.filter((p) =>
        moment(p.date).isBefore(moment(beginDate).startOf("date"))
      );
      beginningBalance =
        previousTickets.reduce((acc, cv) => acc + cv.netTons, 0) *
          contract.salePrice -
        previousPayments.reduce((acc, cv) => acc + cv.amount, 0);

      let invoiceTickets = contract.tickets.items.filter((t) =>
        moment(t.ticketDate).isBetween(
          moment(beginDate).startOf("date"),
          moment(endDate).endOf("date")
        )
      );
      let invoicePayments = contract.payments.items.filter((p) =>
        moment(p.date).isBetween(
          moment(beginDate).startOf("date"),
          moment(endDate).endOf("date")
        )
      );
      let invoiceTotal =
        invoiceTickets.reduce((acc, cv) => acc + cv.netTons, 0) *
          contract.salePrice -
        invoicePayments.reduce((acc, cv) => acc + cv.amount, 0);
      invoiceTotal = beginningBalance + invoiceTotal;

      const {
        data: { createInvoice: invoice },
      } = await API.graphql({
        query: createInvoice,
        variables: {
          input: {
            vendorId: contract.vendorId,
            invoiceNumber:
              "i" +
              moment(endDate).add(1, "week").add(1, "day").format("MMDDYY") +
              index,
            amountOwed: invoiceTotal,
            dueDate: moment(endDate).add(1, "week").add(1, "day"),
            isPaid: false,
            contractId: contract.id,
            type: "Invoice",
            beginDate,
            endDate,
          },
        },
      });

      invoiceTickets.map(async (ticket) => {
        await API.graphql({
          query: updateTicket,
          variables: {
            input: {
              id: ticket.id,
              invoiceId: invoice.id,
            },
          },
        });
      });
      setNumberInvoicesCreated(numberInvoicesCreated + 1);
    });

    router.back();
  };

  const handleFetchQueries = () => {
    refetch();
  };

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Generate Invoices</h3>
        </div>
        <div>
          <div className="w-1/4 mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <span>Begin Date</span>
                <DatePicker
                  selected={beginDate}
                  onChange={(date) => setBeginDate(date)}
                  className="form-input w-full"
                  startDate={beginDate}
                  selectsStart
                />
              </div>
              <div>
                <span>End Date</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="form-input w-full"
                  endDate={endDate}
                  minDate={beginDate}
                  selectsStart
                />
              </div>
              <div>
                <button
                  className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                  onClick={() => handleFetchQueries()}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="py-12">
              {contractsWithTickets.length > 0 ? (
                <div>
                  <p>
                    Number of active sale contracts:{" "}
                    {activeSaleContracts.length}
                  </p>
                  <p>
                    Contracts with tickets and sale price:{" "}
                    {contractsWithTickets.length}
                  </p>
                  <ul className="mt-2" className="">
                    {contractsWithTickets.map((contract) => (
                      <li key={contract.id}>
                        {contract.tickets?.items[0]?.invoiceId ? (
                          <span className="text-red-600 mr-2">
                            Invoice Already Created!
                          </span>
                        ) : null}
                        <span className="mr-2">{contract.contractNumber}</span>
                        <span className="mr-2">
                          {contract.contractTo.companyReportName}
                        </span>
                        <span className="float-right">
                          Tickets:{" "}
                          {
                            contract.tickets.items.filter((t) =>
                              moment(t.ticketDate).isBetween(
                                moment(beginDate).startOf("date"),
                                moment(endDate).endOf("date")
                              )
                            ).length
                          }
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <span>Choose dates to generate invoices</span>
                </div>
              )}
            </div>
            <div>
              <span>Generate Invoices? </span>
              <button
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                onClick={() => createInvoices()}
              >
                Generate
              </button>
            </div>
          </div>
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

export default GenerateInvoices;
