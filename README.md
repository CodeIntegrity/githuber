<p align="center">
    <img src="./assets/logo.png" width="150" />
</p>
<p align="center">
    <a href="https://github.com/zhuowenli/githuber/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/License-MPL--2.0-fe7d37.svg?style=flat-square" alt="License">
    </a>
    <a href="https://github.com/zhuowenli/githuber/releases">
        <img src="https://img.shields.io/badge/Version-v1.8.0-blue.svg?style=flat-square" alt="Version">
    </a>
    <a href="https://developer.chrome.com/docs/extensions/mv3/intro/">
        <img src="https://img.shields.io/badge/Manifest-V3-green.svg?style=flat-square" alt="Manifest V3">
    </a>
    <a href="https://www.google.com/chrome/">
        <img src="https://img.shields.io/badge/Chrome-88+-4285f4.svg?style=flat-square" alt="Chrome 88+">
    </a>
    <a href="https://gitmoji.carloscuesta.me" target="_blank">
        <img src="https://img.shields.io/badge/Gitmoji%20Commits-%20😜-FFDD67.svg?style=flat-square" alt="gitmoji commits">
    </a>
    <a href="https://github.com/zhuowenli/githuber/pulls">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome">
    </a>
</p>

## GITHUBER

:octocat: 这是一个帮助 GitHub 开发者每日发现优质内容的浏览器主页拓展。

### 🚀 **最新更新 v1.8.0**

- ✅ **Chrome Extension Manifest V3** 完全兼容
- ✅ **Chrome 88+** 支持，解决"不受支持的扩展"问题
- ✅ **增强安全性** 更新的内容安全策略
- ✅ **优化权限** 最小化权限原则，更安全的网络访问

### ✨ **核心功能**

✔ 支持四大搜索引擎：谷歌、百度、必应、雅虎`<br>`
✔ 添加便捷书签，支持导入最常访问网站`<br>`
✔ 实时展示 Github Trending 热门项目（每日、每周、每月）`<br>`
✔ 项目开源，方便代码审计和功能扩展`<br>`
✔ 支持中英文国际化、数据备份恢复`<br>`
✔ 夜间模式、自定义主题设置

![screenshot](./assets/0.png)

## 📦 **安装方式**

### 🌟 **Chrome Web Store（推荐）**

<a target="_blank" href="https://chrome.google.com/webstore/detail/githuber/janmcneaglgklfljjcpihkkomeghljnf"><img alt="Try it now"  width="300" src="https://raw.github.com/GoogleChrome/chrome-app-samples/master/tryitnowbutton.png" title="Click here to install this sample from the Chrome Web Store"></img></a>

### ⚙️ **系统要求**

- **Chrome 浏览器**: 88 或更高版本
- **Manifest V3**: 完全兼容最新Chrome扩展标准
- **操作系统**: Windows, macOS, Linux
- **网络**: 需要访问 GitHub API（api.github.com）

### ⚠️ **重要提醒**

如果你使用的是旧版本的GITHUBER扩展，请更新到v1.8.0以获得：

- ✅ Chrome最新版本兼容性
- ✅ 解决"不受支持的扩展"警告
- ✅ 增强的安全性和性能

## 🛠️ **本地开发**

### 📋 **开发环境要求**

- **Node.js**: 14+ 或更高版本
- **npm**: 6+ 或更高版本
- **Chrome**: 88+ 用于测试
- **操作系统**: Windows, macOS, Linux

### 🚀 **快速开始**

1. **克隆项目**

   ```bash
   git clone https://github.com/zhuowenli/githuber.git
   cd githuber
   ```
2. **安装依赖**

   ```bash
   npm install
   ```
3. **开发模式编译**

   ```bash
   npm run watch
   ```
4. **生产模式构建**

   ```bash
   # Windows 用户
   set NODE_OPTIONS=--openssl-legacy-provider && npm run build

   # macOS/Linux 用户
   NODE_OPTIONS=--openssl-legacy-provider npm run build
   ```
