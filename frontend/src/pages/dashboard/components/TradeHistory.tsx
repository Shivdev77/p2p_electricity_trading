import useStore from "@/store/store";
import { Badge, Button, Table } from "@mantine/core";
import { useEffect } from "react";

const TradeHistory = () => {
  const tradeHistory = useStore((state) => state.tradeHistory);
  const setTradeHistory = useStore((state) => state.setTradeHistory);
  const user = useStore((state) => state.user);
  const logOutUser = useStore((state) => state.logOutUser);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trades/`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          logOutUser();
          throw new Error("Session expired");
        }
        return response;
      })
      .then((response) => response.json())
      .then((trades) => {
        setTradeHistory(
          trades
            .map((trade: any) => ({
              type: trade.buyerId === user?.userId ? "buy" : "sell",
              quantity: trade.quantity,
              price: trade.price,
              status: trade.status,
              timeStamp: trade.timePlaced,
            }))
            .sort(
              (a: any, b: any) =>
                new Date(b.timeStamp).valueOf() -
                new Date(a.timeStamp).valueOf()
            )
        );
      })
      .catch(console.error);
  }, [logOutUser, user, setTradeHistory]);

  const rows = tradeHistory.map((trade, index) => (
    <tr key={index}>
      <td>
        <Badge color={trade.type === "buy" ? "blue" : "red"}>
          {trade.type}
        </Badge>
      </td>
      <td>{trade.quantity}</td>
      <td>{trade.price}</td>
      <td>
        <Badge
          color={
            trade.status.toLowerCase() === "completed"
              ? "green"
              : trade.status.toLowerCase() === "pending"
              ? "yellow"
              : "red"
          }
        >
          {trade.status}
        </Badge>
      </td>
      <td>{new Date(trade.timeStamp).toLocaleString()}</td>
      <td>
        {trade.status.toLowerCase() === "pending" ? (
          <Button
            color="red"
            size="xs"
            onClick={() => {
              const newTradeHistory = [...tradeHistory];
              newTradeHistory[index].status = "cancelled";
              setTradeHistory(newTradeHistory);
            }}
          >
            Cancel
          </Button>
        ) : (
          ""
        )}
      </td>
    </tr>
  ));
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold m-0">Trade History</h2>
      <div className="bg-white rounded p-2 mt-2 shadow-xl border border-solid border-gray-200">
        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Quantity (WHr)</th>
              <th>Price (ETH)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default TradeHistory;
