import useStore from "@/store/store";
import { useMantineTheme } from "@mantine/core";

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
  ArcElement,
} from "chart.js";
import { useMemo } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  ArcElement
);

const DemandSupplyDoughnutChart = () => {
  const tradeHistory = useStore((state) => state.tradeHistory);
  const theme = useMantineTheme();
  const datasets = useMemo(() => {
    return [
      {
        data: [
          tradeHistory
            .filter((trade) => trade.type === "buy")
            .reduce((previousSum, b) => previousSum + b.quantity, 0),
          tradeHistory
            .filter((trade) => trade.type === "sell")
            .reduce((previousSum, b) => previousSum + b.quantity, 0),
        ],
        backgroundColor: [theme.colors.red[6], theme.colors.green[6]],
      },
    ];
  }, [tradeHistory, theme.colors]);
  return (
    <div
      className="bg-white rounded p-4 shadow-xl border border-solid border-gray-200"
      style={{ maxHeight: "300px" }}
    >
      <Doughnut
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Demand / Supply Share",
            },
          },
        }}
        data={{
          labels: ["Demand", "Supply"],
          datasets: datasets,
        }}
      />
    </div>
  );
};

export default DemandSupplyDoughnutChart;
