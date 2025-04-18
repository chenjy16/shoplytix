import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "ShopLytix - 店铺数据分析平台" },
    { name: "description", content: "为您的店铺提供全面的数据分析和可视化服务" },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ShopLytix</h1>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">功能</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">价格</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">关于我们</a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="bg-blue-700 dark:bg-blue-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              店铺数据分析，一目了然
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              ShopLytix 帮助您深入了解店铺运营数据，优化销售策略，提升业绩表现。
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/dashboard"
                className="rounded-md bg-white px-6 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50"
              >
                进入仪表盘
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="mx-auto h-12 w-12 text-2xl">📊</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">销售数据分析</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                全面了解销售趋势、热销商品和客户购买行为。
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="mx-auto h-12 w-12 text-2xl">📈</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">业绩可视化</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                直观图表展示业绩指标，帮助您快速做出决策。
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="mx-auto h-12 w-12 text-2xl">🔍</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">库存监控</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                实时监控库存水平，避免缺货或库存积压。
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; 2023 ShopLytix. 保留所有权利。
          </p>
        </div>
      </footer>
    </div>
  );
}
