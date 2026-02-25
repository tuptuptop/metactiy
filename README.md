# MetaCity 元城市

一个基于区块链技术的去中心化元宇宙城市平台。

## 项目结构

```
metacity/
├── backend/          # 后端服务 (Node.js + Express)
├── frontend/         # 前端应用 (Vue3 + uni-app)
├── docker-compose.yml
└── README.md
```

## 快速开始

### 使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

### 手动部署

#### 后端

```bash
cd backend
npm install
npm run dev
```

#### 前端

```bash
cd frontend
npm install
npm run dev:h5
```

## 技术栈

- **后端**: Node.js, Express, MySQL, Redis
- **前端**: Vue3, uni-app, Pinia
- **部署**: Docker, Docker Compose

## 文档

- [API文档](backend/docs/API.md)
- [部署文档](backend/docs/DEPLOYMENT.md)
- [测试报告](backend/docs/TEST_REPORT.md)

## License

MIT
