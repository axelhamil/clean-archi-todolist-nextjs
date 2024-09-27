import { PropsWithChildren } from "react";

import Sidebar from "./_components/sidebar";

interface ITodoLayoutProps extends PropsWithChildren {}

export default function TodoLayout({ children }: ITodoLayoutProps) {
  return (
    <>
      <Sidebar />
      <main className={"ml-auto h-full w-5/6 px-2 py-3"}>{children}</main>
    </>
  );
}
