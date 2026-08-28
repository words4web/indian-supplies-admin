# Indian Supplies Admin — Project Context

This document provides a comprehensive overview of the **Indian Supplies Admin Dashboard** codebase, its directory structure, technical stack, core states, data flow, and routing.

---

## 1. Project Overview

**Indian Supplies Admin** is the administrative portal for the Indian Supplies wholesale ordering platform. It enables administrators to manage retailer accounts, monitor active orders, update product catalogs, and configure platform settings.

---

## 2. Technical Stack

- **Framework**: Next.js 16.3.0 (using App Router & Turbopack)
- **Runtime**: React 19 & React DOM 19
- **State Management**: Redux Toolkit & Redux Persist (Session Storage)
- **Data Fetching & Cache**: Tanstack React Query (`@tanstack/react-query`)
- **API Client**: Axios (configured with token refresh interceptors)
- **Styling**: Tailwind CSS 4.3.3 + PostCSS
- **Language**: TypeScript 5.7.3

---

## 3. Directory Structure

```
├── app/                      # Next.js App Router folders & pages
│   ├── (auth)/               # Guest authentication views
│   │   └── login/            # Admin email/password login page
│   ├── (dashboard)/          # Protected admin panel pages
│   │   ├── layout.tsx        # Dashboard layout with Sidebar & Header
│   │   └── page.tsx          # Overview / Dashboard metrics page
│   ├── globals.css           # Global Tailwind and base styles
│   └── layout.tsx            # Root layout configuring Query & Redux providers
│
├── components/               # React Components
│   ├── common/               # Shared dashboard components (Input, ConfirmModal)
│   └── ui/                   # Low-level UI primitives (e.g. Button component)
│
├── constants/                # App Constants
│   ├── api.ts                # Backend API routes mapping
│   └── routes.ts             # App router routing definitions (protected & guest)
│
├── hooks/                    # Reusable Custom React Hooks
│   └── useAuth.ts            # Authentication profile queries & status utilities
│
├── lib/                      # Core integration utilities
│   ├── store/                # Redux slices configuration (authSlice.ts)
│   ├── axiosInstance.ts      # Axios request interceptor and refresh token queue
│   ├── store.ts              # Redux store configurations & persist setup
│   └── format.ts             # Currency and numeric format helpers
│
├── providers/                # Context & Injection Providers
│   ├── auth-initializer.tsx  # Global Route Guard redirect handler
│   ├── query-provider.tsx    # Tanstack React Query context injection
│   └── redux-provider.tsx    # Redux Store wrapper injection
│
└── types/                    # Core TypeScript Interfaces
    ├── address.types.ts      # AddressPayload definitions
    └── auth/                 # Authentication payload schemas
```

---

## 4. State Management & Authentication

- **Redux Persist**: Persistent token-based session management. The access token and authenticated user payload are stored in the browser's `sessionStorage` using the key `auth`.
- **Token-Based Sessions**: Requests include the `Authorization: Bearer <accessToken>` header. On expiration (401), the Axios interceptor in [axiosInstance.ts](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/lib/axiosInstance.ts) automatically queues failed requests and performs a refresh request using the backend cookie token before retrying.
- **Login Flow**: Standard login via Email and Password directly communicating with `/api/v1/admin/auth/login`.

---

## 5. Dashboard Routing

Located in [routes.ts](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/constants/routes.ts):

- **Protected Routes**:
  - `ROUTES.HOME` (`/` - Overview Dashboard metrics)
  - `ROUTES.ORDERS` (`/orders` - Order management)
  - `ROUTES.PRODUCTS` (`/products` - Catalog configuration)
  - `ROUTES.USERS` (`/users` - Retailer verification)
  - `ROUTES.SETTINGS` (`/settings` - App preferences)
- **Guest Routes**:
  - `ROUTES.LOGIN` (`/login` - Console Access Login)
