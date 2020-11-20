import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { API } from "aws-amplify";
import Select from "react-select";
import moment from "moment";
import {
  listContracts,
  paymentsByContract,
  paymentsByContracts,
} from "../../src/graphql/customQueries";
import Layout from "../../components/layout";
import { formatMoney } from "../../utils";

const PaymentsByContract = () => {
  const [contracts, setContracts] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [contract, setContract] = useState(null);
  const [payments, setPayments] = useState([]);
  const [contractId, setContractId] = useState(null);

  const { data: contractsData } = useQuery(
    "contracts",
    async () => {
      const {
        data: { listContracts: myContracts },
      } = await API.graphql({
        query: listContracts,
        variables: {
          limit: 3000,
        },
      });
      return myContracts;
    },
    {
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const getPaymentsForContract = async () => {
    const {
      data: { paymentsByContract: myPayments },
    } = await API.graphql({
      query: paymentsByContract,
      variables: {
        contractId,
        limit: 3000,
      },
    });
    if (myPayments?.items?.length) {
      setPayments(myPayments.items);
    } else {
      setPayments([]);
    }
  };

  useEffect(() => {
    if (contractsData && contractsData.items) {
      let options = [];
      contractsData.items.map((contract) =>
        options.push({
          value: contract.id,
          label: `${contract.contractNumber} - ${contract.contractTo.companyReportName}`,
        })
      );
      setContractOptions(options);
      setContracts(contractsData.items);
    }
  }, [contractsData]);

  useEffect(() => {
    if (contractId) {
      getPaymentsForContract();
      const myContract = contracts.filter((c) => c.id === contractId);
      setContract(myContract[0]);
    }
  }, [contractId]);

  return (
    <Layout>
      <div>
        <div>
          <h3>Payments By Contract</h3>
        </div>
        <div>
          <Select
            options={contractOptions}
            onChange={({ value }) => setContractId(value)}
          />
        </div>
        <div>
          {contract ? (
            <>
              <span>Contract Price: </span>
              <span>
                {contract.contractPrice
                  ? formatMoney.format(contract.contractPrice)
                  : formatMoney.format(contract.salePrice)}
              </span>
            </>
          ) : null}
        </div>
        <div>
          {payments.length ? (
            <table>
              <thead>
                <tr>
                  <th>Check Number</th>
                  <th>Date</th>
                  <th>Amount Paid</th>
                  <th>Tons Credit</th>
                  <th>Total Tons from Tickets</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr>
                    <td>{payment.checkNumber}</td>
                    <td>{moment(payment.date).format("MM/DD/YYYY")}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.tonsCredit}</td>
                    <td>
                      {payment.tickets?.items
                        ?.reduce((acc, cv) => acc + cv.netTons, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentsByContract;
