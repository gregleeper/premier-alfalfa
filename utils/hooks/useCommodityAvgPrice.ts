import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { API } from "aws-amplify";
import { ticketsByDate } from "../../src/graphql/customQueries";
import { groupBy, formatMoney } from "..";
import moment from "moment";

interface CommodityTotals {
  tonsHauled: string,
  totalPaid: string,
  avgPricePerTon: string,
  commodity: string,
  numberOfLoad: number
}

type Summary = Array<CommodityTotals>



type Results =  {
  summary: Summary,
  status: string
}

export function useCommodityAvgPrice(date: Date , days: number): Results  {
  const [avgPrice, SetAvgPrice] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState<Summary>([]);

  const {
    data: ticketsData,
    isFetched,
    refetch,
    status,
    isLoading,
    isFetching,
    isSuccess,
    clear,
  } = useQuery("purchasesLast30Days", async () => {
    const {
      data: { ticketsByDate: tickets },
    } = await API.graphql({
      query: ticketsByDate,
      variables: {
        ticketDate: {
          between: [
            moment(date).endOf("date").subtract(days, "days"),
            moment(date).endOf("date"),
          ],
        },
        type: "Ticket",

        limit: 3000,
      },
    });
    return tickets;
  });

  useEffect(() => {
    clear();
    refetch();
  }, [date, days]);

  const computeTotals = () => {
    let activeCommodities = [];
    let purchases = tickets.filter(
      (ticket) =>
        ticket.contract.contractType === "PURCHASE" &&
        ticket.contract.contractPrice > 0
    );

    const commoditiesGroup = groupBy(
      purchases,
      (item) => item.contract.commodity.name
    );
    commoditiesGroup.forEach((i) =>
      activeCommodities.push(i[0].contract.commodity.name)
    );

    let totals = [];
    activeCommodities.map((c) => {
      const commodity = commoditiesGroup.get(c);
      const commodityTotals: CommodityTotals = {
        tonsHauled: "",
        totalPaid: "",
        avgPricePerTon: "",
        numberOfLoad: 0,
        commodity: ""
      }
      //let commoditySummary = { commodity: c, totals: [] };
      let tonsHauled = 0;
      let totalPaid = 0;
      commodity.map((i) => {
        tonsHauled = tonsHauled + i.netTons;
        let purchasePrice = i.contract.contractPrice * i.netTons;
        totalPaid = totalPaid + purchasePrice;
      });
      commodityTotals.tonsHauled = tonsHauled.toFixed(2);
      commodityTotals.totalPaid = formatMoney.format(totalPaid);
      commodityTotals.avgPricePerTon = formatMoney.format(
        totalPaid / tonsHauled
      );
      commodityTotals.commodity = commodity[0].contract.commodity.name;
      commodityTotals.numberOfLoad = commodity.length;
      totals.push(commodityTotals);
    });

    setSummary(totals);
  };

  useEffect(() => {
    if (ticketsData) {
      setTickets(ticketsData.items);
    }
  }, [ticketsData]);

  useEffect(() => {
    if (tickets.length > 0) {
      computeTotals();
    }
  }, [tickets]);

  return { summary, status };
}
