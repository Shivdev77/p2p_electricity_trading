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

const PriceWhrTimeSeries = () => {
  const tradeHistory = useStore((state) => state.tradeHistory);
  const theme = useMantineTheme();
  const datasets = useMemo(() => {
    const demandData = tradeHistory.map((trade) => ({
      x: trade.timeStamp,
      y: trade.price / trade.quantity,
    }));
    return [
      {
        data: demandData,
        borderColor: theme.colors.blue[6],
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
              display: false,
            },
            title: {
              display: true,
              text: "Price Per Whr",
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
                text: "Price / WHr",
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

export default PriceWhrTimeSeries;
