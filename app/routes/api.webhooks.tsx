import { ActionFunction } from "@remix-run/cloudflare";
import { getShopify } from "~/shopify.server";

export const action: ActionFunction = async ({ request, context }) => {
  const shopify = getShopify(context.env);
  
  try {
    const { topic, shop, webhookId } = await shopify.authenticate.webhook(request);
    
    // 处理不同类型的 webhook
    switch (topic) {
      case "APP_UNINSTALLED":
        // 处理应用卸载
        break;
      case "ORDERS_CREATE":
        // 处理订单创建
        break;
      // 可以添加更多 webhook 处理
    }
    
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Webhook 处理错误:", error);
    return new Response(null, { status: 500 });
  }
};