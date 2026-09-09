# Multi-Tenant SaaS Billing API

A NestJS-based REST API for multi-tenant SaaS applications, featuring organization-based
role-based access control, JWT authentication with Redis-backed token revocation, team
invitations, and Stripe-powered subscription billing with webhook-driven state sync.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=flat&logo=stripe&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens)

> I built this API to go beyond CRUD and tackle what actually makes SaaS backends hard — multi-tenant data isolation, per-organization RBAC, and billing state that stays correct even when payments happen asynchronously, off my server, out of my control. It pushed me to trust verified events over assumptions and build like production reliability actually matters.

## Core Features

- **User Authentication** - Register and login with JWT-based token authentication, backed by a Redis token denylist for real logout and session revocation
- **Multi-Tenant Organizations** - Create organizations with automatic owner membership and fully isolated, organization-scoped data
- **Role-Based Access Control (RBAC)** - OWNER, ADMIN, and MEMBER roles with permission enforcement on every sensitive route
- **Team invitations** - Token-based, expiring invitations scoped to organization and role, with email-matched acceptance to prevent invite hijacking
- **Subscription billing** - Stripe Checkout integration for Free → Pro upgrades, with subscription state synced through signature-verified, idempotent webhook events
- **Data Validation** - Request DTOs with class-validator for input validation
- **Database** - PostgreSQL with Prisma ORM and automatic migrations
- **API Documentation** - Interactive Swagger (OpenAPI) documentation for exploring and testing API endpoints
- **Containerization** - Docker and Docker Compose setup for PostgreSQL and Redis with environment-based configuration
- **Production Deployment** - (in progress)
