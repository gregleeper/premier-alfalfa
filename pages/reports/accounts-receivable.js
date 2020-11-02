import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import moment from "moment";
import { API } from "aws-amplify";
import ReactToPrint from "react-to-print";
import Layout from "../../components/layout";
import { formatMoney, groupBy } from "../../utils";
import { contractsByType } from "../../src/graphql/queries.ts";
import { invoicesSorted } from "../../src/graphql/customQueries";

const AccountsReceivable = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeSaleContracts, setActiveSaleContracts] = useState([]);
  const [totals, setTotals] = useState([]);
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
        },
        limit: 3000,
      },
    });
    return myContracts;
  });

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

  const getZeroToSevenDaysOld = (invoices) => {
    return invoices.filter(
      (inv) => moment().diff(moment(inv.dueDate), "days") < 8
    );
  };

  const getEightToFourteenDaysOld = (invoices) => {
    return invoices.filter(
      (inv) =>
        moment().diff(moment(inv.dueDate), "days") >= 8 &&
        moment().diff(moment(inv.dueDate), "days") < 15
    );
  };

  const getFifteenToTwentyOneDaysOld = (invoices) => {
    return invoices.filter(
      (inv) =>
        moment().diff(moment(inv.dueDate), "days") >= 15 &&
        moment().diff(moment(inv.dueDate), "days") < 22
    );
  };

  const getTwentyTwoandOverDays = (invoices) => {
    return invoices.filter(
      (inv) => moment().diff(moment(inv.dueDate), "days") >= 22
    );
  };

  return (
    <Layout>
      <div className="px-12">
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
        </div>
        <div ref={(el) => (toPrint = el)}>
          <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
            <h3>Accounts Receivable Report</h3>
            <span>{moment().format("MM/DD/YY")}</span>
          </div>
          <div className="">
            {totals.length > 0 ? (
              totals.map((item) => (
                <div className="mt-6">
                  <table>
                    <thead>
                      <tr className=" ">
                        <th className="w-48">Company</th>
                        <th className="px-4 text-sm">Contract</th>
                        <th className="px-4 text-sm">Balance Due</th>
                        <th className="px-4 text-sm">0-7</th>
                        <th className="px-4 text-sm">8-14</th>
                        <th className="px-4 text-sm">15-21</th>
                        <th className="px-4 text-sm">22-Over</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="">
                        <td className="pl-4 pr-2">
                          {item[0].vendor.companyReportName}
                        </td>
                        <td className="px-2">
                          {item[0].tickets.items[0].contract.contractNumber}
                        </td>
                        <td className="px-2 text-center">
                          {formatMoney.format(
                            item.reduce(function (accumulator, currentValue) {
                              return accumulator + currentValue.amountOwed;
                            }, 0)
                          )}
                        </td>
                        <td className="px-2 text-center">
                          {formatMoney.format(
                            getZeroToSevenDaysOld(item).reduce(function (
                              accumulator,
                              currentValue
                            ) {
                              return accumulator + currentValue.amountOwed;
                            },
                            0)
                          )}
                        </td>
                        <td className="px-2 text-center">
                          {formatMoney.format(
                            getEightToFourteenDaysOld(item).reduce(function (
                              accumulator,
                              currentValue
                            ) {
                              return accumulator + currentValue.amountOwed;
                            },
                            0)
                          )}
                        </td>
                        <td className="px-2 text-center">
                          {formatMoney.format(
                            getFifteenToTwentyOneDaysOld(item).reduce(function (
                              accumulator,
                              currentValue
                            ) {
                              return accumulator + currentValue.amountOwed;
                            },
                            0)
                          )}
                        </td>
                        <td className="px-2 text-center">
                          {formatMoney.format(
                            getTwentyTwoandOverDays(item).reduce(function (
                              accumulator,
                              currentValue
                            ) {
                              return accumulator + currentValue.amountOwed;
                            },
                            0)
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

export default AccountsReceivable;
