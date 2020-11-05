import Head from "next/head";
import Layout from "../components/layout";
import { API, withSSRContext } from "aws-amplify";
import { listTickets } from "../src/graphql/queries.ts";
import { useQueryCache, useQuery } from "react-query";
import { useEffect } from "react";
import {
  ReactQueryDevtools,
  ReactQueryDevtoolsPanel,
} from "react-query-devtools";

export default function Home() {
  const queryCache = useQueryCache();

  const prefetchTickets = async () => {
    await queryCache.prefetchQuery("tickets", async () => {
      const {
        data: { listTickets: ticketsData },
      } = await API.graphql({
        query: listTickets,
        variables: {
          limit: 1,
        },
      });
      return ticketsData;
    });
  };

  //   id: "8439e5c1-2e44-421a-86bf-c5391cffdf34"
  // contractId: "c136ab73-5ec0-4278-8eb5-b73ca4196f88"
  // type: "Ticket"
  // ▶ contract 20 items
  // ticketDate: "2019-08-02T05:00:00.000Z"
  // fieldNum: "SWM16"
  // baleCount: 36
  // ticketNumber: "27824"
  // ladingNumber: null
  // driver: "RON"
  // truckNumber: "350"
  // grossWeight: 66600
  // tareWeight: 31060
  // netWeight: 35540
  // netTons: 17.77
  // createdAt: "2020-10-20T20:45:42.310Z"
  // updatedAt: "2020-10-20T20:45:42.310Z"

  useEffect(() => {
    if (!queryCache.getQueryData("tickets")) {
      prefetchTickets();
    }
  }, []);

  return (
    <Layout>
      <div>Hello</div>
      <ReactQueryDevtools />
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();

    return {
      props: {
        authenticated: true,
        username: user.username,
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
    return {
      props: {
        authenticated: false,
      },
    };
  }
}
