import { type ReactElement } from "react";

import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import RegisterForm from "@/app/(auth)/register/register.form";

export default function Page(): ReactElement {
  return (
    <main className={"flex size-full flex-col items-center justify-center"}>
      <Card>
        <CardHeader>
          <h1>Register</h1>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
}
