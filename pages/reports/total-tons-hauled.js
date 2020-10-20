import { API } from "aws-amplify";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import Layout from "../../components/layout";
import { listTickets, listContracts } from "../../src/graphql/queries";
import Table from "../../components/table";
import { groupBy, computeSum } from "../../utils";

const TotalTonsHauled = () => {
  const [beginDate, setBeginDate] = useState();
  const [endDate, setEndDate] = useState();
  const [beginningOfYear, setBeginningOfYear] = useState(moment().startOf('year'))
  const [activeContracts, setActiveContracts] = useState([])
  const [ticketsYTD, setTicketsYTD] = useState([])
  const [tickets, setTickets] = useState([]);
  const [totals, setTotals] = useState([])
  const [commodityTotals, setCommodityTotals] = useState([])

  const getTicketsFiltered = async () => {
    const {
      data: {
        listTickets: { items: myTickets },
      },
    } = await API.graphql({
      query: listTickets,
      variables: {
        filter: {
          ticketDate: {
            between: [beginDate, endDate],
          },
        },
        limit: 30000
      },
    });
    getTicketsYTD()
    setTickets(myTickets);
  };

  const getTicketsYTD = async () => {

    const {data: {listTickets: {items: myTickets}}} = await API.graphql({
      query: listTickets,
      variables: {
        filter: {
          ticketDate: {
            between: [beginningOfYear, endDate]
          }
        },
        limit: 30000
      }

    })
    setTicketsYTD(myTickets)
  }

  const getActiveContracts = async () => {
    
    const {data: {listContracts: {items: myContracts}}} = await API.graphql({
      query: listContracts,
      variables: {
        filter: {
          contractState: {eq: "ACTIVE"}
        },
        limit: 30000
      }
    })

    setActiveContracts(myContracts)
  }
  
  const computeTotals = () => {
    const byContract = groupBy(
      tickets,
      (ticket) => ticket.contractId
    )

    const YTDbyContract = groupBy(
      ticketsYTD,
      (ticket) => ticket.contractId
    )

    const byCommodity = groupBy(
      tickets,
      (ticket) => ticket.contract.commodity.name
    )
    let commoditiesHauled = []
    byCommodity.forEach(i => {
      let commodity = {}
      
      commodity.name = i[0].contract.commodity.name
      const group = byCommodity.get(commodity.name)
      commodity.weekTotal = computeSum(group)
      commoditiesHauled.push(commodity)
    })
    setCommodityTotals(commoditiesHauled)
    let array = []
    
    activeContracts.map(contract => {
      let ticketTotals = {}
      const group = byContract.get(contract.id)
      const groupYTD = YTDbyContract.get(contract.id)
      //console.log(group)
      ticketTotals.commodity = contract.commodity.name
      ticketTotals.contractNumber = contract.contractNumber
      ticketTotals.contractName = contract.contractTo.companyReportName
      
      ticketTotals.weeklyHaul = computeSum(group)
      ticketTotals.toDate = computeSum(groupYTD)
      ticketTotals.totalContract = contract.quantity
      ticketTotals.balanceDue = contract.quantity - ticketTotals.toDate
      array.push(ticketTotals)
    })
    setTotals(array)

  }


  useEffect(() => {
    getActiveContracts()
  }, [])

  useEffect(() => {
    if(tickets.length > 0){

      computeTotals()
    }
  }, [tickets])

  const columns = useMemo(() => [
    {
      Header: "Commodity",
      accessor: "commodity"
    },
    {
      Header: "Contract Number",
      accessor: "contractNumber"
    }, 
    {
      Header: "Contract Name",
      accessor: "contractName"
    }, 
    {
      Header: "Weekly Haul",
      accessor: "weeklyHaul"
    },
    {
      Header: "To Date",
      accessor: "toDate"
    },
    {
      Header: "Balance Due",
      accessor: 'balanceDue'
    },
    {
      Header: "Total Contract",
      accessor: 'totalContract'
    }
  ])

  return (
    <Layout>
      <div>
      <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Total Tons Hauled</h3>
        </div>
        <div className="w-4/12 mx-auto">
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
                onClick={() => getTicketsFiltered()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="px-12 mt-4">
          <div className="w-5/12 mx-auto text-center"> 
  <h6 className="text-gray-900 text-xl font-bold">Commodity Subtotals for the Period {moment(beginDate).format("MM/DD/YY")} - {moment(endDate).format("MM/DD/YY")}</h6>
  {commodityTotals.map((c, i) => <div key={i} className="flex justify-between "><p className="mr-6 text-bold">{c.name}</p><p>{ c.weekTotal}</p></div>)}
          </div>
          <Table data={totals} columns={columns}/>
        </div>
      </div>
    </Layout>
  );
};

export default TotalTonsHauled;
