import { create } from "zustand";
import { persist } from "zustand/middleware";

type Trade = {
  id: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  timeStamp: number;
  status: "completed" | "pending" | "cancelled";
};
interface IGlobalState {
  user: { username: string; name: string; userId: string } | null;
  setUser: (user: NonNullable<IGlobalState["user"]>) => void;
  logOutUser: () => void;

  wallet: { address: string; balance: number };

  tradeHistory: Trade[];

  prependTradeHistory: (trade: Trade) => void;
  setTradeHistory: (trades: Trade[]) => void;
}

const useStore = create<IGlobalState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: NonNullable<IGlobalState["user"]>) =>
        set(() => ({ user })),
      logOutUser: () => set(() => ({ user: null })),

      wallet: {
        address: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
        balance: 999,
      },

      tradeHistory: [],
      prependTradeHistory: (trade: Trade) =>
        set((state) => ({
          tradeHistory: [trade, ...state.tradeHistory],
        })),
      setTradeHistory: (trades: Trade[]) =>
        set(() => ({
          tradeHistory: trades,
        })),
    }),
    {
      name: "user-details",
    }
  )
);

export default useStore;
