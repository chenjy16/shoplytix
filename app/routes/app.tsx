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
  
  // 修改后的 App Bridge 初始化脚本
  const shopifyAppBridgeScript = `
    <script data-api-key="${apiKey}"></script>
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script>
      window.app = AppBridge.default({
        apiKey: "${apiKey}",
        host: "${host}",
        forceRedirect: true
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