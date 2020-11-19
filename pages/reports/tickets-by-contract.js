import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import {
  ticketsByContract,
  listContracts,
} from "../../src/graphql/customQueries";
import { useQuery, useQueryCache } from "react-query";
import moment from "moment";
import ReactSelect from "react-select";
import DatePicker from "react-datepicker";
import { API } from "aws-amplify";
import Layout from "../../components/layout";
import { formatMoney } from "../../utils";

const TicketsByContract = () => {
  let toPrint = useRef(null);
  const [contracts, setContracts] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [allContractTickets, setAllContractTickets] = useState([]);
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [fieldNum, setFieldNum] = useState("");
  const [correspondingContractId, setCorrespondingContractId] = useState(null);
  const [ticketDate, setTicketDate] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [filterByDateRange, setFilterByDateRange] = useState(false);
  const [filterByFieldNum, setFilterByFielNum] = useState(false);
  const [
    filterByCorrespondingContract,
    setFilterByCorrespondingContract,
  ] = useState(false);
  const [tickets, setTickets] = useState([]);

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
      cacheTime: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const getTicketsWithTicketDateAndFieldNum = async () => {
    const {
      data: { ticketsByContract: myTickets },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        limit: 3000,
        contractId,
        sortDirection: "DESC",
        ticketDate: {
          between: [
            moment(beginDate).startOf("day"),
            moment(endDate).endOf("day"),
          ],
        },
        filter: {
          fieldNum: { eq: fieldNum },
        },
      },
    });
    if (myTickets?.items?.length) {
      setTickets(myTickets.items);
      setAllContractTickets(myTickets.items);
    } else {
      setTickets([]);
    }
  };

  const getTicketsWithFieldNum = async () => {
    const {
      data: { ticketsByContract: myTickets },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        limit: 3000,
        contractId,
        sortDirection: "DESC",
        filter: {
          fieldNum: { eq: fieldNum },
        },
      },
    });
    if (myTickets?.items?.length) {
      setTickets(myTickets.items);
      setAllContractTickets(myTickets.items);
    } else {
      setTickets([]);
    }
  };

  const getTicketsWithDateRange = async () => {
    const {
      data: { ticketsByContract: myTickets },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        limit: 3000,
        contractId,
        ticketDate: {
          between: [
            moment(beginDate).startOf("day"),
            moment(endDate).endOf("day"),
          ],
        },
        sortDirection: "DESC",
      },
    });
    if (myTickets?.items?.length) {
      setTickets(myTickets.items);
      setAllContractTickets(myTickets.items);
    } else {
      setTickets([]);
    }
  };

  const getTickets = async () => {
    const {
      data: { ticketsByContract: myTickets },
    } = await API.graphql({
      query: ticketsByContract,
      variables: {
        limit: 3000,
        contractId,
        sortDirection: "DESC",
      },
    });
    if (myTickets?.items?.length) {
      setTickets(myTickets.items);
      setAllContractTickets(myTickets.items);
    } else {
      setTickets([]);
    }
  };

  const handleFilterByCorrespondingContract = (id) => {
    setCorrespondingContractId(id);
  };

  const handleClearCorrespondingContract = () => {
    setCorrespondingContractId(null);
  };

  const handleFetchQueries = () => {
    if (filterByFieldNum && filterByDateRange) {
      getTicketsWithTicketDateAndFieldNum();
    } else if (filterByDateRange && !filterByFieldNum) {
      getTicketsWithDateRange();
    } else if (filterByFieldNum && !filterByDateRange) {
      getTicketsWithFieldNum();
    } else {
      getTickets();
    }
    setCorrespondingContractId(null);
  };

  const handleFieldNumChange = (e) => {
    e.preventDefault();
    setFieldNum(e.target.value);
  };

  useEffect(() => {
    if (contracts.length) {
      let options = [];
      contracts.map((contract) =>
        options.push({ value: contract.id, label: contract.contractNumber })
      );
      setContractOptions(options);
    }
  }, [contracts]);

  useEffect(() => {
    if (contractsData?.items?.length) {
      setContracts(contractsData.items);
    }
  }, [contractsData]);

  useEffect(() => {
    if (correspondingContractId) {
      setTickets(
        tickets.filter(
          (ticket) => ticket.corresondingContract.id === correspondingContractId
        )
      );
    } else {
      setTickets(allContractTickets);
    }
  }, [correspondingContractId]);

  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Tickets By Contract</h3>
        </div>
        <div className="w-1/2 mx-auto">
          <div>
            <span>Select a Contract</span>
            <ReactSelect
              options={contractOptions}
              isClearable
              isSearchable
              onChange={(option) => setContractId(option?.value)}
            />
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="w-1/4">
              <span>Filter By Date?</span>
              <ReactSelect
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                onChange={({ value }) => setFilterByDateRange(value)}
              />
            </div>
            {filterByDateRange ? (
              <>
                {" "}
                <div className="">
                  <span className="block">Begin Date</span>
                  <DatePicker
                    selected={beginDate}
                    onChange={(date) => setBeginDate(date)}
                    className="form-input block"
                    startDate={beginDate}
                    selectsStart
                  />
                </div>
                <div>
                  <span className="block">End Date</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="form-input block"
                    endDate={endDate}
                    minDate={beginDate}
                    selectsStart
                  />
                </div>{" "}
              </>
            ) : null}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="w-1/4 mr-4">
              <span>Filter By Field Number?</span>
              <ReactSelect
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                onChange={({ value }) => setFilterByFielNum(value)}
              />
            </div>
            {filterByFieldNum ? (
              <>
                <div>
                  <span>Field Number</span>
                  <input
                    className="form-input block"
                    onChange={(e) => handleFieldNumChange(e)}
                    value={fieldNum}
                  />
                </div>
              </>
            ) : null}
            <div>
              <button
                className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:opacity-25"
                onClick={() => handleFetchQueries()}
                disabled={!contractId}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 mx-auto mt-4">
          {correspondingContractId ? (
            <button
              className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:opacity-25"
              onClick={() => handleClearCorrespondingContract()}
            >
              Clear Corresponding Contract Filter
            </button>
          ) : null}
        </div>
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
          {tickets.length ? (
            <div className="my-6 ">
              <div className="flex justify-between text-lg border-2 my-2 border-gray-500 mx-4">
                <div className="text-gray-800">
                  <span className="mx-2">
                    {tickets[0].contract.contractTo.companyReportName}
                  </span>
                  <span>{tickets[0].contract.contractNumber}</span>
                </div>
                <div className="text-gray-800 mx-2">
                  <span>{tickets[0].contract.commodity.name}</span>
                </div>
                <div className="mx-2">
                  <span className="text-lg">{`Price ${
                    tickets[0].contract.contractPrice
                      ? formatMoney.format(tickets[0].contract.contractPrice)
                      : formatMoney.format(tickets[0].contract.salePrice)
                  }`}</span>
                </div>
                <div className="mx-2">
                  <span className="text-center">Number of tickets: </span>
                  <span className="text-center">{tickets.length}</span>
                </div>
              </div>
              <table className="mx-4">
                <thead>
                  <tr className="text-graty-800 font-semibold">
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Ticket Number
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Contract Number
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Field Num
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Ticket Date
                    </th>

                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Gross Weight
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Tare Wegiht
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Net Weight
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Net Tons
                    </th>
                    <th className="px-2 text-gray-800 font-semibold border-b-2 border-gray-800">
                      Corresponding Contract
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets
                    ? tickets.map((ticket) => (
                        <tr>
                          <td className="text-center">{ticket.ticketNumber}</td>
                          <td className="text-center">
                            {ticket.contract.contractNumber}
                          </td>
                          <td className="text-center">{ticket.fieldNum}</td>
                          <td className="text-center">
                            {moment(ticket.ticketDate).format("MM/DD/YYYY")}
                          </td>
                          <td className="text-center">{ticket.grossWeight}</td>
                          <td className="text-center">{ticket.tareWeight}</td>
                          <td className="text-center">{ticket.netWeight}</td>
                          <td className="text-center">{ticket.netTons}</td>
                          <td className="text-center">
                            <button
                              className=" text-blue-800 no-underline hover:underline hover:text-blue-600"
                              onClick={() =>
                                handleFilterByCorrespondingContract(
                                  ticket.corresondingContract.id
                                )
                              }
                            >
                              {ticket.corresondingContract.contractNumber}
                            </button>
                          </td>
                        </tr>
                      ))
                    : null}
                  {tickets.length ? (
                    <tr className="border-t-2 border-gray-800">
                      <td className="text-center pt-2">Totals:</td>
                      <td className="text-center pt-2"></td>

                      <td className="text-center pt-2"></td>
                      <td className="text-center pt-2"></td>
                      <td className="text-center pt-2">
                        {tickets
                          .reduce((acc, cv) => acc + cv.grossWeight, 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                          })}
                      </td>
                      <td className="text-center pt-2">
                        {tickets
                          .reduce((acc, cv) => acc + cv.tareWeight, 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                          })}
                      </td>
                      <td className="text-center pt-2">
                        {tickets
                          .reduce((acc, cv) => acc + cv.netWeight, 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                          })}
                      </td>
                      <td className="text-center pt-2">
                        {tickets
                          .reduce((acc, cv) => acc + cv.netTons, 0)

                          .toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="font-semibold">Contract Quantity:</td>
                    <td></td>
                    <td className="font-semibold text-center">
                      {tickets[0].contract.quantity.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  {filterByFieldNum ||
                  filterByDateRange ||
                  correspondingContractId ? null : (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="font-semibold">Remaining:</td>
                      <td className="font-semibold text-center">
                        {(
                          tickets[0].contract.quantity -
                          tickets.reduce((acc, cv) => acc + cv.netTons, 0)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  )}
                  <tr></tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default TicketsByContract;
