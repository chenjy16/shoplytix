import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useMemo } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { getOrders, type Order } from "~/models/order";

export async function loader({ request }: LoaderFunctionArgs) {
  const orders = await getOrders();
  return json({ orders });
}

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");
  
  // 过滤订单数据
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch = search === "" || 
        order.id.toLowerCase().includes(search.toLowerCase()) || 
        order.customerName.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = status === "" || order.status === status;
      
      // 简单的日期筛选逻辑
      let matchDate = true;
      if (dateRange !== "") {
        const orderDate = new Date(order.orderDate);
        const today = new Date();
        
        if (dateRange === "today") {
          matchDate = orderDate.toDateString() === today.toDateString();
        } else if (dateRange === "yesterday") {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          matchDate = orderDate.toDateString() === yesterday.toDateString();
        }
        // 可以添加更多日期筛选逻辑
      }
      
      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, search, status, dateRange]);
  
  // 获取订单状态对应的样式和中文名称
  const getStatusBadge = (status: Order['status']) => {
    const statusMap = {
      'pending': { label: '待处理', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'processing': { label: '处理中', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      'shipped': { label: '已发货', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      'delivered': { label: '已送达', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      'cancelled': { label: '已取消', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };
    
    const { label, className } = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}>
        {label}
      </span>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">订单管理</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            查看和管理所有订单
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
            导出数据
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium">
            创建订单
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full sm:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="搜索订单..." 
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full sm:w-auto dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">所有状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="shipped">已发货</option>
                <option value="delivered">已送达</option>
                <option value="cancelled">已取消</option>
              </select>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full sm:w-auto dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">所有时间</option>
                <option value="today">今天</option>
                <option value="yesterday">昨天</option>
                <option value="last7days">最近7天</option>
                <option value="last30days">最近30天</option>
                <option value="thismonth">本月</option>
                <option value="lastmonth">上月</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 移动端卡片视图 */}
        <div className="block sm:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              没有找到匹配的订单
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.customerName}</div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">日期</div>
                      <div className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">金额</div>
                      <div className="font-medium">¥{order.totalAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">商品数量</div>
                      <div className="font-medium">{order.items.length}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Link to={`/orders/${order.id}`} className="text-blue-600 dark:text-blue-400 text-sm">
                      查看
                    </Link>
                    <button className="text-indigo-600 dark:text-indigo-400 text-sm">
                      更新状态
                    </button>
                    <button className="text-red-600 dark:text-red-400 text-sm">
                      取消
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 桌面端表格视图 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  订单号
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  客户
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  金额
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  商品数量
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    没有找到匹配的订单
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ¥{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {order.items.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        查看
                      </Link>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                        更新状态
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        取消
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredOrders.length}</span> 共 <span className="font-medium">{filteredOrders.length}</span> 条结果
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                上一页
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}