import type { AppLoadContext } from "@remix-run/cloudflare";

export interface Env {
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SHOPIFY_APP_URL: string;
  SHOPIFY_KV_NAMESPACE: KVNamespace;
}

export function getLoadContext({
  request,
  context,
}: {
  request: Request;
  context: { cloudflare: { env: Env } };
}): AppLoadContext {
  return {
    env: context.cloudflare.env,
  };
}
