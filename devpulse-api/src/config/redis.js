import Redis from 'ioredis';
import {logger} from './logger.js';
export const redis =  new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379',{
    maxRetriesPerRequest: null,
    lazyConnect:true,
});
redis.on('connect', ()=>logger.info('Redis Connected'));
redis.on('error',(err)=>logger.error({err},' redis error'));
redis.on('reconnect',()=>logger.warn('Redis reconnecting..'));
export async function cacheGet(key){
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
}
export async function cacheSet(key,value,ttlSeconds = 60){
    await redis.set(key,JSON.stringify(value),'EX',ttlSeconds);
}
export async function cacheDelete(...keys){
    if(keys.length)await redis.del(...keys);
}
export async function cacheDelPattern(pattern){
    const keys = await redis.keys(pattern);
    if(keys.length) await redis.del(...keys);
}
