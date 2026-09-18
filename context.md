# Indian Supplies Admin — Project Context

This document provides a comprehensive overview of the **Indian Supplies Admin Dashboard** codebase, its directory structure, technical stack, core states, data flow, routing, and recently added components/features.

---

## 1. Project Overview

**Indian Supplies Admin** is the administrative and staff portal for the Indian Supplies wholesale ordering platform. It enables administrators and authorized salesmen to manage retailer accounts, monitor active orders, update product & category catalogs, manage staff credentials, and configure platform settings.

---

## 2. Technical Stack

- **Framework**: Next.js 16.3.0 (using App Router & Turbopack)
- **Runtime**: React 19 & React DOM 19
- **State Management**: Redux Toolkit & Redux Persist (`localStorage` for Auth & Notification slices)
- **URL Search Params Management**: `nuqs` (v2 with Next.js App Router adapter)
- **Data Fetching & Cache**: TanStack React Query (`@tanstack/react-query`)
- **Form Management & Validation**: React Hook Form (`react-hook-form`) & Zod (`zod`)
- **API Client**: Axios (configured with token refresh interceptors & S3 upload helpers)
- **Real-Time Communications**: Socket.io-client (`socket.io-client` with auth `ready` status gating) & Firebase Cloud Messaging (`firebase/app`, `firebase/messaging`)
- **Styling**: Tailwind CSS 4.3.3 + PostCSS
- **Language**: TypeScript 5.7.3

---

## 3. Directory Structure

