"use server";
import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "@/shared/di";
import {
  loginController,
  LoginInput,
} from "@/src/adapters/controllers/login.controller";
import { logoutController } from "@/src/adapters/controllers/logout.controller";
import { Cookie } from "@/src/domains/entities/cookie";
import {
  AuthenticateError,
  InputParseError,
  UnauthorizedError,
} from "@/src/domains/errors/common";

export async function loginAction(input: LoginInput) {
  return await withServerActionInstrumentation(
    "loginAction",
    { recordResponse: true },
    async () => {
      let sessionCookie: Cookie;
      try {
        sessionCookie = await loginController(input);
      } catch (err) {
        if (
          err instanceof InputParseError ||
          err instanceof AuthenticateError ||
          err instanceof UnauthorizedError
        ) {
          return {
            error: "Invalid credentials. Please try again.",
          };
        }
        captureException(err);
        return {
          error:
            "An error happened. The developers have been notified. Please try again later.",
        };
      }

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      redirect("/");
    },
  );
}

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
