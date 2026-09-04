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
│   ├── common/               # Shared dashboard components (Input, ConfirmModal, PaginatedDropdown)
│   │   └── PaginatedDropdown # Multi-select search & paginated dropdown component
│   ├── product/              # Product domain components
│   │   └── ProductForm       # 2-column grid product form with description & related products picker
│   └── ui/                   # Low-level UI primitives (e.g. Button component)
│
├── constants/                # App Constants
│   ├── api.ts                # Backend API routes mapping
│   └── routes.ts             # App router routing definitions (protected & guest)
│
├── hooks/                    # Reusable Custom React Hooks
│   ├── useAuth.ts            # Authentication profile queries & status utilities
│   └── useDebounce.ts        # Input debouncing hook for dropdown search
│
├── lib/                      # Core integration utilities
│   ├── store/                # Redux slices configuration (authSlice.ts)
│   ├── axiosInstance.ts      # Axios request interceptor and refresh token queue
│   ├── store.ts              # Redux store configurations & persist setup
│   └── format.ts             # Currency and numeric format helpers
│
├── listeners/                # Socket & Event Listener Subscriptions
│   └── socket/               # Modular Socket.io listeners
│       ├── index.ts          # Central socket listener registration
│       ├── toast.listener.ts  # Real-time toast notifications
│       ├── order.listener.ts  # Real-time order status updates & query invalidations
│       └── product.listener.ts# Real-time product inventory updates & query invalidations
│
├── providers/                # Context & Injection Providers
│   ├── auth-initializer.tsx  # Global Route Guard redirect handler
│   ├── query-provider.tsx    # Tanstack React Query context injection
│   ├── redux-provider.tsx    # Redux Store wrapper injection
│   └── socket-provider.tsx   # Socket.io connection manager & listener initializer
│
└── types/                    # Core TypeScript Interfaces
    ├── address.types.ts      # AddressPayload definitions
    ├── common.types.ts       # Shared payload definitions (e.g. SocketToastPayload)
    ├── product/              # Product domain types (ProductRow, ProductPayload, ProductFormValues)
    └── auth/                 # Authentication payload schemas
```

---

## 4. State Management & Authentication

- **Redux Persist**: Persistent token-based session management. The access token and authenticated user payload are stored in the browser's `sessionStorage` using the key `auth`.
- **Token-Based Sessions**: Requests include the `Authorization: Bearer <accessToken>` header. On expiration (401), the Axios interceptor in [axiosInstance.ts](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/lib/axiosInstance.ts) automatically queues failed requests and performs a refresh request using the backend cookie token before retrying.
- **Login Flow**: Standard login via Email and Password directly communicating with `/api/v1/admin/auth/login`.

---

## 5. Real-Time WebSockets Integration (Socket.io)

- **Provider**: Handled via [SocketProvider](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/providers/socket-provider.tsx), which connects to the backend Socket server when authenticated and handles reconnection logic automatically.
- **Modular Listeners**: Socket event handling is modularized under `src/listeners/socket/`:
  - `toast.listener.ts`: Subscribes to notification/toast events and triggers UI alerts.
  - `order.listener.ts`: Listens for order placement/status updates and invalidates relevant TanStack React Query keys (e.g. orders list/detail cache).
  - `product.listener.ts`: Listens for product catalog changes and triggers cache revalidation.
- **Query Invalidation**: Received socket events automatically call `queryClient.invalidateQueries()` for instant UI state synchronization without requiring full manual re-fetching.

---

## 6. Dashboard Routing

Located in [routes.ts](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/constants/routes.ts):

- **Protected Routes**:
  - `ROUTES.HOME` (`/` - Overview Dashboard metrics)
  - `ROUTES.ORDERS` (`/orders` - Order management)
  - `ROUTES.PRODUCTS` (`/products` - Catalog configuration)
  - `ROUTES.USERS` (`/users` - Retailer verification)
  - `ROUTES.SETTINGS` (`/settings` - App preferences)
- **Guest Routes**:
  - `ROUTES.LOGIN` (`/login` - Console Access Login)
