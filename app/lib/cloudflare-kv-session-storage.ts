import { SessionStorage, Session } from "@shopify/shopify-app-remix";

export class CloudflareKVSessionStorage implements SessionStorage {
  constructor(private namespace: KVNamespace, private prefix: string = "shopify_session:") {}

  async storeSession(session: Session): Promise<boolean> {
    try {
      const key = this.prefix + session.id;
      await this.namespace.put(key, JSON.stringify(session), {
        expirationTtl: 60 * 60 * 24 * 7, // 7 days in seconds
      });
      return true;
    } catch (error) {
      console.error("Failed to store session:", error);
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
      console.error("Failed to load session:", error);
      return undefined;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      const key = this.prefix + id;
      await this.namespace.delete(key);
      return true;
    } catch (error) {
      console.error("Failed to delete session:", error);
      return false;
    }
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    try {
      const promises = ids.map(id => this.deleteSession(id));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error("Failed to delete sessions:", error);
      return false;
    }
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      // 列出所有会话并过滤
      // 注意：这种方法在会话数量大时可能效率不高
      const { keys } = await this.namespace.list({ prefix: this.prefix });
      const sessions: Session[] = [];
      
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
      console.error("Failed to find sessions by shop:", error);
      return [];
    }
  }
}