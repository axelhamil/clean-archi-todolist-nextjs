import { Coins } from "lucide-react";
import { type ReactElement } from "react";

interface IScoreProps {
  points: number;
}

export default function Score({ points }: IScoreProps): ReactElement {
  return (
    <div className="absolute right-10 top-5 flex items-center justify-around rounded-lg border border-gray-200 bg-white px-2 py-1 shadow">
      <div className="flex items-center space-x-2">
        <Coins color="gold" size={30} />
        <span className="text-xl font-extrabold tracking-tight text-yellow-500">
          {points ?? 0}
        </span>
      </div>
    </div>
  );
}
