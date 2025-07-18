/*
 * @Author: 卓文理
 * @Email: 531840344@qq.com
 * @Date: 2025-07-18 11:45:00
 */

'use strict';

/**
 * 性能优化工具函数集合
 */

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 请求动画帧节流
 * @param {Function} func 要执行的函数
 * @returns {Function} 节流后的函数
 */
export function rafThrottle(func) {
    let requestId;
    return function executedFunction(...args) {
        if (requestId) {
            cancelAnimationFrame(requestId);
        }
        requestId = requestAnimationFrame(() => {
            func.apply(this, args);
        });
    };
}

/**
 * 延迟执行函数
 * @param {number} ms 延迟时间（毫秒）
 * @returns {Promise} Promise对象
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 批量处理函数
 * @param {Array} items 要处理的项目数组
 * @param {Function} processor 处理函数
 * @param {number} batchSize 批次大小
 * @param {number} delayMs 批次间延迟时间
 * @returns {Promise} Promise对象
 */
export async function batchProcess(items, processor, batchSize = 10, delayMs = 0) {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(processor));
        results.push(...batchResults);
        
        if (delayMs > 0 && i + batchSize < items.length) {
            await delay(delayMs);
        }
    }
    
    return results;
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
    constructor(name) {
        this.name = name;
        this.startTime = 0;
        this.endTime = 0;
        this.marks = new Map();
    }

    /**
     * 开始监控
     */
    start() {
        this.startTime = performance.now();
        if (performance.mark) {
            performance.mark(`${this.name}-start`);
        }
        return this;
    }

    /**
     * 结束监控
     */
    end() {
        this.endTime = performance.now();
        if (performance.mark) {
            performance.mark(`${this.name}-end`);
        }
        if (performance.measure) {
            performance.measure(this.name, `${this.name}-start`, `${this.name}-end`);
        }
        return this;
    }

    /**
     * 添加标记点
     */
    mark(label) {
        const time = performance.now();
        this.marks.set(label, time);
        if (performance.mark) {
            performance.mark(`${this.name}-${label}`);
        }
        return this;
    }

    /**
     * 获取执行时间
     */
    getDuration() {
        return this.endTime - this.startTime;
    }

    /**
     * 获取标记点之间的时间
     */
    getMarkDuration(startMark, endMark) {
        const start = this.marks.get(startMark);
        const end = this.marks.get(endMark);
        return end && start ? end - start : 0;
    }

    /**
     * 输出性能报告
     */
    report() {
        const duration = this.getDuration();
        console.group(`Performance Report: ${this.name}`);
        console.log(`Total Duration: ${duration.toFixed(2)}ms`);
        
        if (this.marks.size > 0) {
            console.log('Marks:');
            for (const [label, time] of this.marks) {
                console.log(`  ${label}: ${(time - this.startTime).toFixed(2)}ms`);
            }
        }
        
        console.groupEnd();
        return duration;
    }
}

/**
 * 内存使用监控
 */
export function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
    }
    return null;
}

/**
 * 检查是否为慢设备
 */
export function isSlowDevice() {
    // 检查硬件并发数
    const cores = navigator.hardwareConcurrency || 1;
    
    // 检查内存
    const memory = navigator.deviceMemory || 1;
    
    // 检查连接速度
    const connection = navigator.connection;
    const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData
    );
    
    return cores <= 2 || memory <= 2 || isSlowConnection;
}

/**
 * 图片预加载
 * @param {string|Array} urls 图片URL或URL数组
 * @returns {Promise} Promise对象
 */
export function preloadImages(urls) {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    
    return Promise.all(urlArray.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }));
}

/**
 * 懒加载观察器
 */
export function createLazyObserver(callback, options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    if (!window.IntersectionObserver) {
        // 不支持IntersectionObserver，直接执行回调
        return {
            observe: (element) => callback([{ target: element, isIntersecting: true }]),
            unobserve: () => {},
            disconnect: () => {}
        };
    }
    
    return new IntersectionObserver(callback, observerOptions);
}

/**
 * 资源优先级提示
 * @param {string} url 资源URL
 * @param {string} as 资源类型
 * @param {string} priority 优先级 (high, low)
 */
export function preloadResource(url, as = 'fetch', priority = 'low') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    if (priority && link.fetchPriority !== undefined) {
        link.fetchPriority = priority;
    }
    
    document.head.appendChild(link);
    return link;
}

export default {
    debounce,
    throttle,
    rafThrottle,
    delay,
    batchProcess,
    PerformanceMonitor,
    getMemoryUsage,
    isSlowDevice,
    preloadImages,
    createLazyObserver,
    preloadResource
};
