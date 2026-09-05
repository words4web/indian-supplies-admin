# Indian Supplies Admin — Project Context

This document provides a comprehensive overview of the **Indian Supplies Admin Dashboard** codebase, its directory structure, technical stack, core states, data flow, and routing.

---

## 1. Project Overview

**Indian Supplies Admin** is the administrative portal for the Indian Supplies wholesale ordering platform. It enables administrators to manage retailer accounts, monitor active orders, update product & category catalogs, and configure platform settings.

---

## 2. Technical Stack

- **Framework**: Next.js 16.3.0 (using App Router & Turbopack)
- **Runtime**: React 19 & React DOM 19
- **State Management**: Redux Toolkit & Redux Persist (Session Storage)
- **Data Fetching & Cache**: TanStack React Query (`@tanstack/react-query`)
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
│   │   ├── categories/       # Category management (list, new, edit)
│   │   │   ├── [id]/         # Category details view
│   │   │   │   └── edit/     # Edit category page
│   │   │   ├── new/          # Create category page
│   │   │   └── page.tsx      # Categories table list
│   │   ├── orders/           # Order management (list, details)
│   │   ├── products/         # Product management (list, new, edit)
│   │   ├── layout.tsx        # Dashboard layout with Sidebar & Header
│   │   └── page.tsx          # Overview / Dashboard metrics page
│   ├── globals.css           # Global Tailwind and base styles
│   └── layout.tsx            # Root layout configuring Query & Redux providers
│
├── components/               # React Components
│   ├── category/             # Category domain components (CategoryForm, etc.)
│   ├── common/               # Shared dashboard components (Input, ConfirmModal, PaginatedDropdown)
│   │   └── PaginatedDropdown # Multi-select search & paginated dropdown component
│   ├── order/                # Order status handlers & modal details
│   ├── product/              # Product domain components
│   │   └── ProductForm       # 2-column grid product form with description & related products picker
│   └── ui/                   # Low-level UI primitives (Button, etc.)
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
├── services/                 # Service & React Query hooks
│   ├── category/             # Category API service & hooks
│   ├── order/                # Order API service & hooks
│   ├── product/              # Product API service & hooks
│   └── user/                 # User API service & hooks
│
└── types/                    # Core TypeScript Interfaces
    ├── address.types.ts      # AddressPayload definitions
    ├── category.types.ts     # Category schema & payload definitions
    ├── common.types.ts       # Shared payload definitions (e.g. SocketToastPayload)
    ├── product/              # Product domain types (ProductRow, ProductPayload, ProductFormValues)
    └── auth/                 # Authentication payload schemas
```

---

## 4. State Management & Authentication

- **Redux Persist**: Persistent token-based session management. Access token and authenticated user payload are stored in browser `sessionStorage` under `auth`.
- **Token-Based Sessions**: Requests include the `Authorization: Bearer <accessToken>` header. On expiration (401), the Axios interceptor in `src/lib/axiosInstance.ts` queues failed requests and performs a refresh request using the backend cookie token before retrying.
- **Login Flow**: Login via Email and Password directly communicating with `/api/v1/admin/auth/login`.

---

## 5. Real-Time WebSockets Integration (Socket.io)

- **Provider**: Handled via [SocketProvider](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/providers/socket-provider.tsx), connecting to the backend Socket server when authenticated.
- **Modular Listeners**: Located under `src/listeners/socket/`:
  - `toast.listener.ts`: Subscribes to notification/toast events and triggers UI alerts.
  - `order.listener.ts`: Listens for order placement (`order:created` with `_id`), displaying interactive Sonner toasts with action redirect button to `/orders?id=<_id>`, and invalidates order queries.
  - `product.listener.ts`: Listens for product catalog changes and triggers cache revalidation.

---

## 6. Dashboard Routing

Located in [routes.ts](file:///home/mazahir/projects/work/Indian%20Supplies/admin/src/constants/routes.ts):

- **Protected Routes**:
  - `ROUTES.HOME` (`/`)
  - `ROUTES.ORDERS` (`/orders`)
  - `ROUTES.PRODUCTS` (`/products`)
  - `ROUTES.CATEGORIES` (`/categories`)
  - `ROUTES.USERS` (`/users`)
  - `ROUTES.SETTINGS` (`/settings`)
- **Guest Routes**:
  - `ROUTES.LOGIN` (`/login`)