5. **加载扩展到Chrome**

   - 打开 Chrome 扩展程序 [chrome://extensions/](chrome://extensions/)
   - 开启**开发者模式**
   - 点击**加载已解压的扩展程序**
   - 选择编译后的 `dist` 目录

### 🔧 **开发注意事项**

- 代码修改后需要手动刷新扩展页面
- 确保Chrome版本为88+以支持Manifest V3
- 如遇到构建问题，请使用Node.js legacy OpenSSL provider

## 服务端部署

1. 添加配置文件

   ```bash
   # 添加 .env 填写正确的配置信息
   cp .env.example .env
   ```
2. 创建数据库（默认用MySQL）

   ```bash
   # 初始化数据表
   yarn db:migrate
   ```
3. 启动服务

   ```bash
   # 开发环境
   yarn nodemon

   # 生产环境
   yarn start
   ```

## 🔧 **技术栈**

### 前端技术

- **Vue.js 2.x** - 渐进式JavaScript框架
- **Element UI** - Vue.js 2.0桌面端组件库
- **Sass** - CSS预处理器
- **Babel** - JavaScript编译器
- **Webpack** - 模块打包工具

### 构建工具

- **Poi** - 零配置的构建工具
- **ESLint** - JavaScript代码检查工具
- **Copy Webpack Plugin** - 静态资源复制

### Chrome扩展

- **Manifest V3** - 最新Chrome扩展标准
- **Chrome APIs** - tabs, runtime, topSites等
- **Content Security Policy** - 增强安全策略

### 性能优化
- **智能缓存** - 双层缓存系统，LRU策略
- **懒加载** - Intersection Observer API
- **虚拟滚动** - 大列表性能优化
- **防抖节流** - 提升交互响应速度
- **性能监控** - Performance API集成

## 📝 **更新日志**

### v1.8.0 (2025-07-18) - Manifest V3迁移 + 性能优化

- 🚀 **重大更新**: 完全迁移到Chrome Extension Manifest V3
- ✅ **兼容性**: 支持Chrome 88+，解决"不受支持的扩展"问题
- 🔒 **安全性**: 更新内容安全策略，优化权限结构
- ⚡ **性能优化**: 实现智能缓存、懒加载、虚拟滚动等优化
- 🛠️ **构建**: 改进构建流程，修复Node.js兼容性问题

[查看完整更新日志](./CHANGELOG.md)

## 📋 **开发计划**

### 已完成 ✅

- [X] Chrome Extension Manifest V3 迁移
- [X] 多搜索引擎支持
- [X] GitHub Trending 数据展示
- [X] 书签管理系统
- [X] 数据备份恢复
- [X] 国际化支持（中英文）
- [X] 夜间模式
- [X] 最常访问网站导入
- [X] **性能优化系统**
  - [X] 智能数据缓存策略
  - [X] 图片懒加载优化
  - [X] 虚拟滚动组件
  - [X] 防抖节流优化
  - [X] 性能监控工具

### 计划中 📅

- [ ] 高级设置面板
  - [ ] RSS订阅功能
  - [ ] 自定义主题编辑器
- [ ] 云端数据同步
  - [ ] 账号系统（登录、注册）
  - [ ] 跨设备同步
- [ ] AI功能集成
  - [ ] 智能推荐算法
  - [ ] 个性化内容过滤

## 🔗 **相关链接**

### 官方资源

- [Chrome Web Store](https://chrome.google.com/webstore/detail/githuber/janmcneaglgklfljjcpihkkomeghljnf) - 扩展商店页面
- [GitHub Repository](https://github.com/zhuowenli/githuber) - 源代码仓库
- [Issues &amp; Bug Reports](https://github.com/zhuowenli/githuber/issues) - 问题反馈
- [Releases](https://github.com/zhuowenli/githuber/releases) - 版本发布

### 技术文档

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) - 官方文档
- [Manifest V2 to V3 Migration](https://developer.chrome.com/docs/extensions/migrating/) - 迁移指南
- [性能优化实现文档](./PERFORMANCE_OPTIMIZATION.md) - 详细的性能优化说明
- [Bug修复总结](./BUG_FIX_SUMMARY.md) - 问题修复记录
- [GitHub Octicons](https://octicons.github.com/) - 图标库
- [Vue.js Documentation](https://v2.vuejs.org/) - Vue.js 2.x文档

### 开发工具

- [Element UI](https://element.eleme.io/) - UI组件库
- [Poi Build Tool](https://poi.js.org/) - 构建工具
- [Sass Documentation](https://sass-lang.com/) - CSS预处理器

## 🤝 **贡献指南**

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue.js 官方风格指南
- 提交信息遵循 [Conventional Commits](https://conventionalcommits.org/) 规范

## 📄 **许可证**

本项目基于 [Mozilla Public License 2.0](./LICENSE) 开源协议。

```
Githuber © 2025 zhuowenli
Released under the Mozilla Public License 2.0
```

## 💖 **支持项目**

如果这个项目对你有帮助，请考虑：

- ⭐ 给项目点个星
- 🐛 报告问题和建议
- 🔀 提交 Pull Request
- 📢 分享给更多开发者

---

**Made with ❤️ by [zhuowenli](https://github.com/zhuowenli)**
