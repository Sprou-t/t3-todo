# ECS Task Definition Template Explanation

This document explains the `taskdef.template.json` file used for deploying the T3 Todo app to AWS ECS.

## Overview
This template uses variables (${VAR}) that get replaced during deployment to create environment-specific task definitions (task def tells ecs how to run the containers).

## Configuration Breakdown

### Task Level Configuration

| Field | Value | Description |
|-------|-------|-------------|
| `family` | `"t3-todo-${ENV}"` | Task family name - groups revisions of the same task definition |
| `networkMode` | `"awsvpc"` | Network mode for Fargate - containers get their own ENI |
| `requiresCompatibilities` | `["FARGATE"]` | Launch type compatibility - only Fargate in this case |
| `cpu` | `"256"` | CPU allocation in CPU units (256 = 0.25 vCPU) |
| `memory` | `"512"` | Memory allocation in MiB (512 MB) |
| `executionRoleArn` | `"arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole"` | IAM role that ECS uses to pull images and write logs |

### Container Definition

#### Basic Container Settings
- **name**: `"t3-todo"` - Container name within the task
- **image**: `"${IMAGE_URI}"` - Docker image URI (replaced with actual ECR image during deployment)

#### Port Mappings
```json
"portMappings": [
  {
    "containerPort": 3000,  // Port that the container listens on (Next.js default)
    "protocol": "tcp"
  }
]
```

#### Environment Variables
Direct environment variables passed to the container:
- **NODE_ENV**: Set to match the deployment environment (staging/production)

#### Secrets (AWS Secrets Manager)
These are injected as environment variables at runtime:

| Secret Name | Path | Description |
|-------------|------|-------------|
| `DATABASE_URL` | `/t3-todo/${ENV}/DATABASE_URL` | Database connection string |
| `NEXTAUTH_URL` | `/t3-todo/${ENV}/NEXTAUTH_URL` | NextAuth.js callback URL |
| `NEXTAUTH_SECRET` | `/t3-todo/${ENV}/NEXTAUTH_SECRET` | NextAuth.js secret for JWT signing |

#### Logging Configuration
CloudWatch logging setup:
- **logDriver**: `"awslogs"` - Use AWS CloudWatch Logs driver
- **awslogs-group**: `/ecs/t3-todo-${ENV}` - Log group name in CloudWatch
- **awslogs-region**: `"ap-southeast-1"` - AWS region where logs are stored
- **awslogs-stream-prefix**: `"ecs"` - Prefix for log streams within the group

## Template Variables

The following variables are replaced during deployment:

- `${ENV}`: Environment name (staging/production)
- `${IMAGE_URI}`: Full ECR image URI with tag
- `YOUR_ACCOUNT_ID`: Your AWS account ID (needs manual replacement)

## Usage

This template is used by deployment scripts to generate actual task definitions for different environments by substituting the template variables with real values.
