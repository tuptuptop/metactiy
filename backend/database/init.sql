-- =============================================
-- MetaCity 元城市 数据库初始化脚本
-- Version: 1.0
-- Created: 2026-02-25
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS metacity DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE metacity;

-- =============================================
-- 用户相关表
-- =============================================

-- 用户表
DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(32) NOT NULL UNIQUE COMMENT '用户ID',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    nickname VARCHAR(50) DEFAULT '元居民' COMMENT '昵称',
    avatar VARCHAR(255) DEFAULT 'https://static.metacity.top/avatar/default.png' COMMENT '头像URL',
    password VARCHAR(255) COMMENT '密码(加密)',
    salt VARCHAR(32) COMMENT '盐值',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 0禁用',
    invite_code VARCHAR(20) UNIQUE COMMENT '邀请码',
    invited_by VARCHAR(32) COMMENT '邀请人邀请码',
    points INT DEFAULT 0 COMMENT '积分余额',
    continuous_sign_days INT DEFAULT 0 COMMENT '连续签到天数',
    last_sign_date DATE COMMENT '最后签到日期',
    register_time DATETIME COMMENT '注册时间',
    last_login_time DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_invite_code (invite_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 签到记录表
DROP TABLE IF EXISTS t_user_sign;
CREATE TABLE t_user_sign (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    sign_date DATE NOT NULL COMMENT '签到日期',
    continuous_days INT DEFAULT 1 COMMENT '连续天数',
    points_earned INT DEFAULT 10 COMMENT '获得积分',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_date (user_id, sign_date),
    INDEX idx_user_id (user_id),
    INDEX idx_sign_date (sign_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';

-- 积分记录表
DROP TABLE IF EXISTS t_user_points;
CREATE TABLE t_user_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    record_id VARCHAR(32) NOT NULL UNIQUE COMMENT '记录ID',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    type TINYINT NOT NULL COMMENT '类型 1获取 2消耗',
    amount INT NOT NULL COMMENT '积分数量',
    balance INT COMMENT '变动后余额',
    source VARCHAR(50) COMMENT '来源',
    description VARCHAR(255) COMMENT '描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- 用户城市关联表
DROP TABLE IF EXISTS t_user_city;
CREATE TABLE t_user_city (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    city_id VARCHAR(20) NOT NULL COMMENT '城市ID',
    block_count INT DEFAULT 0 COMMENT '地块数量',
    total_amount DECIMAL(12,2) DEFAULT 0 COMMENT '总金额',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_city (user_id, city_id),
    INDEX idx_user_id (user_id),
    INDEX idx_city_id (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户城市关联表';

-- 用户地块表
DROP TABLE IF EXISTS t_user_block;
CREATE TABLE t_user_block (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    city_id VARCHAR(20) NOT NULL COMMENT '城市ID',
    block_code VARCHAR(50) NOT NULL COMMENT '地块编码',
    block_name VARCHAR(100) COMMENT '地块名称',
    price DECIMAL(10,2) COMMENT '购买价格',
    status TINYINT DEFAULT 1 COMMENT '状态 1持有 2已转让',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_city_id (city_id),
    INDEX idx_block_code (block_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地块表';

-- =============================================
-- 城市相关表
-- =============================================

-- 城市分类表
DROP TABLE IF EXISTS t_city_category;
CREATE TABLE t_city_category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL COMMENT '分类名称',
    category_code VARCHAR(20) COMMENT '分类编码',
    icon VARCHAR(255) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市分类表';

-- 城市表
DROP TABLE IF EXISTS t_city;
CREATE TABLE t_city (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_id VARCHAR(20) NOT NULL UNIQUE COMMENT '城市ID',
    city_name VARCHAR(50) NOT NULL COMMENT '城市名称',
    city_code VARCHAR(10) COMMENT '城市编码',
    province VARCHAR(50) COMMENT '省份',
    category_id INT COMMENT '分类ID',
    description TEXT COMMENT '城市描述',
    cover_image VARCHAR(255) COMMENT '封面图',
    banner_images TEXT COMMENT '轮播图JSON',
    sold_count INT DEFAULT 0 COMMENT '已售数量',
    total_count INT DEFAULT 0 COMMENT '总数量',
    min_price DECIMAL(10,2) COMMENT '最低价格',
    max_price DECIMAL(10,2) COMMENT '最高价格',
    hot_level INT DEFAULT 0 COMMENT '热度等级 1-5',
    popularity INT DEFAULT 0 COMMENT '人气值',
    features TEXT COMMENT '特色标签JSON',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 0下架',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_hot_level (hot_level),
    INDEX idx_status (status),
    INDEX idx_province (province)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市表';

-- 城市公告表
DROP TABLE IF EXISTS t_city_announcement;
CREATE TABLE t_city_announcement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_id VARCHAR(20) NOT NULL COMMENT '城市ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    status TINYINT DEFAULT 1 COMMENT '状态 1显示 0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city_id (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市公告表';

-- =============================================
-- 基金相关表
-- =============================================

-- 基金表
DROP TABLE IF EXISTS t_fund;
CREATE TABLE t_fund (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fund_id INT NOT NULL AUTO_INCREMENT UNIQUE COMMENT '基金ID',
    fund_name VARCHAR(100) NOT NULL COMMENT '基金名称',
    fund_type VARCHAR(50) COMMENT '基金类型',
    description TEXT COMMENT '描述',
    target_amount DECIMAL(12,2) COMMENT '目标金额',
    current_amount DECIMAL(12,2) DEFAULT 0 COMMENT '当前金额',
    donor_count INT DEFAULT 0 COMMENT '捐赠人数',
    status TINYINT DEFAULT 1 COMMENT '状态 1进行中 0已结束',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基金表';

-- 基金捐赠记录表
DROP TABLE IF EXISTS t_fund_donation;
CREATE TABLE t_fund_donation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    donation_id VARCHAR(32) NOT NULL UNIQUE COMMENT '捐赠ID',
    fund_id INT NOT NULL COMMENT '基金ID',
    user_id VARCHAR(32) COMMENT '用户ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '捐赠金额',
    message VARCHAR(255) COMMENT '留言',
    status TINYINT DEFAULT 1 COMMENT '状态 1成功 0失败',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fund_id (fund_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='基金捐赠记录表';

-- =============================================
-- 公告消息相关表
-- =============================================

-- 公告表
DROP TABLE IF EXISTS t_notice;
CREATE TABLE t_notice (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    notice_id VARCHAR(32) NOT NULL UNIQUE COMMENT '公告ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    type TINYINT DEFAULT 1 COMMENT '类型 1公告 2活动 3系统',
    is_top TINYINT DEFAULT 0 COMMENT '是否置顶 1是 0否',
    read_count INT DEFAULT 0 COMMENT '阅读数',
    status TINYINT DEFAULT 1 COMMENT '状态 1显示 0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_is_top (is_top)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- 消息表
DROP TABLE IF EXISTS t_message;
CREATE TABLE t_message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    msg_id VARCHAR(32) NOT NULL UNIQUE COMMENT '消息ID',
    user_id VARCHAR(32) NOT NULL COMMENT '用户ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    type TINYINT DEFAULT 1 COMMENT '类型 1系统 2活动 3交易',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读 1是 0否',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- =============================================
-- 其他表
-- =============================================

-- 轮播图表
DROP TABLE IF EXISTS t_banner;
CREATE TABLE t_banner (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) COMMENT '标题',
    image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
    link_url VARCHAR(255) COMMENT '跳转链接',
    position VARCHAR(50) DEFAULT 'home' COMMENT '位置 home首页 city城市',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态 1显示 0隐藏',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 新闻动态表
DROP TABLE IF EXISTS t_news;
CREATE TABLE t_news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    type TINYINT DEFAULT 1 COMMENT '类型 1动态 2活动',
    status TINYINT DEFAULT 1 COMMENT '状态 1显示 0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新闻动态表';

-- 意见反馈表
DROP TABLE IF EXISTS t_feedback;
CREATE TABLE t_feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    feedback_id VARCHAR(32) NOT NULL UNIQUE COMMENT '反馈ID',
    user_id VARCHAR(32) COMMENT '用户ID',
    content TEXT NOT NULL COMMENT '反馈内容',
    contact VARCHAR(100) COMMENT '联系方式',
    images TEXT COMMENT '图片JSON',
    status TINYINT DEFAULT 0 COMMENT '状态 0待处理 1已处理',
    reply TEXT COMMENT '回复内容',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='意见反馈表';

-- =============================================
-- 初始化数据
-- =============================================

-- 初始化城市分类
INSERT INTO t_city_category (category_name, category_code, sort_order) VALUES
('区县地域', 'district', 1),
('世界城市', 'world', 2),
('特色城市', 'special', 3),
('虚拟城市', 'virtual', 4);

-- 初始化轮播图
INSERT INTO t_banner (title, image_url, link_url, position, sort_order) VALUES
('欢迎来到元城市', 'https://static.metacity.top/banner/welcome.png', '/pages/index/index', 'home', 1),
('北京城开城公告', 'https://static.metacity.top/banner/beijing.png', '/pages/city/detail?id=0010', 'home', 2);

-- 初始化公告
INSERT INTO t_notice (notice_id, title, content, type, is_top) VALUES
('N202602250001', '平台升级公告', '尊敬的用户，我们将于近期进行系统升级，届时部分功能可能无法使用，敬请谅解。', 1, 1),
('N202602250002', '北京城开城公告', '北京城正式开城，欢迎各位居民前来选购地块！', 1, 0);

-- 初始化基金
INSERT INTO t_fund (fund_id, fund_name, fund_type, description, target_amount, current_amount, donor_count) VALUES
(1, '居民纾困基金', '公益', '帮助困难居民渡过难关，共建和谐社区', 100000.00, 50000.00, 100),
(2, '城市建设项目基金', '建设', '用于城市基础设施建设和维护', 500000.00, 150000.00, 50);

-- =============================================
-- 创建视图
-- =============================================

-- 用户资产视图
CREATE OR REPLACE VIEW v_user_assets AS
SELECT 
    u.user_id,
    u.nickname,
    u.points,
    COUNT(DISTINCT uc.city_id) as city_count,
    COUNT(ub.id) as block_count,
    u.continuous_sign_days
FROM t_user u
LEFT JOIN t_user_city uc ON u.user_id = uc.user_id
LEFT JOIN t_user_block ub ON u.user_id = ub.user_id
GROUP BY u.user_id;

-- 城市统计视图
CREATE OR REPLACE VIEW v_city_stats AS
SELECT 
    c.city_id,
    c.city_name,
    c.sold_count,
    c.total_count,
    c.min_price,
    c.max_price,
    c.hot_level,
    COUNT(DISTINCT uc.user_id) as owner_count
FROM t_city c
LEFT JOIN t_user_city uc ON c.city_id = uc.city_id
GROUP BY c.city_id;

-- =============================================
-- 结束
-- =============================================
