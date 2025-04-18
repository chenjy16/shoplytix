import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import DashboardLayout from "~/components/layout/DashboardLayout";
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

export default function Analytics() {
  const { salesAnalytics, inventoryAnalytics, customerAnalytics } = useLoaderData<typeof loader>();
  
  // 转换数据为图表格式
  const monthlySalesData = salesAnalytics.monthlySales.map(item => ({
    label: item.month,
    value: item.amount
  }));
  
  const weeklySalesData = salesAnalytics.weeklySales.map(item => ({
    label: item.week,
    value: item.amount
  }));
  
  const categorySalesData = salesAnalytics.salesByCategory.map(item => ({
    label: item.category,
    value: item.sales
  }));
  
  const stockLevelsData = inventoryAnalytics.stockLevels.map(item => ({
    label: item.product,
    value: item.current
  }));
  
  const turnoverRateData = inventoryAnalytics.turnoverRate.map(item => ({
    label: item.product,
    value: item.rate
  }));
  
  const customerSegmentsData = customerAnalytics.customerSegments.map(item => ({
    label: item.segment,
    value: item.count
  }));
  
  const topCustomersData = customerAnalytics.topCustomers.map(item => ({
    label: item.name,
    value: item.totalSpent
  }));
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">数据分析</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          深入分析店铺销售、库存和客户数据
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">销售分析</h2>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <LineChart 
            title="月度销售趋势" 
            data={monthlySalesData} 
          />
          <LineChart 
            title="周度销售趋势" 
            data={weeklySalesData} 
            color="#10b981"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChart 
            title="各品类销售占比" 
            data={categorySalesData} 
          />
          <BarChart 
            title="热销商品" 
            data={salesAnalytics.topSellingProducts.map(p => ({ label: p.name, value: p.sales }))} 
            color="#f59e0b"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">库存分析</h2>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <BarChart 
            title="当前库存水平" 
            data={stockLevelsData} 
            color="#3b82f6"
          />
          <BarChart 
            title="库存周转率" 
            data={turnoverRateData} 
            color="#8b5cf6"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChart 
            title="需要补货的商品" 
            data={inventoryAnalytics.restockNeeded.map(item => ({ 
              label: item.product, 
              value: item.quantity 
            }))} 
            color="#ef4444"
          />
          <BarChart 
            title="过剩库存" 
            data={inventoryAnalytics.excessInventory.map(item => ({ 
              label: item.product, 
              value: item.excess 
            }))} 
            color="#f97316"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">客户分析</h2>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <PieChart 
            title="客户细分" 
            data={customerSegmentsData} 
          />
          <BarChart 
            title="高价值客户" 
            data={topCustomersData} 
            color="#ec4899"
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">客户留存与转化</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">客户留存率</h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {salesAnalytics.customerRetention}%
              </div>
              <div className="mt-1 text-sm text-green-500">↑ 2.5% 相比上月</div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">订单完成率</h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {salesAnalytics.averageOrderCompletion}%
              </div>
              <div className="mt-1 text-sm text-green-500">↑ 1.2% 相比上月</div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">新客vs回头客</h4>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {customerAnalytics.newVsReturning.new}% / {customerAnalytics.newVsReturning.returning}%
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">新客户 / 回头客</div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">综合分析报告</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">业绩概要</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            根据当前数据分析，您的店铺在过去一个月内表现良好，销售额增长了12.5%。热销品类主要集中在服装类，
            其中牛仔裤是最畅销的单品。客户留存率保持在较高水平，说明您的产品和服务得到了客户认可。
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 mt-6">改进建议</h3>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
            <li>考虑增加运动鞋的库存，当前库存低于最佳水平</li>
            <li>关注夏季帽子和太阳镜的过剩库存问题，可能需要促销活动</li>
            <li>针对高价值客户群体开展专属营销活动，提高客户忠诚度</li>
            <li>优化商品分类，突出热销品类的展示位置</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}