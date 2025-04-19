import { shopifyApp } from "@shopify/shopify-app-remix";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import { CloudflareKVSessionStorage } from "~/lib/cloudflare-kv-session-storage";
import { Env } from "~/load-context";

export const shopify = ({ env }: { env: Env }) => {
  const kvNamespace = env.SHOPIFY_KV_NAMESPACE;
  
  if (!kvNamespace) {
    throw new Error("SHOPIFY_KV_NAMESPACE environment variable is required");
  }
  
  // 先声明变量
  let shopifyConfig: ReturnType<typeof shopifyApp>;
  
  // 然后赋值
  shopifyConfig = shopifyApp({
    apiKey: env.SHOPIFY_API_KEY || "",
    apiSecretKey: env.SHOPIFY_API_SECRET || "",
    scopes: [
      "read_products", 
      "write_products", 
      "read_orders", 
      "write_orders",
      "read_customers",
      "read_analytics"
    ],
    appUrl: env.SHOPIFY_APP_URL || "",
    shopifyApiVersion: "2023-10",
    sessionStorage: new CloudflareKVSessionStorage(kvNamespace),
    distribution: "app",
    restResources,
    webhooks: {
      APP_UNINSTALLED: {
        deliveryMethod: "http",
        callbackUrl: "/api/webhooks",
      },
    },
    hooks: {
      afterAuth: async ({ session }) => {
        // 应用安装后的钩子
        shopifyConfig.registerWebhooks({ session });
      },
    },
    future: {
      unstable_newEmbeddedAuthStrategy: true,
    },
  });
  
  return shopifyConfig;
};

// 创建一个获取 shopify 实例的函数
let shopifyInstance: ReturnType<typeof shopifyApp>;

export function getShopify(env: Env) {
  if (!shopifyInstance) {
    shopifyInstance = shopify({ env });
  }
  return shopifyInstance;
}

// 导出一个辅助函数，用于在路由中获取 shopify 实例
export function authenticate(request: Request, env: Env) {
  const shopifyInstance = getShopify(env);
  return shopifyInstance.authenticate.admin(request);
}