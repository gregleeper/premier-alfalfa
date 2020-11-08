import { API } from "aws-amplify";
import { listTickets } from "../../src/graphql/queries.ts";
import { deleteTicket } from "../../src/graphql/mutations.ts";
import { useState, useEffect } from "react";

const DeleteTickets = () => {
  const [tickets, setTickets] = useState([]);

  const getTickets = async () => {
    const {
      data: {
        listTickets: { items },
      },
    } = await API.graphql({
      query: listTickets,
      variables: {
        limit: 1300,
      },
    });
    setTickets(items);
  };

  useEffect(() => {
    getTickets();
  }, []);

  const handleDelete = async () => {
    tickets.map(async (ticket) => {
      const { data } = await API.graphql({
        query: deleteTicket,
        variables: {
          input: {
            id: ticket.id,
          },
        },
      });
      console.log(data);
    });
  };

  return (
    <div>
      {tickets.length && <div>Number of tickets = {tickets.length} </div>}
      <div>
        <button onClick={() => handleDelete()}>Delete All</button>
      </div>
    </div>
  );
};

export default DeleteTickets;
