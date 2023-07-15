import TradeSection from "./TradeSection";

const TradePanel = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold m-0">Trade Panel</h2>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <TradeSection type="buy" />
        <TradeSection type="sell" />
      </div>
    </div>
  );
};

export default TradePanel;
