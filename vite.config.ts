import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import { getLoadContext } from "./load-context";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(async () => {
  // 使用动态导入
  const { default: tsconfigPaths } = await import("vite-tsconfig-paths");
  // 动态导入 tailwindcss 和 autoprefixer
  const { default: tailwindcss } = await import("tailwindcss");
  const { default: autoprefixer } = await import("autoprefixer");

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
        serverModuleFormat: "esm",
        buildDirectory: "build", // 确保这里设置正确
      }),
      tsconfigPaths(),
    ],
    // 修改 CSS 相关配置，使用动态导入的模块
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
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
