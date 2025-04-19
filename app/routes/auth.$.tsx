import { authenticate } from "~/shopify.server";
import { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ request, context }) => {
  await authenticate(request, context.env);
  return null;
};