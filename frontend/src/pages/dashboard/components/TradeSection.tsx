import useStore from "@/store/store";
import { Button, NumberInput } from "@mantine/core";
import { isInRange, useForm } from "@mantine/form";

type TradeSectionProps = {
  type: "buy" | "sell";
};

const TradeSection = ({ type }: TradeSectionProps) => {
  const form = useForm({
    initialValues: {
      quantity: 0,
      price: 0,
    },

    validate: {
      quantity: isInRange({ min: 0.1 }, "Quantity must be atleast 0.1 WHr"),
      price: isInRange({ min: 0.1 }, "Price must be atleast 0.1 ETH"),
    },
  });

  const prependTradeHistory = useStore((state) => state.prependTradeHistory);

  const handleSubmit = (values: any) => {
    form.reset();
    prependTradeHistory({
      id: "6",
      quantity: values.quantity,
      price: values.price,
      status: "pending",
      type,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="flex-1 bg-white rounded p-4 shadow-xl border border-solid border-gray-200">
      <div className="text-center font-bold text-xl">
        {type === "buy" ? "Buy" : "Sell"} Energy
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <NumberInput
          withAsterisk
          label="Energy Quantity"
          placeholder="6"
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value} WHr`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "0 WHr"
          }
          step={0.1}
          min={0.1}
          precision={1}
          {...form.getInputProps("quantity")}
        />

        <NumberInput
          withAsterisk
          label="Price"
          placeholder="2"
          formatter={(value) =>
            !Number.isNaN(parseFloat(value))
              ? `${value} ETH`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "0 ETH"
          }
          step={0.1}
          precision={1}
          min={0.1}
          {...form.getInputProps("price")}
        />

        <Button
          type="submit"
          className="text-center mt-2"
          color={type === "buy" ? "blue" : "red"}
        >
          {type === "buy" ? "Buy" : "Sell"}
        </Button>
      </form>
    </div>
  );
};

export default TradeSection;
