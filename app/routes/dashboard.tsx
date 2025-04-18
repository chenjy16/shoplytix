import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import StatCard from "~/components/charts/StatCard";
import LineChart from "~/components/charts/LineChart";
import BarChart from "~/components/charts/BarChart";
import PieChart from "~/components/charts/PieChart";
import { getOrderStats } from "~/models/order";
import { getProductStats } from "~/models/product";
import { getSalesAnalytics, getInventoryAnalytics, getCustomerAnalytics } from "~/models/analytics";

export async function loader({ request }: LoaderFunctionArgs) {
  const orderStats = await getOrderStats();
  const productStats = await getProductStats();
  const salesAnalytics = await getSalesAnalytics();
  const inventoryAnalytics = await getInventoryAnalytics();
  const customerAnalytics = await getCustomerAnalytics();
  
  return json({
    orderStats,
    productStats,
    salesAnalytics,
    inventoryAnalytics,
    customerAnalytics
  });
}

export default function Dashboard() {
  const { 
    orderStats, 
    productStats, 
    salesAnalytics, 
    inventoryAnalytics, 
    customerAnalytics 
  } = useLoaderData<typeof loader>();
  
  // 转换数据为图表格式
  const dailySalesData = salesAnalytics.dailySales.map(item => ({
    label: item.date.split('-')[2], // 只显示日期
    value: item.amount
  }));
  
  const categorySalesData = salesAnalytics.salesByCategory.map(item => ({
    label: item.category,
    value: item.sales
  }));
  
  const topProductsData = salesAnalytics.topSellingProducts.map(item => ({
    label: item.name,
    value: item.sales
  }));
  
  const customerSegmentsData = customerAnalytics.customerSegments.map(item => ({
    label: item.segment,
    value: item.count
  }));
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          查看您店铺的关键指标和业绩数据
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="总订单数" 
          value={orderStats.totalOrders} 
          icon="📦" 
          change={{ value: 8.2, isPositive: true }} 
        />
        <StatCard 
          title="总收入" 
          value={`¥${orderStats.totalRevenue.toLocaleString()}`} 
          icon="💰" 
          change={{ value: 12.5, isPositive: true }} 
        />
        <StatCard 
          title="平均订单价值" 
          value={`¥${orderStats.averageOrderValue.toLocaleString()}`} 
          icon="🛒" 
          change={{ value: 3.7, isPositive: true }} 
        />
        <StatCard 
          title="待处理订单" 
          value={orderStats.pendingOrders} 
          icon="⏳" 
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart 
          title="最近7天销售趋势" 
          data={dailySalesData} 
        />
        <BarChart 
          title="各品类销售额" 
          data={categorySalesData} 
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">商品概览</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="总商品数" 
            value={productStats.totalProducts} 
            icon="🏷️" 
          />
          <StatCard 
            title="低库存商品" 
            value={productStats.lowStockProducts} 
            icon="⚠️" 
          />
          <StatCard 
            title="热销品类" 
            value={productStats.topSellingCategory} 
            icon="🔥" 
          />
          <StatCard 
            title="本月新品" 
            value={productStats.newProductsThisMonth} 
            icon="✨" 
          />
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart 
          title="热销商品" 
          data={topProductsData} 
          color="#10b981"
        />
        <PieChart 
          title="客户细分" 
          data={customerSegmentsData} 
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">客户洞察</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">客户留存率</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {salesAnalytics.customerRetention}%
              </div>
              <div className="ml-2 text-sm text-green-500">↑ 2.5%</div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              相比上月
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">客户终身价值</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ¥{customerAnalytics.customerLifetimeValue.toLocaleString()}
              </div>
              <div className="ml-2 text-sm text-green-500">↑ 5.8%</div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              相比上季度
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">新客vs回头客</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {customerAnalytics.newVsReturning.returning}%
              </div>
              <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                回头客比例
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              新客户: {customerAnalytics.newVsReturning.new}%
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}