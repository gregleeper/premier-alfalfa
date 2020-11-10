import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryCache } from "react-query";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
import ReactToPrint from "react-to-print";
import Layout from "../../components/layout";
import { formatMoney, groupBy } from "../../utils";
import { contractsByType } from "../../src/graphql/queries.ts";
import {
  invoicesSorted,
  ticketsByContract,
} from "../../src/graphql/customQueries";

const AccountsReceivable = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeSaleContracts, setActiveSaleContracts] = useState([]);
  const [activeContractIds, setActiveContractIds] = useState([]);
  const [contractsTotals, setContractsTotals] = useState([]);
  const [totals, setTotals] = useState([]);
  const [vendorTotals, setVendorTotals] = useState([]);
  let toPrint = useRef(null);

  const { data: invoiceData } = useQuery("invoices", async () => {
    const {
      data: { invoicesSorted: myInvoices },
    } = await API.graphql({
      query: invoicesSorted,
      variables: {
        type: "Invoice",
        filter: {
          isPaid: { eq: false },
        },
        limit: 3000,
      },
    });
    return myInvoices;
  });

  const { data: contractData } = useQuery("activeSaleContracts", async () => {
    const {
      data: { contractsByType: myContracts },
    } = await API.graphql({
      query: contractsByType,
      variables: {
        contractType: "SALE",
        filter: {
          contractState: {
            eq: "ACTIVE",
          },
          salePrice: {
            gt: 0,
          },
        },
        limit: 3000,
      },
    });
    return myContracts;
  });

  const getTicketsByContract = async () => {
    let array = [...contractsTotals];
    activeSaleContracts.map(async (contract) => {
      const {
        data: {
          ticketsByContract: { items: myTickets },
        },
      } = await API.graphql({
        query: ticketsByContract,
        variables: {
          contractId: contract.id,
          type: "Ticket",
          sortDirection: "DESC",
          limit: 2000,
          filter: {
            paymentId: { attributeExists: false },
          },
        },
      });

      let contractTotals = {};

      contractTotals.contractNumber = contract.contractNumber;
      contractTotals.contractId = contract.id;
      contractTotals.company = contract.contractTo.companyReportName;
      contractTotals.salePrice = contract.salePrice;

      contractTotals.tickets = myTickets;
      array.push(contractTotals);
      setContractsTotals(array);
    });
    computeTotalsFromTickets();
  };

  const handleFetchTickets = () => {
    setContractsTotals([]);
    getTicketsByContract();
  };

  useEffect(() => {
    if (invoiceData) {
      setInvoices(invoiceData.items);
    }
  }, [invoiceData]);

  useEffect(() => {
    if (contractData) {
      setActiveSaleContracts(contractData.items);
    }
  }, [contractData]);

  useEffect(() => {
    if (invoices.length > 0 && activeSaleContracts.length > 0) {
      computeTotals();
    }
  }, [activeSaleContracts, invoices]);

  // useEffect(() => {
  //   if (contractsTotals.length) {
  //     computeTotalsFromTickets();
  //   }
  // }, [contractsTotals]);

  const computeTotalsFromTickets = () => {
    const byVendor = groupBy(contractsTotals, (contract) => contract.company);
    let vendors = [];
    contractsTotals.map((contract) => vendors.push(contract.company));
    let uniqureVendors = [...new Set(vendors)];
    let array = [];
    uniqureVendors.map((v) => {
      const myContracts = byVendor.get(v);
      let obj = {};
      obj.company = v;
      obj.contracts = myContracts;
      array.push(obj);
    });

    setVendorTotals(array);
  };

  const computeTotals = () => {
    const byVendor = groupBy(invoices, (invoice) => invoice.vendorId);
    const byContract = groupBy(
      invoices,
      (invoice) => invoice.tickets.items[0].contract.contractNumber
    );
    let array = [];
    activeSaleContracts.map((contract) => {
      array.push(byContract.get(contract.contractNumber));
    });
    let finalArray = [];
    array.map((item, index) => {
      if (item) {
        finalArray.push(item);
      }
    });
    setTotals(finalArray);
  };

  const getZeroToSevenDaysOld = (tickets) => {
    return tickets.filter(
      (ticket) => moment().diff(moment(ticket.ticketDate), "days") < 8
    );
  };

  const getEightToFourteenDaysOld = (tickets) => {
    return tickets.filter(
      (ticket) =>
        moment().diff(moment(ticket.ticketDate), "days") >= 8 &&
        moment().diff(moment(ticket.ticketDate), "days") < 15
    );
  };

  const getFifteenToTwentyOneDaysOld = (tickets) => {
    return tickets.filter(
      (ticket) =>
        moment().diff(moment(ticket.ticketDate), "days") >= 15 &&
        moment().diff(moment(ticket.ticketDate), "days") < 22
    );
  };

  const getTwentyTwoandOverDays = (tickets) => {
    return tickets.filter(
      (ticket) => moment().diff(moment(ticket.ticketDate), "days") >= 22
    );
  };

  return (
    <Layout>
      <div className="mx-16">
        <div className="px-12 py-4">
          <ReactToPrint
            trigger={() => (
              <a
                href="#"
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
              >
                Print Report
              </a>
            )}
            content={() => toPrint}
          />
          <div className="mt-4">
            <button
              className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
              onClick={() => handleFetchTickets()}
            >
              Get Data
            </button>
          </div>
        </div>
        <div ref={(el) => (toPrint = el)}>
          <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
            <h3>Accounts Receivable Report</h3>
            <span>{moment().format("MM/DD/YY")}</span>
          </div>

          <div className="mx-12">
            {vendorTotals.length > 0 ? (
              vendorTotals.map((item, index) => (
                <div className="mt-6" key={index}>
                  <table className="px-4 text-sm ">
                    <thead>
                      <tr className="">
                        <th className="px-2 w-48 ">{item.company}</th>
                        <th className="px-12 ">Contract</th>
                        <th className="px-12">Balance Due</th>
                        <th className="px-12">0-7</th>
                        <th className="px-12">8-14</th>
                        <th className="px-12">15-21</th>
                        <th className="px-12">22-Over</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className=""></tr>
                      {item.contracts.map((contract) => (
                        <>
                          <tr>
                            <td className="pl-4 pr-2 "></td>
                            <td className="text-center">
                              {contract.contractNumber}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                contract.tickets.reduce(
                                  (acc, cv) => acc + cv.netTons,
                                  0
                                ) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getZeroToSevenDaysOld(contract.tickets).reduce(
                                  (acc, cv) => acc + cv.netTons,
                                  0
                                ) * contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getEightToFourteenDaysOld(
                                  contract.tickets
                                ).reduce((acc, cv) => acc + cv.netTons, 0) *
                                  contract.salePrice
                              )}
                            </td>
                            <td className="text-center">
                              {formatMoney.format(
                                getFifteenToTwentyOneDaysOld(
                                  contract.tickets
                                ).reduce((acc, cv) => acc + cv.netTons, 0) *
                                  contract.salePrice
                              )}
                            </td>

                            <td className="text-center">
                              {formatMoney.format(
                                getTwentyTwoandOverDays(
                                  contract.tickets
                                ).reduce((acc, cv) => acc + cv.netTons, 0) *
                                  contract.salePrice
                              )}
                            </td>
                          </tr>
                        </>
                      ))}
                      <tr>
                        <td className="pl-2">Totals:</td>
                        <td></td>
                        <td className="text-center">
                          {formatMoney.format(
                            item.contracts.reduce(
                              (acc, cv) =>
                                acc +
                                cv.tickets.reduce((a, c) => a + c.netTons, 0) *
                                  cv.salePrice,
                              0
                            )
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div>Loading</div>
            )}
          </div>
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

export default AccountsReceivable;
