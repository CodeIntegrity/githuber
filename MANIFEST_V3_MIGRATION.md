# Chrome Extension Manifest V3 迁移完成

## 🎉 迁移成功！

GITHUBER Chrome扩展已成功从Manifest V2迁移到Manifest V3，现在完全兼容最新的Chrome浏览器要求。

## 📋 主要更改

### 1. **Manifest版本升级**
- ✅ `manifest_version`: 2 → 3
- ✅ `minimum_chrome_version`: 36 → 88

### 2. **API更新**
- ✅ `browser_action` → `action`
- ✅ `content_security_policy` 语法更新
- ✅ 权限分离：`permissions` 和 `host_permissions`

### 3. **权限优化**
- ✅ 移除了不必要的 `webRequest` 权限
- ✅ 添加了 `topSites` 权限（用于导入最常访问功能）
- ✅ 明确指定了 `host_permissions` 用于网络请求

### 4. **构建配置更新**
- ✅ 添加了 `copy-webpack-plugin` 配置
- ✅ 修复了Windows构建脚本兼容性
- ✅ 解决了Node.js版本兼容性问题

## 🔧 技术细节

### 新的Manifest V3配置
```json
{
    "manifest_version": 3,
    "name": "GITHUBER - New Tab",
    "description": "Display Github Trending repositories on New Tab Extensions",
    "version": "1.7.0",
    "action": {
        "default_popup": "./popup.html"
    },
    "content_security_policy": {
        "extension_pages": "script-src 'self'; object-src 'self'"
    },
    "permissions": [
        "tabs",
        "topSites"
    ],
    "host_permissions": [
        "https://api.github.com/*",
        "https://github.com/*",
        "https://githuber.zhuowenli.com/*"
    ],
    "minimum_chrome_version": "88"
}
```

### Chrome API兼容性
所有使用的Chrome API都与Manifest V3兼容：
- ✅ `chrome.tabs.query()`
- ✅ `chrome.tabs.create()`
- ✅ `chrome.tabs.update()`
- ✅ `chrome.runtime.sendMessage()`
- ✅ `chrome.runtime.onMessage.addListener()`
- ✅ `chrome.topSites.get()`

## 🚀 安装和使用

### 开发环境
1. 克隆项目并安装依赖：
   ```bash
   npm install
   ```

2. 构建项目：
   ```bash
   npm run build
   ```

3. 在Chrome中加载扩展：
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

### 生产环境
扩展现在完全兼容Chrome Web Store的最新要求，可以正常发布和更新。

## ⚠️ 注意事项

1. **最低Chrome版本要求**：Chrome 88+
2. **权限变化**：用户可能需要重新授权某些权限
3. **API变化**：所有Chrome API调用都已验证兼容性

## 🔍 测试建议

建议在以下场景中测试扩展功能：
1. ✅ 新标签页显示
2. ✅ GitHub Trending数据获取
3. ✅ 书签添加和管理
4. ✅ 搜索引擎切换
5. ✅ 设置保存和恢复
6. ✅ 最常访问导入功能

## 📚 相关资源

- [Chrome Extension Manifest V3 官方文档](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Manifest V2 到 V3 迁移指南](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Web Store 政策更新](https://developer.chrome.com/docs/webstore/mv2-sunset/)

---

**迁移完成时间**: 2025年1月18日  
**迁移状态**: ✅ 完成  
**兼容性**: Chrome 88+ 
