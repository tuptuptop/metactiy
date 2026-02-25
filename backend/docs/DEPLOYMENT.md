# MetaCity 部署文档

## 一、部署环境准备

### 1.1 服务器要求

**最低配置**
- CPU: 2核
- 内存: 4GB
- 硬盘: 40GB SSD
- 带宽: 5Mbps

**推荐配置**
- CPU: 4核
- 内存: 8GB
- 硬盘: 100GB SSD
- 带宽: 10Mbps

### 1.2 软件环境

| 软件 | 版本要求 |
|-----|---------|
| Node.js | >= 18.0.0 |
| MySQL | >= 8.0 |
| Redis | >= 6.0 |
| Nginx | >= 1.18 |
| PM2 | >= 4.5 |

### 1.3 端口规划

| 服务 | 端口 | 说明 |
|-----|------|------|
| Nginx HTTP | 80 | HTTP访问 |
| Nginx HTTPS | 443 | HTTPS访问 |
| Backend API | 3000 | 后端API服务 |
| MySQL | 3306 | 数据库服务 |
| Redis | 6379 | 缓存服务 |

---

## 二、数据库部署

### 2.1 MySQL安装与配置

```bash
# 安装MySQL
sudo apt-get update
sudo apt-get install mysql-server

# 安全配置
sudo mysql_secure_installation

# 创建数据库
mysql -u root -p

CREATE DATABASE metacity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'metacity'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON metacity.* TO 'metacity'@'localhost';
FLUSH PRIVILEGES;
```

### 2.2 导入数据库

```bash
# 导入数据库脚本
mysql -u metacity -p metacity < backend/database/init.sql
```

### 2.3 数据库优化配置

```ini
[mysqld]
max_connections = 500
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
query_cache_size = 256M
```

---

## 三、Redis部署

### 3.1 Redis安装与配置

```bash
# 安装Redis
sudo apt-get install redis-server

# 配置Redis
sudo nano /etc/redis/redis.conf

# 修改配置
bind 0.0.0.0
port 6379
maxmemory 1gb
maxmemory-policy allkeys-lru
requirepass your_redis_password

# 启动Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

---

## 四、后端部署

### 4.1 安装依赖

```bash
cd backend
npm install --production
```

### 4.2 环境变量配置

```bash
# 复制环境变量文件
cp .env.production .env

# 编辑配置
nano .env
```

### 4.3 使用PM2部署

```bash
# 全局安装PM2
npm install -g pm2

# 启动应用
pm2 start src/app.js --name metacity-backend

# 配置自动重启
pm2 startup
pm2 save

# 查看日志
pm2 logs metacity-backend
```

### 4.4 PM2配置文件

```javascript
module.exports = {
  apps: [{
    name: 'metacity-backend',
    script: './src/app.js',
    cwd: '/path/to/backend',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
```

---

## 五、前端部署

### 5.1 构建生产版本

```bash
cd frontend

# H5构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# APP构建
npm run build:app
```

### 5.2 H5部署到Nginx

```bash
# 复制构建文件到Nginx目录
sudo cp -r dist/build/h5/* /var/www/metacity/

# 配置Nginx
sudo nano /etc/nginx/sites-available/metacity
```

### 5.3 Nginx配置

```nginx
server {
    listen 80;
    server_name www.metacity.top metacity.top;
    root /var/www/metacity;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 5.4 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/metacity /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

---

## 六、SSL证书配置

### 6.1 使用Let's Encrypt免费证书

```bash
# 安装Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d www.metacity.top -d metacity.top

# 自动续期
sudo certbot renew --dry-run
```

### 6.2 HTTPS配置

```nginx
server {
    listen 443 ssl http2;
    server_name www.metacity.top metacity.top;
    
    ssl_certificate /etc/letsencrypt/live/metacity.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/metacity.top/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /var/www/metacity;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name www.metacity.top metacity.top;
    return 301 https://$server_name$request_uri;
}
```

---

## 七、监控与日志

### 7.1 应用监控

```bash
# PM2监控
pm2 monit

# 安装PM2 Plus监控
pm2 install pm2-logrotate
```

### 7.2 日志配置

```javascript
// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: './logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: './logs/combined.log' 
    })
  ]
});

module.exports = logger;
```

### 7.3 日志轮转

```bash
# 配置logrotate
sudo nano /etc/logrotate.d/metacity
```

```
/var/www/metacity/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

---

## 八、备份策略

### 8.1 数据库备份

```bash
# 创建备份脚本
#!/bin/bash
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u metacity -p metacity > $BACKUP_DIR/metacity_$DATE.sql

# 保留最近7天备份
find $BACKUP_DIR -name "metacity_*.sql" -mtime +7 -delete

# 添加到crontab
0 2 * * * /path/to/backup.sh
```

### 8.2 代码备份

```bash
# Git版本控制
git add .
git commit -m "Backup $(date)"
git push origin main
```

---

## 九、部署检查清单

### 9.1 部署前检查

- [ ] 服务器资源充足
- [ ] 数据库已创建并导入
- [ ] Redis已启动
- [ ] 环境变量已配置
- [ ] SSL证书已申请
- [ ] 防火墙规则已配置
- [ ] 域名DNS已解析

### 9.2 部署后验证

- [ ] 后端服务正常启动
- [ ] 前端页面可正常访问
- [ ] API接口响应正常
- [ ] 数据库连接正常
- [ ] Redis缓存正常工作
- [ ] HTTPS证书有效
- [ ] 日志正常记录

---

## 十、故障排查

### 10.1 常见问题

**问题1: 端口被占用**
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000

# 杀死进程
sudo kill -9 [PID]
```

**问题2: 数据库连接失败**
```bash
# 检查MySQL状态
sudo systemctl status mysql

# 查看MySQL日志
sudo tail -f /var/log/mysql/error.log
```

**问题3: Nginx 502错误**
```bash
# 检查后端服务状态
pm2 status

# 重启后端服务
pm2 restart metacity-backend
```

### 10.2 性能优化

```nginx
# Nginx缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=metacity_cache:10m max_size=1g inactive=60m use_temp_path=off;

location /api/ {
    proxy_cache metacity_cache;
    proxy_cache_valid 200 60m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
}
```

---

## 十一、回滚方案

### 11.1 数据库回滚

```bash
# 从备份恢复
mysql -u metacity -p metacity < /backup/mysql/metacity_20260225_120000.sql
```

### 11.2 代码回滚

```bash
# 回滚到上一个版本
git log --oneline -10
git reset --hard [commit_hash]

# 重新部署
npm run build:h5
sudo cp -r dist/build/h5/* /var/www/metacity/
```

---

**文档版本**: v1.0  
**更新日期**: 2026-02-25
