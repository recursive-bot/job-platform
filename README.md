job-platform/
├── api/
├── worker/
├── docker-compose.yml
├── prometheus.yml
└── README.md


# Job Processing Platform

A production-ready job processing platform built using Node.js, PostgreSQL, Redis, RabbitMQ, Docker, Prometheus, and Grafana.

## Features

- JWT Authentication
- Background Job Processing
- RabbitMQ Queues
- Redis Caching
- PostgreSQL Persistence
- Worker Services
- Prometheus Monitoring
- Grafana Dashboards
- Dockerized Services
- Jest Integration Testing
- CI/CD with GitHub Actions

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Redis
- RabbitMQ
- Docker
- Prometheus
- Grafana
- Jest
- GitHub Actions

## Project Architecture

Client
↓
API
↓
PostgreSQL Redis RabbitMQ
↓
Worker
↓
Prometheus
↓
Grafana

## Running Locally

### Clone Repository

git clone <your-repo-url>

cd job-platform

### Start Services

docker compose up --build

## API Endpoints

POST /api/auth/register

POST /api/auth/login

GET /api/users/me

POST /api/jobs

GET /api/jobs/:id

GET /metrics

GET /health

## Monitoring

Prometheus:
http://localhost:9090

Grafana:
http://localhost:3000

RabbitMQ:
http://localhost:15672

## Testing

npm test

npm run coverage