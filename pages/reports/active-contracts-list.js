import Layout from "../../components/layout";
import { contractsByType } from "../../src/graphql/customQueries";
import { API } from "aws-amplify";
import { useQuery } from "react-query";
import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";

function ActiveContracts() {
  let toPrint = useRef(null);
  const [saleContracts, setSaleContracts] = useState([]);
  const [purchaseContracts, setPurchaseContracts] = useState([]);

  const { data: activeSaleContractsData } = useQuery(
    "activeSaleContracts",
    async () => {
      const {
        data: {
          contractsByType: { items: myContracts },
        },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          contractType: "SALE",
          filter: {
            contractState: { eq: "ACTIVE" },
          },
          sortDirection: "ASC",
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

  const { data: activePurchaseContractsData } = useQuery(
    "activePurchaseContracts",
    async () => {
      const {
        data: {
          contractsByType: { items: myContracts },
        },
      } = await API.graphql({
        query: contractsByType,
        variables: {
          contractType: "PURCHASE",
          filter: {
            contractState: { eq: "ACTIVE" },
          },
          sortDirection: "ASC",
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
    if (activeSaleContractsData) {
      setSaleContracts(activeSaleContractsData);
    }
    if (activePurchaseContractsData) {
      setPurchaseContracts(activePurchaseContractsData);
    }
  }, [activePurchaseContractsData, activeSaleContractsData]);

  return (
    <Layout>
      <div className="my-8">
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
        <div>
          <h3 className="text-2xl text-gray-900 font-thin text-center">
            Active Contracts
          </h3>
        </div>
        {purchaseContracts.length && saleContracts.length ? (
          <div ref={(el) => (toPrint = el)} className="flex justify-around">
            <div>
              <h6 className="text-lg font-light text-center">
                Purcase Contracts
              </h6>
              <table>
                <thead>
                  <tr>
                    <th>Contract Number</th>
                    <th>Company</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseContracts.map((contract) => (
                    <tr className="border-2 border-gray-500">
                      <td className="py-1 px-2 text-sm">
                        {contract.contractNumber}
                      </td>
                      <td className="py-1 px-2 text-sm">
                        {contract.contractTo.companyReportName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div>
                <h6 className="text-lg font-light text-center">
                  Sale Contracts
                </h6>
                <table>
                  <thead>
                    <tr>
                      <th>Contract Number</th>
                      <th>Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleContracts.map((contract) => (
                      <tr className="border-2 border-gray-500">
                        <td className="py-1 px-2 text-sm">
                          {contract.contractNumber}
                        </td>
                        <td className="py-1 px-2 text-sm">
                          {contract.contractTo.companyReportName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

export default ActiveContracts;
