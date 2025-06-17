#!/bin/bash

# 汉字学习游戏 Docker 部署脚本

set -e

echo "🚀 开始部署汉字学习游戏..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建日志目录
mkdir -p logs/nginx

# 停止并删除现有容器
echo "🛑 停止现有容器..."
docker-compose down --remove-orphans

# 删除旧镜像（可选）
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建新镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build --no-cache

# 启动容器
echo "🚀 启动容器..."
docker-compose up -d

# 等待容器启动
echo "⏳ 等待容器启动..."
sleep 10

# 检查容器状态
echo "📊 检查容器状态..."
docker-compose ps

# 检查应用是否正常运行
echo "🔍 检查应用状态..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 应用部署成功！"
    echo "🌐 访问地址: http://localhost:3000"
else
    echo "❌ 应用启动失败，请检查日志"
    docker-compose logs
    exit 1
fi

echo "🎉 部署完成！" 