import type { AppLoadContext } from "@remix-run/cloudflare";
import { type PlatformProxy } from "wrangler";

// 当在开发环境中运行时，`process.env.NODE_ENV` 会被设置为 "development"
// 当在生产环境中运行时，`process.env.NODE_ENV` 会被设置为 "production"
const MODE = process.env.NODE_ENV;

// 我们可以使用 `process.env` 来获取环境变量
// 但是，为了使 TypeScript 开心，我们需要添加一些类型
declare global {
  interface ProcessEnv {
    SHOPIFY_API_KEY?: string;
    SHOPIFY_API_SECRET?: string;
    SHOPIFY_APP_URL?: string;
  }

  var process: {
    env: ProcessEnv;
  };
}

// 当使用 `wrangler` 运行时，我们可以使用 `wrangler.toml` 中的环境变量
// 当使用 `miniflare` 运行时，我们可以使用 `.env` 文件中的环境变量
// 了解更多：https://miniflare.dev/core/variables

// 我们可以使用 `process.env` 来获取环境变量
// 但是，为了使 TypeScript 开心，我们需要添加一些类型
export type Env = {
  SHOPIFY_API_KEY?: string;
  SHOPIFY_API_SECRET?: string;
  SHOPIFY_APP_URL?: string;
  SHOPIFY_KV_NAMESPACE?: KVNamespace;
};

type GetLoadContextFunction = (
  request: Request,
  env: Env & PlatformProxy<Env>,
  ctx: ExecutionContext
) => AppLoadContext;

// 导出一个函数，该函数将在每个请求中调用，以获取上下文
export const getLoadContext: GetLoadContextFunction = (request, env) => {
  return {
    env,
  };
};
