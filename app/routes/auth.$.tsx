import { authenticate } from "~/shopify.server";
import { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ request, context }) => {
  // 这里使用 shopifyInstance.authenticate.admin 而不是直接调用 authenticate
  const shopifyInstance = getShopify(context.env);
  return await shopifyInstance.authenticate.admin(request);
};

// 添加导入
import { getShopify } from "~/shopify.server";