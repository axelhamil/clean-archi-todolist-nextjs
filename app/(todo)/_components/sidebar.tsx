"use client";
import { Plus } from "lucide-react";
import { PropsWithChildren, ReactElement } from "react";

import { cn } from "@/app/_components/utils";

interface ISidebarProps extends PropsWithChildren {}

export default function Sidebar({}: ISidebarProps): ReactElement {
  return (
    <aside
      className={cn(
        "fixed flex h-full flex-col items-start justify-normal gap-4 transition-all duration-500 ease-in-out",
        "border-r border-[#BDADAE] bg-[#C8CEC9] pb-3 pl-5 text-lg shadow-lg",
        "w-64",
      )}
    >
      <div className={"h-12"}></div>
      <div>
        <div
          className={cn(
            "cursor-pointer flex items-center text-md font-semibold",
            "flex h-fit gap-2 p-0 font-semibold text-red-500",
          )}
        >
          <Plus
            size={24}
            className={"rounded-full bg-red-500 p-1 text-white"}
          />
          <p>Add Task</p>
        </div>
      </div>

      <div className={"mt-auto w-full"}>profil</div>
    </aside>
  );
}
