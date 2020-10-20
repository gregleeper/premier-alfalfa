import { API } from "aws-amplify";
import Table from "../../components/table";
import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { computeAvgNetTons, groupBy } from "../../utils";
import moment from "moment";
import Layout from "../../components/layout";
import { listTickets, listCommoditys } from "../../src/graphql/queries.ts";
const CommodityTotals = () => {
  const [beginDate, setBeginDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tickets, setTickets] = useState([]);
  const [ytdTickets, setYtdTickets] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [totals, setTotals] = useState([]);

  const getCommodities = async () => {
    const myCommodities = await API.graphql({
      query: listCommoditys,
    });
    getYearToDateTickets();
    setCommodities(myCommodities.data.listCommoditys.items);
  };

  const getTickets = async () => {
    const myTickets = await API.graphql({
      query: listTickets,
      variables: {
        filter: {
          ticketDate: {
            between: [beginDate, endDate],
          },
        },
        limit: 3000,
      },
    });
    setTickets(myTickets.data.listTickets.items);
  };

  const getYearToDateTickets = async () => {
    const firstOfYear = moment().startOf("year");
    const today = new Date();
    const myTickets = await API.graphql({
      query: listTickets,
      variables: {
        filter: {
          ticketDate: {
            between: [firstOfYear, today],
          },
        },
        limit: 3000,
      },
    });
    setYtdTickets(myTickets.data.listTickets.items);
  };

  const computeTotals = () => {
    const groupedYTD = groupBy(
      ytdTickets,
      (ticket) => ticket.contract.commodity.name
    );
    const grouped = groupBy(
      tickets,
      (ticket) => ticket.contract.commodity.name
    );
    let array = [];
    commodities.map((c) => {
      let commodityTotal = {};
      const group = grouped.get(c.name);
      const ytdGroup = groupedYTD.get(c.name);
      commodityTotal.commodity = c.name;

      commodityTotal.weekNumLoads = group ? group.length : 0;
      commodityTotal.yearNumLoads = ytdGroup ? ytdGroup.length : 0;

      commodityTotal.weekAvgTons = group ? computeAvgNetTons(group) : 0;
      commodityTotal.yearAvgTons = ytdGroup ? computeAvgNetTons(ytdGroup) : 0;

      array.push(commodityTotal);
    });
    setTotals(array);
  };

  console.log(totals);

  useEffect(() => {
    getCommodities();
  }, []);

  useEffect(() => {
    computeTotals();
  }, [tickets]);

  const columns = useMemo(
    () => [
      {
        Header: "Commodity",
        accessor: "commodity",
      },
      {
        Header: "Weekly Number of Loads",
        accessor: "weekNumLoads",
      },
      {
        Header: "Year Number of Loads",
        accessor: "yearNumLoads",
      },
      {
        Header: "Week Avg Tons",
        accessor: "weekAvgTons",
      },
      {
        Header: "YTD Avg Tons",
        accessor: "yearAvgTons",
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="px-12">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Commodity Ton Totals</h3>
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
                onClick={() => getTickets()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>Beginning {moment(beginDate).format("MM/DD/YY")}</span>
          </div>
          <div>
            <span>Ending {moment(endDate).format("MM/DD/YY")}</span>
          </div>
        </div>
        <div className="px-12">
          <Table columns={columns} data={totals} />
        </div>
      </div>
    </Layout>
  );
};

export default CommodityTotals;
