import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
// 移除直接导入
// import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(async () => {
  // 使用动态导入
  const { default: tsconfigPaths } = await import("vite-tsconfig-paths");

  return {
    plugins: [
      cloudflareDevProxyVitePlugin({
        getLoadContext,
      }),
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
    ],
    ssr: {
      resolve: {
        conditions: ["workerd", "worker", "browser"],
      },
    },
    resolve: {
      mainFields: ["browser", "module", "main"],
    },
    build: {
      minify: true,
    },
  };
});