```
├── app/                      # Next.js App Router folders & pages
│   ├── (auth)/               # Guest authentication views
│   │   └── login/            # Unified staff login page (Admin & Salesman)
│   ├── (dashboard)/          # Protected admin/staff panel pages
│   │   ├── categories/       # Category management (list, new, edit)
│   │   ├── notifications/    # Dedicated Admin Notifications page
│   │   ├── orders/           # Order management
│   │   │   ├── [id]/         # Order detail view (OrderHeader, OrderCustomerDetails, OrderItemsTable)
│   │   │   └── page.tsx      # Admin orders table
│   │   ├── products/         # Product management
│   │   │   ├── [id]/         # Product View (`/products/[id]`) & Edit (`/products/[id]/edit`)
│   │   │   ├── new/          # Product Creation page (`/products/new`)
│   │   │   └── page.tsx      # Products listing page (URL-synced search/filter/pagination)
│   │   ├── salesmen/         # Salesman staff management
│   │   │   ├── [id]/         # Salesman detail/edit view (permissions, status toggle button)
│   │   │   ├── new/          # Salesman creation form (name, email, password, permissions checklist)
│   │   │   └── page.tsx      # Paginated salesmen list (URL-synced search, email column, status badges)
│   │   ├── settings/         # Settings & Staff Profile page with AdminNotificationToggle
│   │   ├── users/            # Retailer user management
│   │   │   ├── [id]/         # Retailer user detail view (profile, saved addresses, order history)
│   │   │   └── page.tsx      # Paginated retailer accounts table with search
│   │   ├── layout.tsx        # Dashboard layout with unified collapsible Sidebar
│   │   └── page.tsx          # Overview / Dashboard metrics page
│   ├── globals.css           # Global Tailwind, base styles, and glassmorphism styling
│   └── layout.tsx            # Root layout configuring Query, Redux, Socket, NuqsAdapter & AdminNotificationListener
│
├── public/
│   └── firebase-messaging-sw.js # Admin FCM Background Service Worker
│
├── components/               # React Components
│   ├── category/             # Category domain components
│   ├── common/               # Shared dashboard & UI components
│   │   ├── CheckboxCard.tsx  # Styled checkbox wrapper for boolean feature flags
│   │   ├── ConfirmModal.tsx  # Accessible modal for destructive actions & form confirmation
│   │   ├── DataTable.tsx     # Generic paginated table with dynamic column width skeletons & row actions
│   │   ├── FormSection.tsx   # Card layout wrapper for grouping related form fields with titles & descriptions
│   │   ├── ImageUploader.tsx # Ultra-compact inline image tile strip (max 3 images, 3MB size limit)
│   │   ├── Input.tsx         # Reusable form text/number input primitive
│   │   ├── KeywordsInput.tsx # Tag/chip input component for search keywords
│   │   ├── PageFilters.tsx   # Filter bar with debounced search input, dropdowns, clear filters button
│   │   ├── PageHeader.tsx    # Header with page title, subtitle stats, and primary action button
│   │   ├── Pagination.tsx    # Smart ellipsis pagination control (`1 ... current ... total`)
│   │   ├── RowActions.tsx    # Table row action trigger menu (View, Edit, Delete)
│   │   ├── Select.tsx        # Custom accessible select dropdown component
│   │   ├── Sidebar.tsx       # Main dashboard navigation sidebar with role/permission filtering
│   │   ├── Skeleton.tsx      # Loading skeleton primitives matching actual column widths
│   │   └── Textarea.tsx      # Textarea component primitive
│   ├── product/              # Product domain components (ProductForm.tsx)
│   ├── salesman/             # Salesman domain components (SalesmanForm.tsx)
│   └── ui/                   # Low-level UI primitives (Button, Modal, etc.)
│
├── constants/                # App Constants
│   ├── api.ts                # Backend API routes mapping
│   ├── product.constants.ts  # Product defaults and unit options constants
│   ├── routes.ts             # App router routing definitions (including SALESMEN routes)
│   └── storage.ts            # Local and session storage keys
│
├── hooks/                    # Reusable Custom React Hooks
│   ├── useAdminFcmLifecycle.ts # Admin FCM token lifecycle hook
│   ├── useAuth.ts            # Authentication profile queries, store hydration & role utilities
│   ├── useDebounce.ts        # Input debouncing hook
│   ├── useProductFilters.ts  # URL query parameter management for Products (`nuqs`)
│   └── useSalesmanFilters.ts # URL query parameter management for Salesmen (`nuqs`)
│
├── lib/                      # Core integration utilities
│   ├── firebase.ts           # Firebase client SDK initialization & Messaging helpers
│   ├── axiosInstance.ts      # Axios request interceptor and refresh token queue
│   ├── store.ts              # Redux store configurations & persist setup
│   ├── format.ts             # Currency and numeric format helpers
│   └── utils.ts              # Styling (cn/clsx/tailwind-merge) helper utilities
│
├── services/                 # Service & React Query hooks
│   ├── auth/                 # Auth API service & `useLogin` mutation hook
│   ├── category/             # Category API service & hooks
│   ├── notification/         # Notification API service & React Query hooks
│   ├── order/                # Order API service & hooks
│   ├── product/              # Product API service & React Query hooks
│   ├── salesman/             # Salesman API service & React Query hooks (`useSalesmen`, `useSalesman`, `useCreateSalesman`, `useUpdateSalesman`, `useToggleSalesmanStatus`)
│   ├── upload/               # Direct S3 upload service
│   └── user/                 # User API service & hooks
│
├── types/                    # TypeScript interfaces and enum declarations
│   ├── auth/                 # AuthUser, EStaffRole, STAFF_ROLE_LABELS, AuthState
│   ├── salesman.types.ts     # ISalesman, SalesmanPermission, SALESMAN_PERMISSION_LABELS
│   └── common.types.ts       # SidebarProps, PageFiltersProps, DataTable column types
│
└── schemas/                  # Zod validation schemas
    ├── auth.ts               # Login schema
    ├── product.ts            # Product create/edit schemas
    └── salesman.ts           # Salesman create/edit schemas
```

---

## 4. Unified Authentication & Role-Based Navigation

- **Unified Login (`/login`)**:
  - Unified entry point for all staff members (Admins and Salesmen).
  - Handles `useLogin` mutation, persists auth state via Redux, and hydrates user profile (`id`, `fullName`, `email`, `role`, `permissions`).
- **Dynamic Navigation Filtering (`Sidebar.tsx`)**:
  - Centralized navigation definitions in `navigation.ts` with metadata flags (`adminOnly`, `permission`).
  - Automatically filters sidebar links based on the authenticated staff member's role and permission array:
    - **Admins** have access to all tabs (Overview, Categories, Products, Orders, Notifications, Salesmen, Users, Settings).
    - **Salesmen** only see tabs permitted by their granular permissions (`category_management`, `product_management`, `order_management`, `user_management`), plus Overview and Settings. `Salesmen` and `Notifications` are hidden.
