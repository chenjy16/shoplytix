import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await authenticate(request, context.env);
  
  return json({
    shop: session.shop,
    apiKey: context.env.SHOPIFY_API_KEY,
  });
};

export default function App() {
  const { shop, apiKey } = useLoaderData<typeof loader>();
  
  // 添加 Shopify App Bridge 脚本
  const shopifyAppBridgeScript = `
    <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
    <script>
      var AppBridge = window['app-bridge'];
      var createApp = AppBridge.default;
      var app = createApp({
        apiKey: '${apiKey}',
        shopOrigin: '${shop}',
        forceRedirect: true
      });
    </script>
  `;
  
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: shopifyAppBridgeScript }} />
      <Outlet />
    </div>
  );
}