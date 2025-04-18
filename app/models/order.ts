export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
}

// 模拟获取订单数据
export async function getOrders(): Promise<Order[]> {
  // 在实际应用中，这里会从API获取数据
  return [
    {
      id: "ord-001",
      shopId: "shop-001",
      customerId: "cust-001",
      customerName: "张三",
      orderDate: "2023-05-15T08:30:00Z",
      status: "delivered",
      totalAmount: 299.99,
      items: [
        {
          id: "item-001",
          productId: "prod-001",
          productName: "高级T恤",
          quantity: 2,
          price: 149.99
        }
      ]
    },
    {
      id: "ord-002",
      shopId: "shop-001",
      customerId: "cust-002",
      customerName: "李四",
      orderDate: "2023-05-16T10:15:00Z",
      status: "shipped",
      totalAmount: 599.99,
      items: [
        {
          id: "item-002",
          productId: "prod-002",
          productName: "牛仔裤",
          quantity: 1,
          price: 299.99
        },
        {
          id: "item-003",
          productId: "prod-003",
          productName: "运动鞋",
          quantity: 1,
          price: 300.00
        }
      ]
    }
  ];
}

// 获取订单统计数据
export async function getOrderStats() {
  return {
    totalOrders: 245,
    totalRevenue: 28750.50,
    averageOrderValue: 117.35,
    pendingOrders: 18,
    monthlyGrowth: 12.5
  };
}