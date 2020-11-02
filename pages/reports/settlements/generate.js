import Layout from "../../../components/layout";
//import { getInvoice, ticketsByContract } from "../../../src/graphql/queries.ts";
import { contractsByType } from "../../../src/graphql/customQueries";
import {
  createSettlement,
  updateTicket,
} from "../../../src/graphql/mutations.ts";
import { useQuery, useQueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { formatMoney } from "../../../utils";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { getContract, getTicket } from "../../../src/graphql/queries";

const GenerateSettlements = () => {
  const queryCache = useQueryCache();
  const [activePurchaseContracts, setActivePurchaseContracts] = useState([]);
  const [beginDate, setBeginDate] = useState(moment().startOf("isoWeek")._d);
  const [endDate, setEndDate] = useState(moment().endOf("isoWeek")._d);
  const [contractsWithTickets, setContractsWithTickets] = useState([]);
  const [numberOfSettlementsCreated, setNumberOfSettlementsCreated] = useState(
    0
  );

  const { data: purchaseContractsData, refetch } = useQuery(
    "activePurchaseContracts",
    async () => {
      const {
        data: { contractsByType: myContracts },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          contractType: "PURCHASE",
          filter: {
            contractState: { eq: "ACTIVE" },
            contractPrice: { gt: 0 },
          },
          ticketFilter: {
            ticketDate: {
              between: [beginDate, endDate],
            },
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
    if (purchaseContractsData) {
      setActivePurchaseContracts(purchaseContractsData.items);
    }
  }, [purchaseContractsData]);

  useEffect(() => {
    if (activePurchaseContracts.length) {
      compileData();
    }
  }, [activePurchaseContracts]);

  // useEffect(() => {
  //   if (contractsWithTickets.length > 0) {
  //     createInvoices();
  //   }
  // }, [contractsWithTickets]);

  const compileData = () => {
    let array = [];
    activePurchaseContracts.map((contract) => {
      if (contract.tickets.items.length > 0 && contract.contractPrice > 0) {
        array.push(contract);
      }
    });
    setContractsWithTickets(array);
  };

  const createSettlements = async () => {
    contractsWithTickets.map(async (contract, index) => {
      if (!contract.tickets.items[0].settlementId) {
        let sumNetTons = 0;
        let total = 0;

        contract.tickets.items.map((ticket) => {
          sumNetTons = sumNetTons + ticket.netTons;
        });
        total = sumNetTons * contract.contractPrice;

        const {
          data: { createSettlement: settlement },
        } = await API.graphql({
          query: createSettlement,
          variables: {
            input: {
              vendorId: contract.vendorId,
              settlementNumber:
                "s" +
                moment(endDate).add(1, "week").add(1, "day").format("MMDDYY") +
                index,
              amountOwed: total,
              dueDate: moment(endDate).add(1, "week").add(1, "day"),
              isPaid: false,
              contractId: contract.id,
              type: "Settlement",
              beginDate,
              endDate,
            },
          },
        });

        contract.tickets.items.map(async (ticket) => {
          await API.graphql({
            query: updateTicket,
            variables: {
              input: {
                id: ticket.id,
                settlementId: settlement.id,
              },
            },
          });
        });
        setNumberOfSettlementsCreated(numberOfSettlementsCreated + 1);
      }
      if (contract.tickets.items[0].settlementId) {
        console.log("no settlement created");
      }
    });
  };

  const handleFetchQueries = () => {
    refetch();
  };

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Generate Settlements</h3>
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
                    {activePurchaseContracts.length}
                  </p>
                  <p>
                    Contracts with tickets and sale price:{" "}
                    {contractsWithTickets.length}
                  </p>
                  <ul className="mt-2" className="">
                    {contractsWithTickets.map((contract) => (
                      <li key={contract.id}>
                        {contract.tickets.items[0].settlementId ? (
                          <span className="text-red-600 mr-2">
                            Invoice Already Created!
                          </span>
                        ) : null}
                        <span className="mr-2">{contract.contractNumber}</span>
                        <span className="mr-2">
                          {contract.contractTo.companyReportName}
                        </span>
                        <span className="float-right">
                          Tickets: {contract.tickets.items.length}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <span>Choose dates to generate settlements</span>
                </div>
              )}
            </div>
            <div>
              <span>Generate Settlements? </span>
              <button
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
                onClick={() => createSettlements()}
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

export default GenerateSettlements;
