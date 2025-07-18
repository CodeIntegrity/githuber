/*
 * @Author: 卓文理
 * @Email: 531840344@qq.com
 * @Date: 2025-07-18 11:30:00
 */

'use strict';

import storage from './storage';

/**
 * 缓存管理器
 * 提供智能缓存策略，包括过期时间、内存缓存和持久化缓存
 */
class CacheManager {
    constructor() {
        // 内存缓存，用于快速访问
        this.memoryCache = new Map();
        // 缓存配置
        this.config = {
            // 默认缓存时间（毫秒）
            defaultTTL: 30 * 60 * 1000, // 30分钟
            // 内存缓存最大条目数
            maxMemoryItems: 100,
            // 缓存键前缀
            keyPrefix: 'GITHUBER_CACHE_'
        };
    }

    /**
     * 生成缓存键
     * @param {string} key 原始键
     * @returns {string} 带前缀的缓存键
     */
    generateKey(key) {
        return `${this.config.keyPrefix}${key}`;
    }

    /**
     * 设置缓存
     * @param {string} key 缓存键
     * @param {any} data 缓存数据
     * @param {number} ttl 过期时间（毫秒），默认使用配置的TTL
     * @param {boolean} memoryOnly 是否仅存储在内存中
     */
    set(key, data, ttl = this.config.defaultTTL, memoryOnly = false) {
        const cacheKey = this.generateKey(key);
        const expireTime = Date.now() + ttl;
        
        const cacheItem = {
            data,
            expireTime,
            timestamp: Date.now()
        };

        // 存储到内存缓存
        this.memoryCache.set(cacheKey, cacheItem);

        // 清理内存缓存（LRU策略）
        this.cleanMemoryCache();

        // 存储到持久化缓存（除非指定仅内存）
        if (!memoryOnly) {
            try {
                storage.setItem(cacheKey, cacheItem);
            } catch (error) {
                console.warn('Failed to set persistent cache:', error);
            }
        }
    }

    /**
     * 获取缓存
     * @param {string} key 缓存键
     * @returns {any|null} 缓存数据，如果不存在或已过期返回null
     */
    get(key) {
        const cacheKey = this.generateKey(key);
        
        // 首先检查内存缓存
        let cacheItem = this.memoryCache.get(cacheKey);
        
        // 如果内存中没有，检查持久化缓存
        if (!cacheItem) {
            try {
                cacheItem = storage.getItem(cacheKey);
                if (cacheItem) {
                    // 将持久化缓存加载到内存中
                    this.memoryCache.set(cacheKey, cacheItem);
                }
            } catch (error) {
                console.warn('Failed to get persistent cache:', error);
                return null;
            }
        }

        // 检查缓存是否存在且未过期
        if (cacheItem && cacheItem.expireTime > Date.now()) {
            return cacheItem.data;
        }

        // 缓存已过期，清理
        if (cacheItem) {
            this.delete(key);
        }

        return null;
    }

    /**
     * 删除缓存
     * @param {string} key 缓存键
     */
    delete(key) {
        const cacheKey = this.generateKey(key);
        
        // 从内存缓存中删除
        this.memoryCache.delete(cacheKey);
        
        // 从持久化缓存中删除
        try {
            storage.removeItem(cacheKey);
        } catch (error) {
            console.warn('Failed to delete persistent cache:', error);
        }
    }

    /**
     * 检查缓存是否存在且有效
     * @param {string} key 缓存键
     * @returns {boolean} 是否存在有效缓存
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * 清理内存缓存（LRU策略）
     */
    cleanMemoryCache() {
        if (this.memoryCache.size <= this.config.maxMemoryItems) {
            return;
        }

        // 按时间戳排序，删除最旧的条目
        const entries = Array.from(this.memoryCache.entries())
            .sort((a, b) => a[1].timestamp - b[1].timestamp);

        const deleteCount = this.memoryCache.size - this.config.maxMemoryItems;
        for (let i = 0; i < deleteCount; i++) {
            this.memoryCache.delete(entries[i][0]);
        }
    }

    /**
     * 清理所有过期缓存
     */
    cleanExpiredCache() {
        const now = Date.now();
        
        // 清理内存缓存中的过期项
        for (const [key, item] of this.memoryCache.entries()) {
            if (item.expireTime <= now) {
                this.memoryCache.delete(key);
            }
        }

        // 清理持久化缓存中的过期项
        try {
            const allKeys = storage.getAllKeys();
            allKeys.forEach(key => {
                if (key.startsWith(this.config.keyPrefix)) {
                    const item = storage.getItem(key);
                    if (item && item.expireTime <= now) {
                        storage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.warn('Failed to clean expired persistent cache:', error);
        }
    }

    /**
     * 清空所有缓存
     */
    clear() {
        // 清空内存缓存
        this.memoryCache.clear();
        
        // 清空持久化缓存
        try {
            const allKeys = storage.getAllKeys();
            allKeys.forEach(key => {
                if (key.startsWith(this.config.keyPrefix)) {
                    storage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear persistent cache:', error);
        }
    }

    /**
     * 获取缓存统计信息
     * @returns {object} 缓存统计
     */
    getStats() {
        return {
            memoryItems: this.memoryCache.size,
            maxMemoryItems: this.config.maxMemoryItems,
            defaultTTL: this.config.defaultTTL
        };
    }
}

// 创建全局缓存管理器实例
const cacheManager = new CacheManager();

// 定期清理过期缓存（每10分钟）
setInterval(() => {
    cacheManager.cleanExpiredCache();
}, 10 * 60 * 1000);

export default cacheManager;
