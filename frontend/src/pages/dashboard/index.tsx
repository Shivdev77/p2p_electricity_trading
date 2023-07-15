import ApplicationShell from "@/layouts/ApplicationShell";
import { NextPageWithLayout } from "../_app";
import Head from "next/head";
import useStore from "@/store/store";
import useClientLoaded from "@/hooks/useClientLoaded";
import TradePanel from "./components/TradePanel";
import TradeHistory from "./components/TradeHistory";
import StatsPanel from "./components/StatsPanel";

const Dashboard: NextPageWithLayout = () => {
  const user = useStore((state) => state.user);
  const wallet = useStore((state) => state.wallet);
  const clientLoaded = useClientLoaded();

  return (
    <main>
      <Head>
        <title>Dashboard</title>
      </Head>
      {clientLoaded && (
        <div>
          <h1 className="text-2xl font-semibold m-0">Hi, {user?.name}</h1>
          <div>
            <div className="break-all">Wallet: {wallet.address}</div>
            <div>Balance: {wallet.balance} ETH</div>
          </div>
          <StatsPanel />
          <TradePanel />
          <TradeHistory />
        </div>
      )}
    </main>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <ApplicationShell>{page}</ApplicationShell>;
};

export default Dashboard;
