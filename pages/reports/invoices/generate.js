import Layout from "../../../components/layout";
import {
  contractsByType,
  ticketsByContract,
} from "../../../src/graphql/queries.ts";
import {
  createInvoice,
  updateTicket,
  updateInvoice,
} from "../../../src/graphql/mutations.ts";
import { useQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";

const GenerateInvoices = () => {
  const queryCache = useQueryCache();
  const [activeSaleContracts, setActiveSaleContracts] = useState([]);
  const [beginDate, setBeginDate] = useState(moment().startOf("isoWeek")._d);
  const [endDate, setEndDate] = useState(moment().endOf("isoWeek")._d);
  const [numberInvoicesCreated, setNumberInvoicesCreated] = useState(0);

  const { data: saleContractsData } = useQuery(
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
          },
          limit: 3000,
        },
      });
      return myContracts;
    },
    {
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

  const handleFetchQueries = () => {
    activeSaleContracts.map(async (contract) => {
      if (contract.salePrice > 0) {
        const {
          data: { createInvoice: invoice },
        } = await API.graphql({
          query: createInvoice,
          variables: {
            input: {
              vendorId: contract.vendorId,
              amountOwed: 0,
              dueDate: moment(endDate).add(1, "week").add(1, "day"),
              isPaid: false,
            },
          },
        });

        const {
          data: {
            ticketsByContract: { items: myTickets },
          },
        } = await API.graphql({
          query: ticketsByContract,
          variables: {
            contractId: contract.id,

            ticketDate: {
              between: [
                moment(beginDate).startOf("day")._d,
                moment(endDate).endOf("day")._d,
              ],
            },
            limit: 3000,
          },
        });

        let sumNetTons = 0;
        let total = 0;

        myTickets.map((ticket) => {
          sumNetTons = sumNetTons + ticket.netTons;
        });
        total = sumNetTons * contract.salePrice;

        myTickets.map(async (ticket) => {
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
        console.log(total);
        await API.graphql({
          query: updateInvoice,
          variables: {
            input: {
              id: invoice.id,
              amountOwed: total,
            },
          },
        });
        setNumberInvoicesCreated(numberInvoicesCreated + 1);
      }
    });
  };

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Invoices</h3>
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
              <p className="text-base text-gray-600">
                Number of Invoices Created:{" "}
              </p>
              <span className="text-gray-900 font-bold text-2xl">
                {numberInvoicesCreated > 0
                  ? numberInvoicesCreated
                  : "Choose dates to generate invoices"}
              </span>
            </div>
          </div>
        </div>
        <ReactQueryDevtools />
      </div>
    </Layout>
  );
};

export default GenerateInvoices;
