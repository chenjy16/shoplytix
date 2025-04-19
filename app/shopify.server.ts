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
    shopifyApiVersion: "2025-04", // 更新为最新版本
    sessionStorage: new CloudflareKVSessionStorage(kvNamespace),
    distribution: "app",
    restResources,
    webhooks: {
      APP_UNINSTALLED: {
        deliveryMethod: "https",
        callbackUrl: "/api/webhooks",
      },
    },
    hooks: {
      afterAuth: async ({ session, request, response }) => {
        console.log("授权成功，执行 afterAuth 钩子");
        
        // 注册 webhooks
        shopifyConfig.registerWebhooks({ session });
        
        // 获取请求的主机名
        const host = new URL(request.url).searchParams.get("host");
        const shop = session.shop;
        
        console.log(`重定向到应用主页: /app?shop=${shop}&host=${host}`);
        
        // 重定向到应用主页
        return response.redirect(`/app?shop=${shop}&host=${host}`);
      },
    },
    future: {
      unstable_newEmbeddedAuthStrategy: true,
    },
  });
  
  return shopifyConfig;
};


let shopifyInstance: ReturnType<typeof shopifyApp>;

export function getShopify(env: Env) {
  if (!shopifyInstance) {
    shopifyInstance = shopify({ env });
  }
  return shopifyInstance;
}


export function authenticate(request: Request, env: Env) {
  const shopifyInstance = getShopify(env);
  return shopifyInstance.authenticate.admin(request);
}