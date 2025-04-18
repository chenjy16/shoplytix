export interface Shop {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

// 模拟获取店铺数据
export async function getShopInfo(shopId: string): Promise<Shop> {
  // 在实际应用中，这里会从API获取数据
  return {
    id: shopId,
    name: "时尚精品店",
    description: "提供高品质的时尚服装和配饰",
    owner: "王店长",
    createdAt: "2022-10-01T00:00:00Z",
    address: "北京市朝阳区建国路88号",
    contactEmail: "contact@fashionshop.com",
    contactPhone: "010-12345678"
  };
}