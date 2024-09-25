"use server";
import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "@/common/di";
import { logoutController } from "@/src/adapters/controllers/logout.controller";
import { Cookie } from "@/src/domains/auth/cookie";
import {
  AuthenticateError,
  InputParseError,
  UnauthorizedError,
} from "@/src/shared/errors";

export async function logoutAction() {
  return await withServerActionInstrumentation(
    "logoutAction",
    { recordResponse: true },
    async () => {
      const cookiesStore = cookies();
      const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

      let blankCookie: Cookie;
      try {
        blankCookie = await logoutController(sessionId);
      } catch (err) {
        if (
          err instanceof InputParseError ||
          err instanceof AuthenticateError ||
          err instanceof UnauthorizedError
        ) {
          redirect("/login");
        }
        captureException(err);
        console.error(err);
        throw err;
      }

      cookies().set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes,
      );

      redirect("/login");
    },
  );
}
