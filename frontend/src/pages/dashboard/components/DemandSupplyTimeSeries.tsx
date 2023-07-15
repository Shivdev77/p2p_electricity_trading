import { useMemo } from "react";
import useStore from "@/store/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { useMantineTheme } from "@mantine/core";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Title
);

const DemandSupplyTimeSeries = () => {
  const tradeHistory = useStore((state) => state.tradeHistory);
  const theme = useMantineTheme();
  const datasets = useMemo(() => {
    const demandData = tradeHistory
      .filter((trade) => trade.type === "buy")
      .map((trade) => ({ x: trade.timeStamp, y: trade.quantity }));
    const supplyData = tradeHistory
      .filter((trade) => trade.type === "sell")
      .map((trade) => ({ x: trade.timeStamp, y: trade.quantity }));
    return [
      {
        label: "Demand",
        data: demandData,
        borderColor: theme.colors.red[6],
      },
      {
        label: "Supply",
        data: supplyData,
        borderColor: theme.colors.green[6],
      },
    ];
  }, [tradeHistory, theme.colors]);
  return (
    <div className="flex-1 bg-white rounded p-4 shadow-xl border border-solid border-gray-200">
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Demand / Supply Over Time",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
              type: "time",
            },
            y: {
              title: {
                display: true,
                text: "WHr",
              },
            },
          },
        }}
        data={{
          datasets,
        }}
      />
    </div>
  );
};

export default DemandSupplyTimeSeries;
