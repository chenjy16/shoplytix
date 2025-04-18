import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import StatCard from "~/components/charts/StatCard";
import LineChart from "~/components/charts/LineChart";
import BarChart from "~/components/charts/BarChart";
import PieChart from "~/components/charts/PieChart";
import { getSalesAnalytics, getInventoryAnalytics, getCustomerAnalytics } from "~/models/analytics";

export async function loader({ request }: LoaderFunctionArgs) {
  const salesAnalytics = await getSalesAnalytics();
  const inventoryAnalytics = await getInventoryAnalytics();
  const customerAnalytics = await getCustomerAnalytics();
  
  return json({
    salesAnalytics,
    inventoryAnalytics,
    customerAnalytics
  });
}

export default function Dashboard() {
  const { 
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
          title="销售总额" 
          value={`¥${salesAnalytics.monthlySales.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`} 
          icon="💰" 
          change={{ value: 12.5, isPositive: true }} 
        />
        <StatCard 
          title="客户留存率" 
          value={`${salesAnalytics.customerRetention}%`} 
          icon="🔄" 
          change={{ value: 3.7, isPositive: true }} 
        />
        <StatCard 
          title="订单完成率" 
          value={`${salesAnalytics.averageOrderCompletion}%`} 
          icon="✅" 
          change={{ value: 1.2, isPositive: true }} 
        />
        <StatCard 
          title="客户终身价值" 
          value={`¥${customerAnalytics.customerLifetimeValue.toLocaleString()}`} 
          icon="👤" 
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
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart 
          title="热销商品" 
          data={topProductsData} 
          color="#f59e0b"
        />
        <PieChart 
          title="客户细分" 
          data={customerSegmentsData} 
          color="#8b5cf6"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">库存状态</h3>
          <div className="space-y-4">
            {inventoryAnalytics.stockLevels.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{item.product}</span>
                <div className="w-2/3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (item.current / item.optimal) < 0.5 
                          ? 'bg-red-500' 
                          : (item.current / item.optimal) < 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`} 
                      style={{ width: `${Math.min(100, (item.current / item.optimal) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{item.current}</span>
                    <span>{item.optimal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">顶级客户</h3>
          <div className="space-y-4">
            {customerAnalytics.topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                    {customer.name.charAt(0)}
                  </div>
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{customer.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">¥{customer.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}