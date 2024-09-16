import { Separator } from "@radix-ui/react-separator";
import { Coins } from "lucide-react";
import { type ReactElement } from "react";

export default function Score(): ReactElement {
  return (
    <div className="absolute flex justify-around items-center top-5 right-10 bg-white border border-gray-200 rounded-full py-2 px-4 shadow">
      <div className="flex items-center space-x-2">
        <Coins color="gold" size={24} />
        <Separator decorative orientation="vertical" className="h-6 w-[1px] bg-gray-300 mx-3" />
        <span className="text-gray-800 text-xl font-extrabold tracking-tight">
          100
        </span>
      </div>
    </div>
  );
}
