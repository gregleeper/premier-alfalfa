import {useState, useEffect, useMemo} from 'react'
import {API} from 'aws-amplify'
import moment from 'moment'
import Layout from '../../components/layout'
import {listContracts, listCommoditys, listTickets, contractsByType} from '../../src/graphql/queries.ts'
import {groupBy, computeSum, computeAvgContractPrice, formatMoney} from '../../utils'
import Table from '../../components/table'
import {useQuery} from 'react-query'

const StatusReport = () => {
  const [date, setDate] = useState(new Date())
  const [tickets, setTickets] = useState([])
  
  const [activeContracts, setActiveContracts] = useState([])
  const [ticketsForContracts, setTicketsForContracts] = useState([])
  const [commodities, setCommodities] = useState([])
  const [summary, setSummary ] = useState([])

  // const getActiveContracts = async () => {
  //   const {data: {listContracts: {items: myActiveContracts}}} = await API.graphql({
  //     query: listContracts,
  //     variables: {
  //       filter: {
  //         contractState: {eq: "ACTIVE"},
  //         contractType: {eq: "PURCHASE"}
  //       },
  //       limit: 30000
  //     }
  //   })
  //   setActiveContracts(myActiveContracts)
  // }

  const {data: activeContractsData} = useQuery('activeSalesContracts', async () => {
    const {data: {contractsByType: contracts}} = await API.graphql({
      query: contractsByType,
      variables: {
        contractType: "PURCHASE",
        filter: {
          contractState: {eq: "ACTIVE"}
        },
        limit:  3000,
      }
    })
    return contracts
  })


  const {data: ticketsData, refetch, isSuccess, isLoading, isFetched} = useQuery('ticketsForActivePurchaseContracts', async () => {
    let array = [...ticketsForContracts]
    activeContracts.map(async (contract) => {
      const {data: {listTickets: {items: contractTickets}}} = await API.graphql({
        query: listTickets,
        variables: {
          filter: {
            contractId: {
              eq: contract.id
            }
          },
          limit: 50000
        }
      })
      array.push({contract, contractTickets})
    } )
    return array
    }, 
    { 
      enabled: false,
      cacheTime: 1000 * 60 * 59,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: true,
      forceFetchOnMount: false,
      keepPreviousData: false
    }
  )

  // const getTicketsForContracts = async () => {
  //   let array = [...ticketsForContracts]
  //   activeContracts.map(async (contract) => {
  //     const {data: {listTickets: {items: contractTickets}}} = await API.graphql({
  //       query: listTickets,
  //       variables: {
  //         filter: {
  //           contractId: {
  //             eq: contract.id
  //           }
  //         },
  //         limit: 30000
  //       }
  //     })
  //     array.push({contract, contractTickets})
  //     setTicketsForContracts(array)
  //   })
   
  // }
  

  const computeTotals = () => {
    let groupedTotals = []
    let activeCommodities = []
    const commoditiesGroup = groupBy(ticketsForContracts, item => item.contract.commodity.name)
    commoditiesGroup.forEach(i => activeCommodities.push(i[0].contract.commodity.name))
    setCommodities(activeCommodities)
    let commodityTotals = []
    activeCommodities.map(c => {
      
      const commodity = commoditiesGroup.get(c)
     
      let commoditySummary = {commodity: c, contracts: []}
      commodity.map(i => {
        let contract = {}
        let tonsHauled = computeSum(i.contractTickets)
        let avgPrice = computeAvgContractPrice(i.contractTickets)
        contract.contractNumber = i.contract.contractNumber
        contract.purchasedFrom = i.contract.purchasedFrom
        contract.commodity = i.contract.commodity.name
        contract.dueDate = moment(i.contract.endDate).format("MM/DD/YY")
        contract.daysRemaining = moment(i.contract.endDate).diff(new Date(), 'days')
        contract.contractDate = moment(i.contract.beginDate).format("MM/DD/YY")
        contract.quantity = i.contract.quantity
        contract.contractPrice = i.contract.contractPrice
        contract.avgPrice = avgPrice
        contract.quantityRemaining = i.contract.quantity - tonsHauled
        contract.amount = i.contract.contractPrice * contract.quantityRemaining
        commoditySummary.contracts.push(contract)
        
      })
      commodityTotals.push(commoditySummary)
    })
    setSummary(commodityTotals)

  }

  useEffect(() => {
    if(activeContractsData){
      setActiveContracts(activeContractsData.items)
    }
  }, [activeContractsData])

  useEffect(() => {
    if(activeContracts.length > 0){
      refetch()
    }
  }, [activeContracts])

  useEffect(() => {
    if(ticketsData && isSuccess ){
      
      setTicketsForContracts(ticketsData)
    }
  }, [ticketsData])

  const columns = useMemo(() => [
    {
      Header: "Contract Number",
      accessor: "contractNumber"
    },
    {
      Header: "Purchased From",
      accessor: 'purchasedFrom'
    },
    {
      Header: "Commodity",
      accessor: "commodity"
    },
    {
      Header: "Due Date",
      accessor: "dueDate"
    },
    {
      Header: "Days Remaining",
      accessor: "daysRemaining"
    },
    {
      Header: "Contract Date",
      accessor: "contractDate"
    },
    {
      Header: "Quantity",
      accessor: "quantity"
    },
    {
      Header: "Price",
      accessor: "contractPrice",
    Footer: ({rows}) => {
      let avgPrice = 0
      let sum = 0
      let itemsFound = 0
      const len = rows.length
      let item = null
      for(let i = 0; i < len; i++){
        item = rows[i].values
        if(item && item.contractPrice > 0) {
          sum = item.contractPrice + sum
          itemsFound++
        }
        avgPrice = sum/itemsFound
      }
    return (<div className="py-2 text-center flex justify-around items-center border-t-4 border-gray-900">
    <div>
      <span className="text-gray-600">Avg:</span>{" "}
    </div>
    <div>
      <span className="text-lg font-bold">
        {isNaN(avgPrice) ? formatMoney.format(0) : formatMoney.format(avgPrice)}
      </span>
    </div>
  </div>)
    }
    },
    {
      Header: "Quantity Remaining",
      accessor: "quantityRemaining"
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({value}) => <span>{formatMoney.format(value)}</span>,
      Footer: ({rows}) => {
        const total = useMemo(
          () => rows.reduce((sum, row) => row.values.amount + sum, 0),
          [rows]
        );
        return (
          <div className="py-2 text-center flex justify-around items-center border-t-4 border-gray-900">
            <div>
              <span className="text-gray-600">Total:</span>{" "}
            </div>
            <div>
              <span className="text-lg font-bold">
                {formatMoney.format(total)}
              </span>
            </div>
          </div>
        );
      }
    }
  ])


  return (
    <Layout>
      <div className="px-12"> 
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Status Report - Purchases</h3>
        </div>
        <div>
        <div>
        {!isFetched ? <p>Loading....</p> : <button 
            className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white disabled:border-red-200" 
            onClick={() => computeTotals()}
            disabled={!isFetched}
          >
            Generate Report
          </button>}
        </div>
          <div className="px-12 pt-12">
            {summary.map((c, i) => (
              <div key={i} >
                <h6 className="font-bold text-xl">{c.commodity}</h6>
                <Table columns={columns} data={c.contracts} />
                </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  ) 
}

export default StatusReport