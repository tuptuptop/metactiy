const redis = require('redis');
const config = require('../config');

const client = redis.createClient({
    socket: {
        host: config.redis.host,
        port: config.redis.port
    },
    password: config.redis.password || undefined,
    database: config.redis.db
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

client.on('connect', () => {
    console.log('Redis Client Connected');
});

let isConnected = false;

const redisClient = {
    async connect() {
        if (!isConnected) {
            await client.connect();
            isConnected = true;
        }
        return client;
    },
    
    async disconnect() {
        if (isConnected) {
            await client.disconnect();
            isConnected = false;
        }
    },
    
    async get(key) {
        await this.connect();
        const value = await client.get(key);
        try {
            return value ? JSON.parse(value) : null;
        } catch {
            return value;
        }
    },
    
    async set(key, value, expireSeconds = null) {
        await this.connect();
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (expireSeconds) {
            await client.setEx(key, expireSeconds, stringValue);
        } else {
            await client.set(key, stringValue);
        }
    },
    
    async del(key) {
        await this.connect();
        await client.del(key);
    },
    
    async exists(key) {
        await this.connect();
        return await client.exists(key);
    },
    
    async expire(key, seconds) {
        await this.connect();
        await client.expire(key, seconds);
    },
    
    async ttl(key) {
        await this.connect();
        return await client.ttl(key);
    },
    
    async incr(key) {
        await this.connect();
        return await client.incr(key);
    },
    
    async decr(key) {
        await this.connect();
        return await client.decr(key);
    },
    
    async hSet(key, field, value) {
        await this.connect();
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        await client.hSet(key, field, stringValue);
    },
    
    async hGet(key, field) {
        await this.connect();
        const value = await client.hGet(key, field);
        try {
            return value ? JSON.parse(value) : null;
        } catch {
            return value;
        }
    },
    
    async hGetAll(key) {
        await this.connect();
        const data = await client.hGetAll(key);
        const result = {};
        for (const [field, value] of Object.entries(data)) {
            try {
                result[field] = JSON.parse(value);
            } catch {
                result[field] = value;
            }
        }
        return result;
    },
    
    async hDel(key, field) {
        await this.connect();
        await client.hDel(key, field);
    },
    
    async lPush(key, value) {
        await this.connect();
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return await client.lPush(key, stringValue);
    },
    
    async rPush(key, value) {
        await this.connect();
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return await client.rPush(key, stringValue);
    },
    
    async lRange(key, start, stop) {
        await this.connect();
        const values = await client.lRange(key, start, stop);
        return values.map(v => {
            try {
                return JSON.parse(v);
            } catch {
                return v;
            }
        });
    },
    
    client
};

module.exports = redisClient;
