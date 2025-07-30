# Deployment Guide

## Overview

This guide covers deployment strategies, configurations, and best practices for deploying TaskFlow to various environments including development, staging, and production.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Deployment Architecture

TaskFlow follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Server    │    │   Database      │
│   (Nginx/ALB)   │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   Redis Cache   │    │   File Storage  │
│   (CDN/S3)      │    │   (Sessions)    │    │   (S3/Azure)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Environment Setup

### Environment Variables

Create environment files for each environment:

#### Production (.env.production)

```bash
# Application
NODE_ENV=production
PORT=5000
APP_URL=https://taskflow.com
API_URL=https://api.taskflow.com

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/taskflow_prod
REDIS_URL=redis://redis-host:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@taskflow.com

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=taskflow-uploads

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info

# Security
CORS_ORIGIN=https://taskflow.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Staging (.env.staging)

```bash
# Application
NODE_ENV=staging
PORT=5000
APP_URL=https://staging.taskflow.com
API_URL=https://staging-api.taskflow.com

# Database
DATABASE_URL=postgresql://user:password@staging-db:5432/taskflow_staging
REDIS_URL=redis://staging-redis:6379

# Authentication (use different secrets)
JWT_SECRET=staging-jwt-secret
REFRESH_TOKEN_SECRET=staging-refresh-secret

# Email (use test email service)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass

# File Storage (separate bucket)
AWS_S3_BUCKET=taskflow-staging-uploads

# Monitoring
LOG_LEVEL=debug
```

#### Development (.env.development)

```bash
# Application
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:3000
API_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=dev-jwt-secret
REFRESH_TOKEN_SECRET=dev-refresh-secret

# Email (use local mail catcher)
SMTP_HOST=localhost
SMTP_PORT=1025

# File Storage (local storage)
UPLOAD_PATH=./uploads

# Monitoring
LOG_LEVEL=debug
```

## Docker Deployment

### Docker Compose for Production

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend
    restart: unless-stopped

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - database
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Database
  database:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: taskflow_prod
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taskflow"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile.prod
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile.prod
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S taskflow -u 1001

# Change ownership of the app directory
RUN chown -R taskflow:nodejs /app
USER taskflow

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

EXPOSE 5000

CMD ["npm", "start"]
```

### Nginx Configuration

```nginx
# nginx/nginx.conf
upstream backend {
    server backend:5000;
}

server {
    listen 80;
    server_name taskflow.com www.taskflow.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name taskflow.com www.taskflow.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/taskflow.crt;
    ssl_certificate_key /etc/ssl/certs/taskflow.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket Support
    location /socket.io/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Cloud Deployment

### AWS Deployment

#### Using AWS ECS with Fargate

```yaml
# aws/ecs-task-definition.json
{
  "family": "taskflow-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions":
    [
      {
        "name": "taskflow-backend",
        "image": "your-account.dkr.ecr.region.amazonaws.com/taskflow-backend:latest",
        "portMappings": [{ "containerPort": 5000, "protocol": "tcp" }],
        "environment": [{ "name": "NODE_ENV", "value": "production" }],
        "secrets":
          [
            {
              "name": "DATABASE_URL",
              "valueFrom": "arn:aws:secretsmanager:region:account:secret:taskflow/database-url",
            },
            {
              "name": "JWT_SECRET",
              "valueFrom": "arn:aws:secretsmanager:region:account:secret:taskflow/jwt-secret",
            },
          ],
        "logConfiguration":
          {
            "logDriver": "awslogs",
            "options":
              {
                "awslogs-group": "/ecs/taskflow",
                "awslogs-region": "us-east-1",
                "awslogs-stream-prefix": "ecs",
              },
          },
        "healthCheck":
          {
            "command":
              ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"],
            "interval": 30,
            "timeout": 5,
            "retries": 3,
            "startPeriod": 60,
          },
      },
    ],
}
```

#### Terraform Configuration

```hcl
# terraform/main.tf
provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "taskflow-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "taskflow-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "taskflow-private-${count.index + 1}"
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "taskflow-db"

  engine         = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = "taskflow"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "taskflow-db-final-snapshot"

  tags = {
    Name = "taskflow-database"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "taskflow-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "taskflow-app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2

  launch_type = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "taskflow-backend"
    container_port   = 5000
  }

  depends_on = [aws_lb_listener.app]
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "taskflow-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "taskflow-alb"
  }
}
```

### Azure Deployment

#### Azure Container Instances

```yaml
# azure/container-group.yml
apiVersion: 2019-12-01
location: eastus
name: taskflow-container-group
properties:
  containers:
    - name: taskflow-backend
      properties:
        image: taskflow.azurecr.io/taskflow-backend:latest
        resources:
          requests:
            cpu: 1
            memoryInGb: 2
        ports:
          - port: 5000
            protocol: TCP
        environmentVariables:
          - name: NODE_ENV
            value: production
          - name: DATABASE_URL
            secureValue: postgresql://user:pass@server.postgres.database.azure.com:5432/taskflow
    - name: taskflow-frontend
      properties:
        image: taskflow.azurecr.io/taskflow-frontend:latest
        resources:
          requests:
            cpu: 0.5
            memoryInGb: 1
        ports:
          - port: 80
            protocol: TCP
  osType: Linux
  ipAddress:
    type: Public
    ports:
      - protocol: TCP
        port: 80
      - protocol: TCP
        port: 5000
    dnsNameLabel: taskflow-app
  imageRegistryCredentials:
    - server: taskflow.azurecr.io
      username: taskflow
      password: <registry-password>
