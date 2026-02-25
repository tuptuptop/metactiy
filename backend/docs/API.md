# MetaCity API 接口文档

## 接口规范

### 基础信息
- 基础URL: `http://localhost:3000/api`
- 数据格式: JSON
- 编码: UTF-8

### 请求头
```
Content-Type: application/json
Authorization: Bearer {token}  // 需要登录的接口
```

### 响应格式
```json
{
    "code": 0,          // 0表示成功，非0表示失败
    "message": "Success",
    "data": {},         // 响应数据
    "timestamp": "2026-02-25T00:00:00Z"
}
```

### 分页响应格式
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [],
        "total": 100,
        "page": 1,
        "pageSize": 20,
        "totalPages": 5
    },
    "timestamp": "2026-02-25T00:00:00Z"
}
```

### 错误码说明
| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| -1 | 通用错误 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |

---

## 用户模块 (/api/user)

### 1. 发送验证码
**POST** `/api/user/sms/send`

请求参数:
```json
{
    "phone": "13800138000"
}
```

响应:
```json
{
    "code": 0,
    "message": "SMS sent successfully",
    "data": {
        "success": true
    }
}
```

### 2. 用户注册
**POST** `/api/user/register`

请求参数:
```json
{
    "phone": "13800138000",
    "password": "Test@123",
    "code": "123456",
    "inviteCode": "ABC123"  // 可选
}
```

响应:
```json
{
    "code": 0,
    "message": "Registration successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "userId": "U202602250001",
            "phone": "138****8000",
            "nickname": "区块居民",
            "avatar": "https://xxx.com/avatar/default.png",
            "inviteCode": "XYZ789"
        }
    }
}
```

### 3. 用户登录
**POST** `/api/user/login`

请求参数:
```json
{
    "phone": "13800138000",
    "password": "Test@123",      // 密码登录时必填
    "code": "123456",            // 验证码登录时必填
    "loginType": "password"      // password 或 code
}
```

响应:
```json
{
    "code": 0,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "userId": "U202602250001",
            "phone": "138****8000",
            "nickname": "区块居民",
            "avatar": "https://xxx.com/avatar/xxx.png",
            "inviteCode": "XYZ789"
        }
    }
}
```

### 4. 用户登出
**POST** `/api/user/logout`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Logout successful",
    "data": null
}
```

### 5. 获取用户信息
**GET** `/api/user/info`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "userId": "U202602250001",
        "phone": "138****8000",
        "nickname": "区块居民",
        "avatar": "https://xxx.com/avatar/xxx.png",
        "registerTime": "2026-02-25T00:00:00Z",
        "inviteCode": "XYZ789"
    }
}
```

### 6. 更新用户信息
**PUT** `/api/user/update`

需要登录: 是

请求参数:
```json
{
    "nickname": "新昵称",
    "avatar": "https://xxx.com/avatar/new.png"
}
```

响应:
```json
{
    "code": 0,
    "message": "Update successful",
    "data": null
}
```

### 7. 重置密码
**POST** `/api/user/resetPwd`

请求参数:
```json
{
    "phone": "13800138000",
    "code": "123456",
    "newPassword": "NewTest@123"
}
```

响应:
```json
{
    "code": 0,
    "message": "Password reset successful",
    "data": null
}
```

### 8. 获取用户中心数据
**GET** `/api/user/center`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "userInfo": {
            "userId": "U202602250001",
            "nickname": "区块居民",
            "avatar": "https://xxx.com/avatar/xxx.png",
            "phone": "138****8000",
            "registerTime": "2026-02-25T00:00:00Z"
        },
        "assets": {
            "totalCities": 5,
            "totalBlocks": 10,
            "totalPoints": 1500,
            "totalEarnings": 0
        },
        "inviteInfo": {
            "inviteCode": "XYZ789",
            "inviteCount": 10,
            "inviteEarnings": 0
        }
    }
}
```

### 9. 获取用户城市列表
**GET** `/api/user/cities`

需要登录: 是

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "city_id": "0010",
                "city_name": "北京",
                "cover_image": "https://xxx.com/city/beijing.png",
                "block_count": 10,
                "total_amount": 1000.00
            }
        ],
        "total": 5,
        "page": 1,
        "pageSize": 20
    }
}
```

---

## 城市模块 (/api/city)

### 1. 获取城市列表
**GET** `/api/city/list`

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)
- categoryId: 分类ID (可选)
- keyword: 搜索关键词 (可选)
- sortBy: 排序字段 (默认hot_level)
- sortOrder: 排序方式 ASC/DESC (默认DESC)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "city_id": "0010",
                "city_name": "北京",
                "city_code": "010",
                "province": "北京市",
                "category_id": 1,
                "cover_image": "https://xxx.com/city/beijing.png",
                "sold_count": 15000,
                "total_count": 50000,
                "min_price": 99.00,
                "hot_level": 5,
                "status": 1
            }
        ],
        "total": 337,
        "page": 1,
        "pageSize": 20
    }
}
```

