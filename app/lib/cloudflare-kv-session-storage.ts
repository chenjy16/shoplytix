import { SessionStorage, Session } from "@shopify/shopify-app-remix";

// 确保使用 export 关键字导出类
export class CloudflareKVSessionStorage implements SessionStorage {
  constructor(private namespace: KVNamespace, private prefix: string = "shopify_session:") {}

  async storeSession(session: Session): Promise<boolean> {
    try {
      const key = this.prefix + session.id;
      await this.namespace.put(key, JSON.stringify(session), {
        expirationTtl: 60 * 60 * 24 * 7, // 7天过期
      });
      return true;
    } catch (error) {
      console.error("存储会话失败:", error);
      return false;
    }
  }

  async loadSession(id: string): Promise<Session | undefined> {
    try {
      const key = this.prefix + id;
      const data = await this.namespace.get(key);
      
      if (!data) {
        return undefined;
      }
      
      return JSON.parse(data) as Session;
    } catch (error) {
      console.error("加载会话失败:", error);
      return undefined;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      const key = this.prefix + id;
      await this.namespace.delete(key);
      return true;
    } catch (error) {
      console.error("删除会话失败:", error);
      return false;
    }
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    try {
      await Promise.all(ids.map(id => this.deleteSession(id)));
      return true;
    } catch (error) {
      console.error("批量删除会话失败:", error);
      return false;
    }
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      // 列出所有会话
      const { keys } = await this.namespace.list({ prefix: this.prefix });
      const sessions: Session[] = [];
      
      // 获取所有会话数据
      for (const key of keys) {
        const data = await this.namespace.get(key.name);
        if (data) {
          const session = JSON.parse(data) as Session;
          if (session.shop === shop) {
            sessions.push(session);
          }
        }
      }
      
      return sessions;
    } catch (error) {
      console.error("查找商店会话失败:", error);
      return [];
    }
  }
}