- **Settings & Profile (`/settings`)**:
  - Dynamically renders role badges (`Super Administrator`, `Sub Administrator`, `Salesman`) using `STAFF_ROLE_LABELS`.
  - Accessible to all staff for account viewing, push notification toggling, and logging out.

---

## 5. Salesman Management Module

- **Salesmen Directory (`/salesmen/page.tsx`)**:
  - Paginated table displaying Name, Email, Creation Date, and Status badge (`Active` / `Inactive`).
  - Search filter wired to URL query params using `useSalesmanFilters` (`nuqs`).
  - Quick row actions: View (`/salesmen/[id]`) and Edit. (Deletion flow intentionally omitted per business rules).
- **Salesman Create (`/salesmen/new/page.tsx`)**:
  - Centered form card (`max-w-4xl`) capturing Full Name, Email, Password, and a visual permissions selector.
  - Granular permissions with descriptive labels: Category Management, Product Management, Order Management, Create Orders, User Management.
  - Redirects back to `/salesmen` upon successful creation.
- **Salesman Edit & Status (`/salesmen/[id]/page.tsx`)**:
  - Edit salesman details and permissions with confirmation.
  - Direct status toggle button in the header card with confirmation modal for activating/deactivating accounts.
  - Redirects back to the salesmen list upon saving changes.

---

## 6. Product Management & Form Workflow

- **Product Form (`ProductForm.tsx`)**:
  - Reusable component shared by `/products/new` and `/products/[id]/edit`.
  - Driven by `react-hook-form` + `zod` schema validation.
  - Supports detailed product fields: Name, Description, Category (Controller wrapped `<Select>`), Unit, Pack Size, Price, Status (`isActive`, `isVatApplicable`), Keywords (`KeywordsInput.tsx`), and Product Media (`ImageUploader.tsx`).
- **Confirmation-First Upload Workflow**:
  - Clicking "Save Changes" or "Create Product" runs form validation and opens `ConfirmModal` **before** uploading any images to AWS S3.
  - When the user confirms in `ConfirmModal`, `uploadService.processFormImages` uploads pending `File` instances to S3, returns confirmed public URLs, and executes the create/update mutation.
  - Modal displays active loading state (`"Processing..."`) while uploading and saving.
- **Product Detail View (`/products/[id]/page.tsx`)**:
  - Clean card layout displaying product metadata, pricing, category, pack size, VAT status, and Product Media gallery.

---

## 7. UI Component Library & Shared Controls

- **`ImageUploader.tsx` & Client Validation (`fileValidation.ts`)**:
  - Ultra-compact inline thumbnail strip (`w-20 h-20` / `w-24 h-24`) with inline `+ Add Image` tile button.
  - Enforces client-side constraints: max 3 images per product, 3MB per image, allowed types (`image/jpeg`, `image/png`, `image/webp`).
- **`DataTable.tsx` & Dynamic Skeletons (`Skeleton.tsx`)**:
  - Table rows support hover-visible action triggers (`RowActions.tsx`).
  - Skeletons calculate width dynamically based on column configurations for layout stability during data fetches.
- **`Pagination.tsx`**:
  - Smart ellipsis pagination rendering (`1 ... current ... total`).
  - Integrated with `isFetching` loading states.
- **Custom Input Primitives**:
  - Reusable `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `CheckboxCard.tsx`, `KeywordsInput.tsx`, `ImageUploader.tsx`, and `FormSection.tsx`.

---

## 8. URL State Management (`nuqs`) & Filtering

- **Nuqs Integration**: `NuqsAdapter` wrapped in root `layout.tsx` for type-safe Next.js App Router URL search parameter synchronization.
- **Filters Hooks (`useProductFilters.ts`, `useSalesmanFilters.ts`)**:
  - Encapsulates `page`, `search`, and custom filter params using `useQueryState` and `useQueryStates`.
  - Configured with `shallow: true` and `history: "push"` for seamless browser back/forward history navigation without losing state on page reloads.
- **Controlled Page Filters Component (`PageFilters.tsx`)**:
  - Uses guarded `useDebounce` (500ms) for local input state (`debouncedValue !== searchQuery`) to eliminate unnecessary API requests while typing.
