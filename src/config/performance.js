/*
 * @Author: 卓文理
 * @Email: 531840344@qq.com
 * @Date: 2025-07-18 12:00:00
 */

'use strict';

/**
 * 性能优化配置
 */
export default {
    // 缓存配置
    cache: {
        // GitHub Trending缓存时间（毫秒）
        trending: {
            daily: 2 * 60 * 60 * 1000,    // 2小时
            weekly: 6 * 60 * 60 * 1000,   // 6小时
            monthly: 12 * 60 * 60 * 1000  // 12小时
        },
        // 搜索建议缓存时间
        suggestions: 5 * 60 * 1000,       // 5分钟
        // 用户配置缓存时间
        userConfig: 24 * 60 * 60 * 1000,  // 24小时
        // 最大缓存条目数
        maxItems: 100
    },

    // 懒加载配置
    lazyLoad: {
        // 图片懒加载阈值
        threshold: 0.1,
        // 根边距
        rootMargin: '50px',
        // 是否启用懒加载
        enabled: true
    },

    // 虚拟滚动配置
    virtualScroll: {
        // 启用虚拟滚动的最小项目数
        minItems: 50,
        // 每项默认高度
        itemHeight: 120,
        // 缓冲区大小
        buffer: 5,
        // 是否启用虚拟滚动
        enabled: true
    },

    // 防抖节流配置
    debounce: {
        // 搜索输入防抖时间
        search: 300,
        // 窗口大小调整防抖时间
        resize: 250,
        // 滚动事件节流时间
        scroll: 16
    },

    // 网络请求配置
    network: {
        // 请求超时时间
        timeout: 10000,
        // 最大重试次数
        maxRetries: 3,
        // 重试延迟时间
        retryDelay: 1000,
        // 并发请求限制
        concurrency: 3
    },

    // 性能监控配置
    monitoring: {
        // 是否启用性能监控
        enabled: process.env.NODE_ENV === 'development',
        // 慢操作阈值（毫秒）
        slowThreshold: 1000,
        // 内存使用警告阈值（MB）
        memoryWarningThreshold: 100
    },

    // 设备适配配置
    device: {
        // 慢设备优化
        slowDevice: {
            // 减少动画
            reduceAnimations: true,
            // 降低图片质量
            lowerImageQuality: true,
            // 减少并发请求
            reduceConcurrency: true,
            // 增加缓存时间
            increaseCacheTime: true
        }
    },

    // 预加载配置
    preload: {
        // 是否启用关键资源预加载
        enabled: true,
        // 预加载的图片数量限制
        imageLimit: 10,
        // 预加载优先级
        priority: 'low'
    }
};
