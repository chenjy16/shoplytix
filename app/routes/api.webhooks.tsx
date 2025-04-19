import { ActionFunction } from "@remix-run/cloudflare";
import { getShopify } from "~/shopify.server";

export const action: ActionFunction = async ({ request, context }) => {
  const shopify = getShopify(context.env);
  
  try {
    console.log("收到 Webhook 请求");
    const { topic, shop, webhookId } = await shopify.authenticate.webhook(request);
    
    console.log(`处理 webhook: ${topic} 来自商店: ${shop}, ID: ${webhookId}`);
    
    // 处理不同类型的 webhook
    switch (topic) {
      case "APP_UNINSTALLED":
        console.log(`商店 ${shop} 卸载了应用，正在清理会话...`);
        // 处理应用卸载 - 删除商店的会话
        const sessions = await shopify.sessionStorage.findSessionsByShop(shop);
        if (sessions.length > 0) {
          await shopify.sessionStorage.deleteSessions(sessions.map(session => session.id));
          console.log(`已删除 ${sessions.length} 个会话`);
        } else {
          console.log(`未找到商店 ${shop} 的会话`);
        }
        break;
      case "ORDERS_CREATE":
        console.log(`商店 ${shop} 创建了新订单`);
        // 处理订单创建
        break;
      default:
        console.log(`收到未处理的 webhook 类型: ${topic}`);
    }
    
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Webhook 处理错误:", error);
    return new Response(null, { status: 500 });
  }
};