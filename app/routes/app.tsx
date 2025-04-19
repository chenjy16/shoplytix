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
  
  return (
    <div>
      <Outlet />
    </div>
  );
}