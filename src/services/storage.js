/*
 * @Author: 卓文理
 * @Email: 531840344@qq.com
 * @Date: 2018-01-20 19:51:19
 */

'use strict';

export default {
    getItem(key) {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
        } catch (error) {
            console.warn(`Failed to get item from localStorage: ${key}`, error);
        }
        return null;
    },

    setItem(key, val) {
        try {
            window.localStorage.setItem(key, JSON.stringify(val));
            return key;
        } catch (error) {
            console.warn(`Failed to set item to localStorage: ${key}`, error);
            // 如果存储空间不足，尝试清理一些旧数据
            this.cleanOldData();
            try {
                window.localStorage.setItem(key, JSON.stringify(val));
                return key;
            } catch (retryError) {
                console.error(`Failed to set item after cleanup: ${key}`, retryError);
                throw retryError;
            }
        }
    },

    removeItem(key) {
        try {
            window.localStorage.removeItem(key);
            return key;
        } catch (error) {
            console.warn(`Failed to remove item from localStorage: ${key}`, error);
            return null;
        }
    },

    /**
     * 获取所有localStorage键
     * @returns {string[]} 所有键的数组
     */
    getAllKeys() {
        try {
            return Object.keys(window.localStorage);
        } catch (error) {
            console.warn('Failed to get all keys from localStorage', error);
            return [];
        }
    },

    /**
     * 获取localStorage使用情况
     * @returns {object} 存储使用统计
     */
    getStorageInfo() {
        try {
            let totalSize = 0;
            const keys = this.getAllKeys();

            keys.forEach(key => {
                const item = window.localStorage.getItem(key);
                if (item) {
                    totalSize += item.length;
                }
            });

            return {
                totalKeys: keys.length,
                totalSize: totalSize,
                totalSizeKB: Math.round(totalSize / 1024),
                availableSpace: this.getAvailableSpace()
            };
        } catch (error) {
            console.warn('Failed to get storage info', error);
            return { totalKeys: 0, totalSize: 0, totalSizeKB: 0, availableSpace: 0 };
        }
    },

    /**
     * 估算可用存储空间
     * @returns {number} 可用空间（字节）
     */
    getAvailableSpace() {
        try {
            const testKey = '__storage_test__';
            const testData = 'x'.repeat(1024); // 1KB测试数据
            let availableSpace = 0;

            // 二分查找可用空间
            let low = 0;
            let high = 10 * 1024; // 最大10MB

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const testValue = testData.repeat(mid);

                try {
                    window.localStorage.setItem(testKey, testValue);
                    window.localStorage.removeItem(testKey);
                    availableSpace = mid * 1024;
                    low = mid + 1;
                } catch (e) {
                    high = mid - 1;
                }
            }

            return availableSpace;
        } catch (error) {
            console.warn('Failed to estimate available space', error);
            return 0;
        }
    },

    /**
     * 清理旧数据（当存储空间不足时）
     */
    cleanOldData() {
        try {
            const keys = this.getAllKeys();
            const cacheKeys = keys.filter(key =>
                key.startsWith('GITHUBER_CACHE_') ||
                key.includes('_temp_') ||
                key.includes('_old_')
            );

            // 删除一些缓存数据
            cacheKeys.slice(0, Math.min(10, cacheKeys.length)).forEach(key => {
                this.removeItem(key);
            });

            console.log(`Cleaned ${cacheKeys.length} old cache items`);
        } catch (error) {
            console.warn('Failed to clean old data', error);
        }
    }
};

