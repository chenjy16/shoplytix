import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, Scripts } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, context }) => {
  console.log("App 路由被访问:", request.url);
  
  try {
    const { session } = await authenticate(request, context.env);
    
    // 获取 host 参数，这对于嵌入式应用很重要
    const url = new URL(request.url);
    const host = url.searchParams.get("host");
    
    return json({
      shop: session.shop,
      host: host,
      apiKey: context.env.SHOPIFY_API_KEY,
    });
  } catch (error) {
    console.error("App 路由认证失败:", error);
    throw error;
  }
};

export default function App() {
  const { shop, apiKey, host } = useLoaderData<typeof loader>();
  
  console.log("渲染 App 组件，商店:", shop, "host:", host);
  
  // 修改 App Bridge 初始化脚本
  const shopifyAppBridgeScript = `
    <script>
      window.shopify = {
        apiKey: "${apiKey}",
        host: "${host || ''}",
        shop: "${shop}",
        forceRedirect: true
      };
    </script>
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge/3.7.7/app-bridge.js" defer></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        if (window.shopify && window.shopify.host) {
          try {
            var AppBridge = window['app-bridge'];
            var createApp = AppBridge.default;
            var app = createApp({
              apiKey: window.shopify.apiKey,
              host: window.shopify.host,
              forceRedirect: true
            });
            
            // 添加调试信息
            console.log("App Bridge 初始化完成", {
              apiKey: window.shopify.apiKey,
              host: window.shopify.host,
              shop: window.shopify.shop
            });
          } catch (error) {
            console.error("App Bridge 初始化失败:", error);
          }
        } else {
          console.error("shopify 配置对象不存在或 host 为空");
        }
      });
    </script>
  `;
  
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: shopifyAppBridgeScript }} />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Scripts />
    </div>
  );
}