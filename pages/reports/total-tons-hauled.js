import { API } from "aws-amplify";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import Layout from "../../components/layout";
import { listTickets, listContracts } from "../../src/graphql/queries";
import Table from "../../components/table";
import { groupBy, computeSum } from "../../utils";
import {useQuery, useInfiniteQuery, useQueryCache} from 'react-query'
import {ReactQueryDevtools} from 'react-query-devtools'
const TotalTonsHauled = () => {
  const [beginDate, setBeginDate] = useState();
  const [endDate, setEndDate] = useState();
  const [beginningOfYear, setBeginningOfYear] = useState(moment().startOf('year'))
  const [activeContracts, setActiveContracts] = useState([])
  const [ticketsYTD, setTicketsYTD] = useState([])
  const [tickets, setTickets] = useState([]);
  const [totals, setTotals] = useState([])
  const [commodityTotals, setCommodityTotals] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const cache = useQueryCache()
  

  // const getTicketsFiltered = async () => {
  //   const {
  //     data: {
  //       listTickets: { items: myTickets },
  //     },
  //   } = await API.graphql({
  //     query: listTickets,
  //     variables: {
  //       filter: {
  //         ticketDate: {
  //           between: [beginDate, endDate],
  //         },
  //       },
  //       limit: 60000
  //     },
  //   });
  //   console.log('myTickets: ', myTickets)
  //   getTicketsYTD()
  //   setTickets(myTickets);
  // };

  // const getTicketsYTD = async () => {

  //   const {data: {listTickets: {items: myTickets}}} = await API.graphql({
  //     query: listTickets,
  //     variables: {
  //       filter: {
  //         ticketDate: {
  //           between: [beginningOfYear, endDate]
  //         }
  //       },
  //       limit: 100000
  //     }

  //   })
  //   setTicketsYTD(myTickets)
  // }

  const {data: initTicketsData, refetch} = useQuery('totalTonsHauled', async() => {
    const{data: {listTickets: initTickets}} = await API.graphql({
       query: listTickets,
       variables: {
         limit: 3000,
         filter: {
           ticketDate: {
             between: [beginDate, endDate]
           }
         }
       }
     })
    
     return initTickets
     },
     {
      enabled: false,
       cacheTime: 1000 * 60 * 59,
       refetchOnWindowFocus: false,
       refetchOnMount: false,
       refetchIntervalInBackground: false,
       refetchOnReconnect: true,
       forceFetchOnMount: false,
       
     }
   )
 
   const {
     status,
     data,
     error,
     isFetching,
     isFetchingMore,
     fetchMore,
     canFetchMore,
   }  = useInfiniteQuery('totalTonsHauled', async (key, nextToken = cache.getQueryData('totalTonsHauled').nextToken ) => {
     
     const {data: {listTickets: ticketData}} = await API.graphql({
       query: listTickets,
       variables: {
         limit: 3000,
         filter: {
           ticketDate: {
            between: [beginDate, endDate]
          },
         },
         nextToken,
       }
     })
     return ticketData
     },
     { 
       enabled: false,
       getFetchMore: (lastGroup, allGroups) => lastGroup.nextToken,
       cacheTime: 1000 * 60 * 60,
       refetchOnWindowFocus: false,
       forceFetchOnMount: false
     }
   )

   useEffect(() => {
    
   }, [beginDate, endDate])

  const {data: activeContractsData} = useQuery('activeContracts', async () => {
    const {data: {listContracts: activeContracts}} = await API.graphql({
      query: listContracts,
      variables: {
        limit: 3000,
        filter: {
          contractState: {eq: "ACTIVE"}
        }
      }
    })
    return activeContracts
  })

  // const getActiveContracts = async () => {
    
  //   const {data: {listContracts: {items: myContracts}}} = await API.graphql({
  //     query: listContracts,
  //     variables: {
  //       filter: {
  //         contractState: {eq: "ACTIVE"}
  //       },
  //       limit: 30000
  //     }
  //   })

  //   setActiveContracts(myContracts)
  // }
  
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
      console.log(groupYTD)
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

  console.log(cache.getQueryData('totalTonsHauled'))

  const compileData = () => {
    if(isInitialLoad){
      let array = [...tickets]
    
    data && data.map((group, i) => {
     
      group.items.map(item => array.push(item))
    })
    setTickets(array)
    setIsInitialLoad(false)
    }else{
      
      let array = []
      data && data.map((group, i) => {
     
        group.items.map(item => array.push(item))
      })
      setTickets(array)
     
    }
    
  }


  useEffect(() => {
    if(activeContractsData){
      setActiveContracts(activeContractsData.items)
    }
  }, [activeContractsData])

  useEffect(() => {
    if(initTicketsData){
      fetchMore()
    }
    if(initTicketsData && canFetchMore && !isFetchingMore) {
      fetchMore()
    }
    if(initTicketsData && initTicketsData.length && !canFetchMore){
      compileData()
    }
    
  }, [initTicketsData])

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
                onClick={() => refetch()}
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
      <ReactQueryDevtools/>
    </Layout>
  );
};

export default TotalTonsHauled;
