export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  imageUrl: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟获取商品数据
export async function getProducts(): Promise<Product[]> {
  // 在实际应用中，这里会从API获取数据
  return [
    {
      id: "prod-001",
      name: "高级T恤",
      description: "100%纯棉，舒适透气",
      price: 149.99,
      inventory: 100,
      category: "服装",
      imageUrl: "/images/tshirt.jpg",
      shopId: "shop-001",
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: "2023-04-20T00:00:00Z"
    },
    {
      id: "prod-002",
      name: "牛仔裤",
      description: "经典款式，耐穿舒适",
      price: 299.99,
      inventory: 75,
      category: "服装",
      imageUrl: "/images/jeans.jpg",
      shopId: "shop-001",
      createdAt: "2023-02-10T00:00:00Z",
      updatedAt: "2023-04-22T00:00:00Z"
    },
    {
      id: "prod-003",
      name: "运动鞋",
      description: "轻便透气，适合日常运动",
      price: 300.00,
      inventory: 50,
      category: "鞋类",
      imageUrl: "/images/shoes.jpg",
      shopId: "shop-001",
      createdAt: "2023-03-05T00:00:00Z",
      updatedAt: "2023-04-25T00:00:00Z"
    }
  ];
}

// 获取商品统计数据
export async function getProductStats() {
  return {
    totalProducts: 87,
    lowStockProducts: 12,
    topSellingCategory: "服装",
    averagePrice: 199.50,
    newProductsThisMonth: 8
  };
}