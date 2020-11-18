import { useState, useEffect } from "react";
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

const TicketsByContract = () => {
  const [contracts, setContracts] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [fieldNum, setFieldNum] = useState("");
  const [ticketDate, setTicketDate] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [filterByDateRange, setFilterByDateRange] = useState(false);
  const [filterByFieldNum, setFilterByFielNum] = useState(false);
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
        contractId,
        sortDirection: "DESC",
        filter: {
          fieldNum: { eq: fieldNum },
        },
      },
    });
    if (myTickets?.items?.length) {
      setTickets(myTickets.items);
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
        contractId,
        sortDirection: "DESC",
      },
    });
    if (myTickets?.items?.length) {
      setTickets(myTickets.items);
    } else {
      setTickets([]);
    }
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

  console.log(tickets);

  return (
    <Layout>
      <div>
        <div>
          <h6>Tickets By Contract</h6>
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
        <div>
          <table>
            <thead>
              <tr>
                <th>Ticket Number</th>
                <th>Contract Number</th>
                <th>Field #</th>
                <th>Ticket Date</th>

                <th>Gross Weight</th>
                <th>Tare Wegiht</th>
                <th>Net Weight</th>
                <th>Net Tons</th>
              </tr>
            </thead>
            <tbody>
              {tickets
                ? tickets.map((ticket) => (
                    <tr>
                      <td>{ticket.ticketNumber}</td>
                      <td>{ticket.contractNumber}</td>
                      <td>{ticket.fieldNum}</td>
                      <td>{ticket.ticketDate}</td>
                      <td>{ticket.grossWeight}</td>
                      <td>{ticket.tareWeight}</td>
                      <td>{ticket.netWeight}</td>
                      <td>{ticket.netTons}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TicketsByContract;
