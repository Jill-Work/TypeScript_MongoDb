import redis from "redis-typescript";
import s from "./index"
import { env } from "../config/env";
import { createClient } from 'redis';

export default class UserCacheRequest {
  public redisClient = createClient();

  constructor() {
  }

  getCacheData = async (id: string) => {
    try {
      await this.redisClient.connect();
      const cacheData = await this.redisClient.GET(`cacheData.${id}`);
      console.log("Cache Hit");
      return cacheData;
    } catch (error) {
      return error;
    } finally {
      this.redisClient.quit();
    }
  };

  setCacheData = async (id: string, newCacheData: object) => {
    try {
      await this.redisClient.connect();
      const cacheData = await this.redisClient.SET(
        `cacheData.${id}`,
        JSON.stringify(newCacheData)
      );
      const cacheId: string = `cacheData.${id}`;
      const seconds: number = parseInt(env.CACHE_EXPIRE_TIME) ;
      await this.redisClient.expire(cacheId, seconds);
      console.log("Cache Miss And Set");
      return cacheData;
    } catch (error) {
      return error;
    } finally {
      this.redisClient.quit();
    }
  };

  deleteCacheData = async (id: string) => {
    try {
      await this.redisClient.connect();
      await this.redisClient.DEL(`cacheData.${id}`);
      console.log("Delete Cache");
    } catch (error) {
      return error;
    } finally {
      this.redisClient.quit();
    }
  };
}