### 2. 获取城市分类
**GET** `/api/city/category`

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "category_name": "区县地域",
            "category_code": "district",
            "sort_order": 1
        }
    ]
}
```

### 3. 获取热门城市
**GET** `/api/city/hot`

请求参数:
- limit: 数量限制 (默认10)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": [
        {
            "city_id": "0010",
            "city_name": "北京",
            "cover_image": "https://xxx.com/city/beijing.png",
            "sold_count": 15000,
            "min_price": 99.00,
            "hot_level": 5
        }
    ]
}
```

### 4. 搜索城市
**GET** `/api/city/search`

请求参数:
- keyword: 搜索关键词 (必填)
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)

响应: 同城市列表

### 5. 获取城市详情
**GET** `/api/city/detail/:id`

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "city_id": "0010",
        "city_name": "北京",
        "city_code": "010",
        "province": "北京市",
        "description": "中国首都，政治文化中心...",
        "cover_image": "https://xxx.com/city/beijing.png",
        "banner_images": [
            "https://xxx.com/city/beijing1.png",
            "https://xxx.com/city/beijing2.png"
        ],
        "category_id": 1,
        "sold_count": 15000,
        "total_count": 50000,
        "min_price": 99.00,
        "max_price": 999.00,
        "hot_level": 5,
        "popularity": 100000,
        "features": ["核心区域", "DAO治理中心"],
        "status": 1
    }
}
```

### 6. 获取城市公告
**GET** `/api/city/announcement/:id`

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认10)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "id": 1,
                "title": "北京城开城公告",
                "content": "...",
                "created_at": "2026-02-25T00:00:00Z"
            }
        ],
        "total": 5,
        "page": 1,
        "pageSize": 10
    }
}
```

---

## 首页模块 (/api/home)

### 1. 获取首页数据
**GET** `/api/home/index`

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "banners": [...],
        "hotCities": [...],
        "news": [...],
        "notice": {...}
    }
}
```

### 2. 获取轮播图
**GET** `/api/home/banner`

请求参数:
- position: 位置 (默认home)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": [
        {
            "id": 1,
            "title": "欢迎来到元城市",
            "image_url": "https://xxx.com/banner/welcome.png",
            "link_url": "/pages/index/index",
            "sort_order": 1
        }
    ]
}
```

### 3. 获取平台动态
**GET** `/api/home/news`

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认10)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "id": 1,
                "title": "北京城开城公告",
                "content": "...",
                "type": 1,
                "created_at": "2026-02-25T00:00:00Z"
            }
        ],
        "total": 20,
        "page": 1,
        "pageSize": 10
    }
}
```

---

## 签到模块 (/api/sign)

### 1. 执行签到
**POST** `/api/sign/do`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Sign in successful",
    "data": {
        "signed": true,
        "continuousDays": 3,
        "pointsEarned": 15
    }
}
```

### 2. 获取签到状态
**GET** `/api/sign/status`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "todaySigned": true,
        "continuousDays": 3,
        "totalDays": 10,
        "todayPoints": 15,
        "signCalendar": [
            {"date": "2026-02-01", "signed": true},
            {"date": "2026-02-02", "signed": true}
        ]
    }
}
```

### 3. 获取签到记录
**GET** `/api/sign/records`

需要登录: 是

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认30)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "sign_date": "2026-02-25",
                "continuous_days": 3,
                "points_earned": 15,
                "created_at": "2026-02-25T08:00:00Z"
            }
        ],
        "total": 10,
        "page": 1,
        "pageSize": 30
    }
}
```

---

## 积分模块 (/api/points)

### 1. 获取积分余额
**GET** `/api/points/balance`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "balance": 1500
    }
}
```

### 2. 获取积分明细
**GET** `/api/points/records`

需要登录: 是

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)
- type: 类型 1获取 2消耗 (可选)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "record_id": "P202602250001",
                "type": 1,
                "amount": 10,
                "balance": 150,
                "source": "daily_sign",
                "description": "每日签到奖励",
                "created_at": "2026-02-25T08:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "pageSize": 20
    }
}
```

### 3. 积分获取
**POST** `/api/points/earn`

需要登录: 是

请求参数:
```json
{
    "amount": 100,
    "source": "invite_friend",
    "description": "邀请好友奖励"
}
```

响应:
```json
{
    "code": 0,
    "message": "Points earned successfully",
    "data": {
        "recordId": "P202602250001",
        "amount": 100,
        "balance": 1600
    }
}
```

