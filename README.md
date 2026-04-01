# How to Run

### 本地运行 (Development)
1. 确保已安装 Node.js (v18+)。
2. 进入 `frontend-admin` 目录，运行 `npm install` 安装依赖。
3. 运行 `npm run dev` 启动开发服务器。
4. 访问终端显示的本地地址（通常是 http://localhost:8081）。

### Docker 运行 (Production)
1. 确保已安装 Docker 和 Docker Compose。
2. 在项目根目录运行 `docker-compose up -d --build`。
3. 访问 `http://localhost:8081` 即可使用。

# Services

本项目为一个纯前端单页应用（SPA），无后端服务依赖，所有服务逻辑在浏览器端闭环运行。

| 服务名称 | 描述 | 技术栈 | 端口 |
| :--- | :--- | :--- | :--- |
| **Frontend** | 核心业务界面与逻辑 | HTML5, TailwindCSS, Vanilla JS, Vite | 8081 (Docker) / 8081 (Dev) |
| **Storage** | 数据持久化服务 | LocalStorage API | N/A |

# 测试账号

本项目为纯前端，**无需登录**即可直接使用所有功能。
数据存储在浏览器 LocalStorage 中，清除浏览器缓存即可重置系统。

# 题目内容
你是资深全栈开发工程师，用Builder模式生成完整的“公共交通管理系统（公交版MVP）”，按以下要求执行，确保代码可直接运行、结构清晰、适合小白部署：1. 项目架构：- 技术栈：HTML + JavaScript + Tailwind CSS，用localStorage本地存储数据，无后端依赖- 项目结构：根目录含index.html（入口）、routes.js（线路管理）、vehicles.js（车辆调度）、stations.js（站点管理）、stats.js（统计）、styles.css（样式），文件路径清晰2. 核心页面（4个，通过导航栏切换，响应式适配手机/电脑）：- 线路列表页：支持公交路线增删改查（线路号、起点、终点、途经站点、运营时间），表单提交+数据本地保存，删除加确认弹窗- 车辆调度页：显示车辆编号、所属线路、实时状态（运行/停运/维修），支持状态切换和筛选，数据联动线路列表- 站点查询页：按站点名称搜索，显示途经该站点的所有线路及到站时间预估，支持模糊搜索- 基础统计页：展示线路总数、车辆总数、活跃车辆数、热门站点TOP3，数据从localStorage读取并实时更新3. 功能细节：- 导航栏固定顶部，含4个页面入口，点击切换无刷新- 所有表单加基础校验（必填项、格式正确），错误提示友好- 页面加载时自动读取localStorage数据，新增/修改/删除实时同步- 界面用Tailwind CSS美化，按钮颜色区分（新增绿色、删除红色、修改蓝色），间距统一、视觉清晰4. 代码要求：- 每行关键代码加注释，变量命名规范，无冗余代码- 兼容Chrome、Edge等现代浏览器，无兼容性问题- 自动处理依赖，生成后可直接预览，无需额外配置5. 生成流程：1. 先创建完整项目文件结构2. 依次编写每个文件的代码，确保功能完整3. 自动运行必要命令（如npm install，用于预览环境）4. 生成完成后给出运行说明，方便小白直接预览和导出


---

## 项目结构
```
.
├── .gitignore              # Git 忽略文件配置
├── docker-compose.yml      # Docker 容器编排配置
├── README.md               # 项目说明文档
└── frontend-admin/         # 前端应用目录
    ├── Dockerfile           # Docker 构建脚本
    ├── index.html           # 应用入口 HTML 文件
    ├── main.js              # 应用主入口文件
    ├── styles.css           # 全局样式文件
    ├── routes.js            # 线路管理模块
    ├── vehicles.js          # 车辆调度模块
    ├── stations.js          # 站点查询模块
    ├── stats.js             # 数据统计模块
    ├── package.json         # Node.js 依赖管理
    ├── vite.config.js       # Vite 构建工具配置
    ├── tailwind.config.js   # Tailwind CSS 配置
    └── postcss.config.js    # PostCSS 配置
```

## 功能清单
1. **线路管理**：支持线路的增删改查。
2. **车辆调度**：可视化管理车辆状态（运行/停运/维修）。
3. **站点查询**：支持模糊搜索，显示到站预估时间。
4. **数据统计**：实时看板，展示热门站点和运力情况。
