/*
 * @Author: 卓文理
 * @Email: 531840344@qq.com
 * @Date: 2018-01-18 10:53:12
 */

'use strict';

import Promise from 'bluebird';
import { get } from '../../services/fetch';
import * as types from '../types';
import storage from '../../services/storage';
import cacheManager from '../../services/cache';

const time = new Date();
const year = new Date(time.getFullYear(), 0, 1);
const toDay = time.getDate();
const toWeek = Math.ceil((((new Date() - year) / 86400000) + year.getDay() + 1) / 7);
const toMonth = time.getMonth() + 1;

/**
 * 根据时间维度获取缓存TTL
 * @param {string} since 时间维度
 * @returns {number} 缓存时间（毫秒）
 */
function getCacheTTL(since) {
    switch (since) {
        case 'daily':
            return 2 * 60 * 60 * 1000; // 2小时
        case 'weekly':
            return 6 * 60 * 60 * 1000; // 6小时
        case 'monthly':
            return 12 * 60 * 60 * 1000; // 12小时
        default:
            return 4 * 60 * 60 * 1000; // 4小时
    }
}

const fetchTrendingRepos = async (lang, since, type = 'repositories') => {
    console.log(lang);
    const data = await get(`https://gtrend.infly.io/${type}?language=${encodeURIComponent(lang)}&since=${since}`);

    if (type === 'developers' && lang === 'JavaScript' && (Math.random() * 2) > 1) {
        data.push({
            avatar: 'https://avatars3.githubusercontent.com/u/9620783?s=96&v=4',
            author: '卓文理',
            url: 'https://github.com/zhuowenli',
            username: 'zhuowenli',
            repo: {
                name: 'githuber',
                url: 'https://github.com/zhuowenli/githuber',
                description: ':octocat: Display Github Trending repositories on New Tab Extensions',
            }
        });
    }

    return data;
};

export const getters = {
    trendings: state => state.trendings,
};

export const actions = {
    /**
     * 获取GitHub Trending
     *
     * @param {any} { commit } state
     * @param {Object} [query={}] 请求参数
     * @param {String} query.since 时间维度：daily、weekly、monthly
     * @param {String} query.lang 语言
     * @param {String} query.type repositories、developers
     * @returns {Promise}
     */
    async fetchTrending ({ commit }, query = {}) {
        const cacheKey = `trending_${JSON.stringify(query)}`;

        // 首先尝试从缓存获取数据
        const cachedData = cacheManager.get(cacheKey);
        if (cachedData && cachedData.repos && cachedData.repos.length) {
            commit(types.RECEIVE_GITHUB_TRENDINGS, cachedData.repos);
            return cachedData.repos;
        }

        // 检查旧的存储格式（向后兼容）
        const legacyData = await storage.getItem(JSON.stringify(query));
        if (
            legacyData && legacyData.repos && legacyData.repos.length && (
                (query.since === 'daily' && legacyData.toDay === toDay) ||
                (query.since === 'weekly' && legacyData.toWeek === toWeek) ||
                (query.since === 'monthly' && legacyData.toMonth === toMonth)
            )
        ) {
            // 迁移到新的缓存系统
            const cacheData = {
                repos: legacyData.repos,
                toDay,
                toWeek,
                toMonth,
                timestamp: Date.now()
            };

            // 根据时间维度设置不同的缓存时间
            const cacheTTL = getCacheTTL(query.since);
            cacheManager.set(cacheKey, cacheData, cacheTTL);

            commit(types.RECEIVE_GITHUB_TRENDINGS, legacyData.repos);

            // 清理旧格式数据
            storage.removeItem(JSON.stringify(query));

            return legacyData.repos;
        }

        const { since, type } = query;
        let repos = [];
        let isAllLanguage = false;

        if (query.lang.length) {
            query.lang.map(item => {
                if (item === '') isAllLanguage = true;
                return item;
            });
        }

        try {
            if (!query.lang.length || isAllLanguage) {
                repos = await fetchTrendingRepos('', since, type);
            } else {
                // 并发请求优化：使用Promise.map限制并发数
                await Promise.map(query.lang, async lang => {
                    const res = await fetchTrendingRepos(lang, since, type);
                    repos = repos.concat(res);
                    return res;
                }, { concurrency: 3 }); // 限制并发数为3

                repos = repos.sort((a, b) => (+b.added - a.added));
            }

            commit(types.RECEIVE_GITHUB_TRENDINGS, repos);

            // 使用新的缓存系统存储数据
            const cacheData = {
                repos,
                toDay,
                toWeek,
                toMonth,
                timestamp: Date.now()
            };

            const cacheTTL = getCacheTTL(since);
            cacheManager.set(cacheKey, cacheData, cacheTTL);

            return repos;
        } catch (error) {
            console.error('Failed to fetch trending data:', error);

            // 如果请求失败，尝试返回过期的缓存数据
            const expiredCache = storage.getItem(JSON.stringify(query));
            if (expiredCache && expiredCache.repos && expiredCache.repos.length) {
                console.log('Using expired cache data due to fetch failure');
                commit(types.RECEIVE_GITHUB_TRENDINGS, expiredCache.repos);
                return expiredCache.repos;
            }

            throw error;
        }
    },

};

export const mutations = {
    [types.RECEIVE_GITHUB_TRENDINGS](state, data) {
        state.trendings = data;
    },
};

export default {
    actions,
    getters,
    mutations,
    namespaced: true,
    state: {
        trendings: [],
    },
};