tags:
  Environment: Production
  Application: TaskFlow
type: Microsoft.ContainerInstance/containerGroups
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ["v*"]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run security audit
        run: npm audit --audit-level high

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy to production
        uses: azure/webapps-deploy@v2
        with:
          app-name: "taskflow-prod"
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          images: "${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}"

  notify:
    needs: [test, build, deploy]
    runs-on: ubuntu-latest
    if: always()

    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: "#deployments"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Monitoring & Logging

### Application Monitoring

```javascript
// backend/src/monitoring/metrics.js
const prometheus = require("prom-client");

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const httpRequestTotal = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const activeConnections = new prometheus.Gauge({
  name: "active_connections",
  help: "Number of active connections",
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestTotal.labels(req.method, route, res.statusCode).inc();
  });

  next();
};

module.exports = {
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
  metricsMiddleware,
  register: prometheus.register,
};
```

### Logging Configuration

```javascript
// backend/src/utils/logger.js
const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: "taskflow-backend",
    version: process.env.APP_VERSION || "1.0.0",
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File transport for production
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Add Elasticsearch transport for production
if (process.env.NODE_ENV === "production" && process.env.ELASTICSEARCH_URL) {
  logger.add(
    new ElasticsearchTransport({
      level: "info",
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      },
      index: "taskflow-logs",
    })
  );
}

module.exports = logger;
```

### Health Check Endpoint

```javascript
// backend/src/routes/health.js
const express = require("express");
const { Pool } = require("pg");
const redis = require("redis");
const router = express.Router();

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

router.get("/health", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.APP_VERSION || "1.0.0",
    checks: {},
  };

  try {
    // Database health check
    await db.query("SELECT 1");
    health.checks.database = { status: "ok" };
  } catch (error) {
    health.checks.database = { status: "error", message: error.message };
    health.status = "error";
  }

  try {
    // Redis health check
    await redisClient.ping();
    health.checks.redis = { status: "ok" };
  } catch (error) {
    health.checks.redis = { status: "error", message: error.message };
    health.status = "error";
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  health.checks.memory = {
    status: "ok",
    usage: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
    },
  };

  const statusCode = health.status === "ok" ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;
```

## Security Considerations

### SSL/TLS Configuration

```bash
# Generate SSL certificate using Let's Encrypt
certbot certonly --webroot -w /var/www/html -d taskflow.com -d www.taskflow.com

# Auto-renewal cron job
0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers

```javascript
// backend/src/middleware/security.js
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const securityMiddleware = [
  // Helmet for security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.taskflow.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),

  // Rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  }),
];

module.exports = securityMiddleware;
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database connectivity
docker exec -it taskflow-db psql -U taskflow -d taskflow -c "SELECT version();"

# Check database logs
docker logs taskflow-db

# Reset database connection pool
docker restart taskflow-backend
```

#### 2. Memory Issues

```bash
# Check memory usage
docker stats taskflow-backend

# Increase memory limit
docker update --memory=4g taskflow-backend

# Check for memory leaks
node --inspect backend/src/app.js
```

#### 3. SSL Certificate Issues

```bash
# Check certificate expiration
openssl x509 -in /etc/ssl/certs/taskflow.crt -text -noout | grep "Not After"

# Renew certificate
certbot renew --force-renewal

# Restart nginx
docker restart taskflow-nginx
```

### Monitoring Commands

```bash
# Check application logs
docker logs -f taskflow-backend

# Monitor system resources
htop

# Check network connectivity
netstat -tulpn | grep :5000

# Database performance
docker exec -it taskflow-db psql -U taskflow -c "SELECT * FROM pg_stat_activity;"
```

### Rollback Procedures

```bash
# Rollback to previous version
docker tag taskflow-backend:latest taskflow-backend:backup
docker pull taskflow-backend:v1.0.0
docker tag taskflow-backend:v1.0.0 taskflow-backend:latest
docker restart taskflow-backend

# Database rollback
pg_restore -U taskflow -d taskflow backup_file.sql
```

This comprehensive deployment guide ensures TaskFlow can be deployed reliably across different environments with proper monitoring, security, and troubleshooting procedures in place.
