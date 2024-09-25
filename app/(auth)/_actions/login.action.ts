"use server";
import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  loginController,
  LoginInput,
} from "@/src/adapters/controllers/login.controller";
import { Cookie } from "@/src/domains/auth/cookie";
import {
  AuthenticateError,
  InputParseError,
  UnauthorizedError,
} from "@/src/shared/errors";

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
        console.error(err);
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
