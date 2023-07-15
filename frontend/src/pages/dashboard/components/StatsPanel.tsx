import DemandSupplyTimeSeries from "./DemandSupplyTimeSeries";
import DemandSupplyDoughnutChart from "./DemandSupplyDoughnutChart";
import PriceWhrTimeSeries from "./PriceWhrTimeSeries";

const StatsPanel = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold m-0">Statistics</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        <DemandSupplyTimeSeries />
        <DemandSupplyDoughnutChart />
        <PriceWhrTimeSeries />
      </div>
    </div>
  );
};

export default StatsPanel;
