# GitHub API 数据获取分析

## 📋 概述

GITHUBER项目通过第三方API服务获取GitHub Trending数据，而不是直接调用GitHub官方API。这种设计避免了API限制和认证复杂性。

## 🔗 API 端点

### 主要API服务

```javascript
// 第三方GitHub Trending API
const API_BASE = 'https://gtrend.infly.io'

// API端点格式
GET /{type}?language={lang}&since={since}
```

### 支持的参数

- **type**: `repositories` | `developers`
- **language**: 编程语言（如 `JavaScript`, `Python` 等，空字符串表示所有语言）
- **since**: `daily` | `weekly` | `monthly`

## 📊 数据结构分析

### Repositories 数据结构

```javascript
{
  name: "项目名称",                    // 显示在卡片标题
  description: "项目描述",             // 显示在卡片描述
  url: "https://github.com/...",      // 项目链接
  language: "JavaScript",             // 编程语言
  languageColor: "#f1e05a",          // 语言颜色
  stars: "1,234",                     // 总星数
  currentPeriodStars: "56",           // 当期新增星数
  forks: "123",                       // Fork数量
  builtBy: [                          // 贡献者列表
    {
      username: "developer1",
      avatar: "https://avatars.githubusercontent.com/..."
    }
  ]
}
```

### Developers 数据结构

```javascript
{
  author: "开发者姓名",                // 显示名称
  username: "github_username",        // GitHub用户名
  avatar: "https://avatars.github...", // 头像URL
  url: "https://github.com/username",  // 个人主页
  repo: {                             // 热门仓库（可选）
    name: "repository_name",
    url: "https://github.com/...",
    description: "仓库描述"
  }
}
```

## 🏗️ 代码架构

### 1. 数据获取层 (`src/vuex/modules/github.js`)

<function_calls>
`<invoke name="str-replace-editor">`
`<parameter name="command">`str_replace
