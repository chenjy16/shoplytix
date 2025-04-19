import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await authenticate(request, context.env);
  
  return json({
    message: "欢迎使用 ShopLytix Shopify 应用",
    shop: session.shop
  });
};

export default function Index() {
  const { message } = useLoaderData<typeof loader>();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
      <p className="mb-4">这是您的 Shopify 应用主页。您可以从这里访问仪表盘和数据分析功能。</p>
      
      <div className="flex space-x-4 mt-6">
        <Link 
          to="/dashboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          进入仪表盘
        </Link>
        <Link 
          to="/analytics" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          查看数据分析
        </Link>
      </div>
    </div>
  );
}