### 4. 积分消耗
**POST** `/api/points/spend`

需要登录: 是

请求参数:
```json
{
    "amount": 50,
    "description": "兑换商品"
}
```

响应:
```json
{
    "code": 0,
    "message": "Points spent successfully",
    "data": {
        "recordId": "P202602250002",
        "amount": 50,
        "balance": 1550
    }
}
```

---

## 推广模块 (/api/promote)

### 1. 获取推广统计
**GET** `/api/promote/stats`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "inviteCode": "XYZ789",
        "inviteLink": "https://www.metacity.top/?invite=XYZ789",
        "inviteCount": 10,
        "validCount": 8,
        "totalEarnings": 0,
        "todayEarnings": 0,
        "inviteList": [
            {
                "userId": "U202602250002",
                "nickname": "新居民",
                "avatar": "https://xxx.com/avatar/xxx.png",
                "registerTime": "2026-02-25T00:00:00Z",
                "status": 1
            }
        ]
    }
}
```

### 2. 获取邀请记录
**GET** `/api/promote/invites`

需要登录: 是

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)

响应: 分页格式，同上

### 3. 生成推广海报
**GET** `/api/promote/poster`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "posterUrl": "https://www.metacity.top/poster/XYZ789.png"
    }
}
```

---

## 基金模块 (/api/fund)

### 1. 获取基金列表
**GET** `/api/fund/list`

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)
- fundType: 基金类型 (可选)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "fund_id": 1,
                "fund_name": "居民纾困基金",
                "fund_type": "公益",
                "description": "帮助困难居民...",
                "target_amount": 100000.00,
                "current_amount": 50000.00,
                "donor_count": 100,
                "status": 1
            }
        ],
        "total": 5,
        "page": 1,
        "pageSize": 20
    }
}
```

### 2. 获取基金详情
**GET** `/api/fund/detail/:id`

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "fund_id": 1,
        "fund_name": "居民纾困基金",
        "fund_type": "公益",
        "description": "帮助困难居民...",
        "target_amount": 100000.00,
        "current_amount": 50000.00,
        "donor_count": 100,
        "status": 1,
        "start_time": "2026-01-01T00:00:00Z",
        "end_time": "2026-12-31T23:59:59Z"
    }
}
```

### 3. 获取捐赠记录
**GET** `/api/fund/donations`

请求参数:
- fundId: 基金ID (可选)
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "donation_id": "D202602250001",
                "fund_id": 1,
                "user_id": "U202602250001",
                "nickname": "区块居民",
                "avatar": "https://xxx.com/avatar/xxx.png",
                "amount": 100.00,
                "message": "加油！",
                "created_at": "2026-02-25T00:00:00Z"
            }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 20
    }
}
```

---

## 公告模块 (/api/notice)

### 1. 获取公告列表
**GET** `/api/notice/list`

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)
- type: 类型 1公告 2活动 3系统 (可选)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "notice_id": "N202602250001",
                "title": "平台升级公告",
                "content": "...",
                "type": 1,
                "is_top": 1,
                "read_count": 1000,
                "created_at": "2026-02-25T00:00:00Z"
            }
        ],
        "total": 20,
        "page": 1,
        "pageSize": 20
    }
}
```

### 2. 获取公告详情
**GET** `/api/notice/detail/:id`

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "notice_id": "N202602250001",
        "title": "平台升级公告",
        "content": "尊敬的用户...",
        "type": 1,
        "is_top": 1,
        "read_count": 1001,
        "created_at": "2026-02-25T00:00:00Z"
    }
}
```

---

## 消息模块 (/api/message)

### 1. 获取消息列表
**GET** `/api/message/list`

需要登录: 是

请求参数:
- page: 页码 (默认1)
- pageSize: 每页数量 (默认20)
- type: 类型 1系统 2活动 3交易 (可选)

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "list": [
            {
                "msg_id": "M202602250001",
                "title": "签到成功",
                "content": "恭喜您获得10积分",
                "type": 1,
                "is_read": 0,
                "created_at": "2026-02-25T08:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "pageSize": 20
    }
}
```

### 2. 标记消息已读
**PUT** `/api/message/read`

需要登录: 是

请求参数:
```json
{
    "msgIds": ["M202602250001", "M202602250002"]
}
```

响应:
```json
{
    "code": 0,
    "message": "Messages marked as read",
    "data": null
}
```

### 3. 获取未读数量
**GET** `/api/message/unread`

需要登录: 是

响应:
```json
{
    "code": 0,
    "message": "Success",
    "data": {
        "count": 5
    }
}
```

---

**文档版本**: v1.0  
**更新日期**: 2026-02-25
