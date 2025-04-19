import { LoaderFunction } from "@remix-run/cloudflare";
import { getShopify } from "~/shopify.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  console.log("Auth 路由被访问:", request.url);
  
  try {
    const shopifyInstance = getShopify(context.env);
    return await shopifyInstance.authenticate.admin(request);
  } catch (error) {
    console.error("授权过程中出错:", error);
    throw error;
  }
};