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
- **Real-Time Communications**: Socket.io-client (`socket.io-client`) & Firebase Cloud Messaging (`firebase/app`, `firebase/messaging`)
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
│   │   ├── notifications/    # Dedicated Admin Notifications page (list, pagination, mark as read, order link)
│   │   ├── orders/           # Order management
│   │   │   ├── [id]/         # Order detail view (OrderHeader, OrderCustomerDetails, OrderItemsTable)
│   │   │   └── page.tsx      # Admin orders table
│   │   ├── products/         # Product management (list, new, edit)
│   │   ├── settings/         # Settings page with AdminNotificationToggle
│   │   ├── users/            # Retailer user management
│   │   │   ├── [id]/         # Retailer user detail view (profile, saved addresses, order history)
│   │   │   └── page.tsx      # Paginated retailer accounts table with search
│   │   ├── layout.tsx        # Dashboard layout with Sidebar & Header
│   │   └── page.tsx          # Overview / Dashboard metrics page
│   ├── globals.css           # Global Tailwind and base styles
│   └── layout.tsx            # Root layout configuring Query, Redux, Socket, & AdminNotificationListener
│
├── public/
│   └── firebase-messaging-sw.js # Admin FCM Background Service Worker
│
├── components/               # React Components
│   ├── category/             # Category domain components
│   ├── common/               # Shared dashboard components (Input, ConfirmModal, ErrorView, Loader, AdminNotificationListener, AdminNotificationToggle, PaginatedDropdown)
│   ├── order/                # Order components
│   │   ├── order-header.tsx  # Order title, timestamp, status badge, & Mark as Delivered with ConfirmModal confirmation
│   │   ├── order-customer-details.tsx # Retailer contact info, phone, email, & delivery address
│   │   └── order-items-table.tsx     # Financial summary box (Subtotal, VAT, Total) positioned above itemized product table
│   ├── product/              # Product domain components
│   └── ui/                   # Low-level UI primitives (Button, Modal, etc.)
│
├── constants/                # App Constants
│   ├── api.ts                # Backend API routes mapping
│   ├── routes.ts             # App router routing definitions (including NOTIFICATIONS: "/notifications")
│   └── storage.ts            # Local and session storage keys (FCM_TOKEN, NOTIFICATIONS_ENABLED, NOTIF_BANNER_DISMISSED)
│
├── hooks/                    # Reusable Custom React Hooks
│   ├── useAdminFcmLifecycle.ts # Admin FCM token lifecycle hook (syncs admin device tokens via /admin/notification/devices/sync)
│   ├── useAuth.ts            # Authentication profile queries & status utilities (returns user & ready state)
│   └── useDebounce.ts        # Input debouncing hook for dropdown search
│
├── lib/                      # Core integration utilities
│   ├── firebase.ts           # Firebase client SDK initialization & Messaging helpers
│   ├── store/                # Redux slices configuration (authSlice.ts, notificationSlice.ts)
│   ├── axiosInstance.ts      # Axios request interceptor and refresh token queue
│   ├── store.ts              # Redux store configurations & persist setup
│   └── format.ts             # Currency and numeric format helpers
│
├── listeners/                # Socket & Event Listener Subscriptions
│   └── socket/               # Modular Socket.io listeners
│       ├── index.ts          # Central socket listener registration
│       ├── toast.listener.ts  # Real-time toast notifications
│       └── order.listener.ts  # Real-time order:created event listener (invalidates queryKey ["admin", "orders"] & shows toast with action link)
│
├── providers/                # Context & Injection Providers
│   ├── auth-initializer.tsx  # Global Route Guard redirect handler
│   ├── query-provider.tsx    # Tanstack React Query context injection
│   ├── redux-provider.tsx    # Redux Store wrapper injection
│   └── socket-provider.tsx   # Socket.io connection manager & listener initializer
│
├── services/                 # Service & React Query hooks
│   ├── category/             # Category API service & hooks
│   ├── notification/         # Notification API service & React Query hooks (useNotificationsQuery, useUnreadCountQuery, useMarkReadMutation, useSyncDevice, useRemoveDevice)
│   ├── order/                # Order API service & hooks
│   ├── product/              # Product API service & hooks
│   └── user/                 # User API service & hooks
│
└── types/                    # Core TypeScript Interfaces
    ├── address.types.ts      # AddressPayload definitions
    ├── category.types.ts     # Category schema & payload definitions
    ├── common.types.ts       # Shared payload definitions
    ├── notification.types.ts # INotificationState & NotificationItem definitions
    ├── order.types.ts        # OrderHeaderProps, OrderCustomerDetailsProps, OrderItemsTableProps
    ├── product/              # Product domain types
    └── auth/                 # Authentication payload schemas
```

---

## 4. State Management, WebSockets & FCM Lifecycle

- **Redux Persist**: Persistent token-based session management. Access token and authenticated user payload are stored in browser `sessionStorage` under `auth`.
- **WebSocket & FCM Push Dual Synchronization**:
  - `Socket.io`: Receives `order:created` events in real-time, auto-invalidating `["admin", "orders"]` React Query cache.
  - `FCM Push`: `useAdminFcmLifecycle` registers service worker, fetches token, and syncs with `/admin/notification/devices/sync`. `AdminNotificationListener` handles foreground pushes and displays toast notifications with direct order navigation (`ROUTES.ORDER_DETAIL(id)`).
- **Admin Notifications View (`/notifications`)**:
  - Displays paginated database notification records fetched from `GET /admin/notification?page=...&limit=...`.
  - Supports marking items as read (`PATCH /admin/notification/:id/read`) and clicking on order notifications directly navigates to order details.
- **Order Details Screen**:
  - Modularized into `OrderHeader`, `OrderCustomerDetails`, and `OrderItemsTable`.
  - `OrderHeader` includes status badges (`IN_PROCESS`, `DELIVERED`) and a `ConfirmModal` for status transitions (`Mark as Delivered`).
  - `OrderItemsTable` displays the financial summary (`Subtotal`, `VAT`, `Total Order Amount`) positioned at the top before itemized rows.
