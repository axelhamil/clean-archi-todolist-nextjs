import { type ReactElement } from "react";

import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import LoginForm from "@/app/(auth)/login/login.form";

export default function Page(): ReactElement {
  return (
    <main className={"flex size-full flex-col items-center justify-center"}>
      <Card>
        <CardHeader>
          <h1>Login</h1>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
