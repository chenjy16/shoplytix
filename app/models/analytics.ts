// 新增分析数据模型
export interface SalesAnalytics {
  dailySales: { date: string; amount: number }[];
  weeklySales: { week: string; amount: number }[];
  monthlySales: { month: string; amount: number }[];
  topSellingProducts: { id: string; name: string; sales: number }[];
  salesByCategory: { category: string; sales: number }[];
  customerRetention: number; // 百分比
  averageOrderCompletion: number; // 百分比
}

export interface InventoryAnalytics {
  stockLevels: { product: string; current: number; optimal: number }[];
  restockNeeded: { product: string; quantity: number }[];
  turnoverRate: { product: string; rate: number }[];
  excessInventory: { product: string; excess: number; daysInStock: number }[];
}

export interface CustomerAnalytics {
  newVsReturning: { new: number; returning: number };
  customerLifetimeValue: number;
  topCustomers: { id: string; name: string; totalSpent: number }[];
  customerSegments: { segment: string; count: number }[];
}

// 获取销售分析数据
export async function getSalesAnalytics(): Promise<SalesAnalytics> {
  // 模拟数据，实际应用中会从API获取
  return {
    dailySales: [
      { date: "2023-05-01", amount: 1250.75 },
      { date: "2023-05-02", amount: 1420.30 },
      { date: "2023-05-03", amount: 980.45 },
      { date: "2023-05-04", amount: 1560.20 },
      { date: "2023-05-05", amount: 1780.90 },
      { date: "2023-05-06", amount: 2100.50 },
      { date: "2023-05-07", amount: 1890.25 },
    ],
    weeklySales: [
      { week: "第1周", amount: 8950.75 },
      { week: "第2周", amount: 9420.30 },
      { week: "第3周", amount: 10980.45 },
      { week: "第4周", amount: 11560.20 },
    ],
    monthlySales: [
      { month: "1月", amount: 35250.75 },
      { month: "2月", amount: 38420.30 },
      { month: "3月", amount: 42980.45 },
      { month: "4月", amount: 45560.20 },
      { month: "5月", amount: 48780.90 },
    ],
    topSellingProducts: [
      { id: "prod-002", name: "牛仔裤", sales: 120 },
      { id: "prod-001", name: "高级T恤", sales: 95 },
      { id: "prod-003", name: "运动鞋", sales: 85 },
    ],
    salesByCategory: [
      { category: "服装", sales: 15420.50 },
      { category: "鞋类", sales: 8750.25 },
      { category: "配饰", sales: 4580.75 },
    ],
    customerRetention: 68.5,
    averageOrderCompletion: 92.3,
  };
}

// 获取库存分析数据
export async function getInventoryAnalytics(): Promise<InventoryAnalytics> {
  return {
    stockLevels: [
      { product: "高级T恤", current: 100, optimal: 120 },
      { product: "牛仔裤", current: 75, optimal: 80 },
      { product: "运动鞋", current: 50, optimal: 60 },
    ],
    restockNeeded: [
      { product: "高级T恤", quantity: 20 },
      { product: "运动鞋", quantity: 10 },
    ],
    turnoverRate: [
      { product: "高级T恤", rate: 2.5 },
      { product: "牛仔裤", rate: 3.2 },
      { product: "运动鞋", rate: 2.8 },
    ],
    excessInventory: [
      { product: "夏季帽子", excess: 15, daysInStock: 45 },
      { product: "太阳镜", excess: 8, daysInStock: 38 },
    ],
  };
}

// 获取客户分析数据
export async function getCustomerAnalytics(): Promise<CustomerAnalytics> {
  return {
    newVsReturning: { new: 35, returning: 65 },
    customerLifetimeValue: 2850.75,
    topCustomers: [
      { id: "cust-001", name: "张三", totalSpent: 4250.50 },
      { id: "cust-002", name: "李四", totalSpent: 3780.25 },
      { id: "cust-003", name: "王五", totalSpent: 3450.80 },
    ],
    customerSegments: [
      { segment: "高价值", count: 28 },
      { segment: "中等价值", count: 45 },
      { segment: "低价值", count: 75 },
      { segment: "一次性", count: 120 },
    ],
  };
}