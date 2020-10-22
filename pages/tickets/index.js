import Layout from "../../components/layout";
import { useMemo, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listTickets, ticketsByContract, listContracts } from "../../src/graphql/queries.ts";
import Link from "next/link";
import Table from "../../components/table";
import ReactSelect from 'react-select'
import moment from "moment";
import {useQueryCache, useInfiniteQuery, useQuery} from 'react-query'
import {ReactQueryDevtools} from 'react-query-devtools'

const Tickets = () => {
  const cache = useQueryCache()
  const [tickets, setTickets] = useState([]);
  const [contractFilter, setContractFilter] = useState()
  const [contracts, setContracts] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const {data: initTicketsData} = useQuery('tickets', async() => {
   const{data: {listTickets: initTickets}} = await API.graphql({
      query: listTickets,
      variables: {
        limit: 10
      }
    })
    return initTickets
    },
    {
      cacheTime: 1000 * 60 * 59,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: true,
      
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
  }  = useInfiniteQuery('tickets', async (key, nextToken = cache.getQueryData('tickets').nextToken ) => {
    // console.log(cache.getQuery('tickets'))
    // if(!cache.getQuery('tickets')){
    //   console.log('here')
    //   const {data: {listTickets: ticketData}} = await API.graphql({
    //     query: listTickets,
    //     variables: {
    //       limit: 5000
    //     }
    //   })
    //   return ticketData
    // } 
    const {data: {listTickets: ticketData}} = await API.graphql({
      query: listTickets,
      variables: {
        
        limit: 5000,
        nextToken,
      }
    })
    return ticketData
    },
    {
      getFetchMore: (lastGroup, allGroups) => lastGroup.nextToken,
      cacheTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false
    }
  )



  useEffect(() => {
    if(initTicketsData){
      fetchMore()
    }
    if(initTicketsData && canFetchMore && !isFetchingMore) {
      fetchMore()
    }
    if(data && data.length && !canFetchMore){
      compileData()
    }
    
  }, [data, initTicketsData])

  useEffect(() => {
    getContracts()
    //compileData()
  }, []);



  const getContracts = async() => {
    const {data: {listContracts: {items: myContracts}}} = await API.graphql({
      query: listContracts,
      variables: {
        limit: 2000
      }
    })
    let options = []
    myContracts.map(c => {
      options.push({value: c.id, label: `${c.contractNumber} - ${c.contractTo.companyReportName} - ${c.contractType}`})
    })

    setContracts(options)
  }

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

  const columns = useMemo(
    () => [
      {
        Header: "Ticket #",
        accessor: "ticketNumber",
      },
      {
        Header: "Contract #",
        accessor: "contract.contractNumber",
      },
      {
        Header: "Ticket Date",
        accessor: "ticketDate",
        Cell: ({ value }) => (
          <span>{moment(value).format("MMM Do, YYYY")}</span>
        ),
      },
      {
        Header: "Field #",
        accessor: "fieldNum",
      },
      {
        Header: "Bale Count",
        accessor: "baleCount",
      },
      {
        Header: "Lading #",
        accessor: "ladingNumber",
      },
      {
        Header: "Driver",
        accessor: "driver",
      },
      {
        Header: "Truck #",
        accessor: "tuckNumber",
      },
      {
        Header: "Gross Weight",
        accessor: "grossWeight",
      },
      {
        Header: "Tare Weight",
        accessor: "tareWeight",
      },
      {
        Header: "Net Weight",
        accessor: "netWeight",
      },
      {
        Header: "Net Tons",
        accessor: "netTons",
        Footer: ({rows}) => {
            
          const total = useMemo(
            () => rows.reduce((sum, row) => row.values.netTons + sum, 0),
            [rows]
          );
          return (
            <div className="py-2 text-center flex justify-around items-center border-t-4 border-gray-900">
              <div>
                <span className="text-gray-600">Total:</span>{" "}
              </div>
              <div>
                <span className="text-lg font-bold">
                  {total}
                </span>
              </div>
            </div>
          );
        }

      },
      {
        Header: "Edit",
        accessor: "id",
        Cell: ({ value }) => (
          <Link href="/tickets/edit/[id]" as={`/tickets/edit/${value}`}>
            <a className="text-blue-600 underline hover:text-blue-800 hover:no-underline">
              {" "}
              View
            </a>
          </Link>
        ),
      },
    ],
    []
  );

  

  return (
    <Layout>
      <div className="px-6">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Tickets</h3>
        </div>
        <div className="flex justify-around items-center">
          <div className="my-6">
            <Link href="/tickets/create">
              <a className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white">
                Create New
              </a>
            </Link>
          </div>
          <div className="w-1/4">
            <label htmlFor="ticketsByContract">Filter By Contract</label>
            <ReactSelect
              name="ticketsByContract"
              className="w-full"
              onChange={(target) => target ? setContractFilter(target.value) : (setContractFilter(), getAllTickets()) }
              options={contracts}
              isClearable
              
            />
          </div>
        </div>
        <div>
          <Table data={tickets} columns={columns} />
        </div>
      </div>
      <ReactQueryDevtools />
    </Layout>
  );
};

export default Tickets;
