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

> I built this API to understand how real SaaS platforms actually handle billing, not just
> how to call a payment API. That meant designing multi-tenancy and RBAC from day one instead
> of retrofitting it later, treating Stripe Checkout as one step in an asynchronous flow rather
> than a single request/response, and learning — the hard way, through real signature failures
> and 404s — why webhooks, not redirect URLs, are the only trustworthy source of truth for
> subscription state. Every organization, membership, invitation, and subscription record in
> this system reflects a deliberate architectural decision, not a shortcut.