import { LoaderFunction } from "@remix-run/cloudflare";
import { getShopify } from "~/shopify.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  const shopify = getShopify(context.env);
  return await shopify.authenticate.callback(request);
};

