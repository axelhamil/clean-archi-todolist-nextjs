"use server";
import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  registerController,
  RegisterInput,
} from "@/src/adapters/controllers/register.controller";
import { Cookie } from "@/src/domains/entities/cookie";
import {
  AuthenticateError,
  InputParseError,
  UnauthorizedError,
} from "@/src/domains/errors/common";

export async function registerAction(input: RegisterInput) {
  return await withServerActionInstrumentation(
    "registerAction",
    { recordResponse: true },
    async () => {
      let sessionCookie: Cookie;
      try {
        const { cookie } = await registerController(input);
        sessionCookie = cookie;
      } catch (err) {
        if (
          err instanceof InputParseError ||
          err instanceof AuthenticateError ||
          err instanceof UnauthorizedError
        ) {
          return {
            error:
              "Invalid data. Make sure the Password and Confirm Password match.",
          };
        }
        captureException(err);
        return {
          error:
            "An error happened. The developers have been notified. Please try again later. Message: " +
            (err as Error).message,
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
