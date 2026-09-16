# Indian Supplies Admin — Project Context

This document provides a comprehensive overview of the **Indian Supplies Admin Dashboard** codebase, its directory structure, technical stack, core states, data flow, routing, and recently added components/features.

---

## 1. Project Overview

**Indian Supplies Admin** is the administrative portal for the Indian Supplies wholesale ordering platform. It enables administrators to manage retailer accounts, monitor active orders, update product & category catalogs, and configure platform settings.

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
│   │   └── login/            # Admin email/password login page
│   ├── (dashboard)/          # Protected admin panel pages
│   │   ├── categories/       # Category management (list, new, edit)
│   │   ├── notifications/    # Dedicated Admin Notifications page (list, pagination, mark as read, order link)
│   │   ├── orders/           # Order management
│   │   │   ├── [id]/         # Order detail view (OrderHeader, OrderCustomerDetails, OrderItemsTable)
│   │   │   └── page.tsx      # Admin orders table
│   │   ├── products/         # Product management
│   │   │   ├── [id]/         # Product View (`/products/[id]` with media gallery) & Edit (`/products/[id]/edit`)
│   │   │   ├── new/          # Product Creation page (`/products/new`)
│   │   │   └── page.tsx      # Products listing page with URL-synced search/filter/pagination (sorted newest first)
│   │   ├── settings/         # Settings page with AdminNotificationToggle
│   │   ├── users/            # Retailer user management
│   │   │   ├── [id]/         # Retailer user detail view (profile, saved addresses, order history)
│   │   │   └── page.tsx      # Paginated retailer accounts table with search
│   │   ├── layout.tsx        # Dashboard layout with Sidebar & Header
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
│   │   ├── CheckboxCard.tsx  # Styled checkbox wrapper for boolean feature flags (e.g. Is Active, VAT Applicable)
│   │   ├── ConfirmModal.tsx  # Accessible modal for destructive actions & form confirmation (with isLoading state)
│   │   ├── DataTable.tsx     # Generic paginated table with dynamic column width skeletons & row actions
│   │   ├── FormSection.tsx   # Card layout wrapper for grouping related form fields with titles & descriptions
│   │   ├── ImageUploader.tsx # Ultra-compact inline image tile strip (max 3 images, 3MB size limit, inline + tile)
│   │   ├── Input.tsx         # Reusable form text/number input primitive
│   │   ├── KeywordsInput.tsx # Tag/chip input component for managing string arrays (e.g., search keywords)
│   │   ├── PageFilters.tsx   # Filter bar with debounced search input, category dropdown, clear filters button
│   │   ├── PageHeader.tsx    # Header with page title, subtitle stats, and primary action button
│   │   ├── Pagination.tsx    # Smart ellipsis pagination control (`1 ... current ... total`)
│   │   ├── RowActions.tsx    # Table row hover-action trigger menu (View, Edit, Delete)
│   │   ├── Select.tsx        # Custom accessible select dropdown component
│   │   ├── Sidebar.tsx       # Main dashboard navigation sidebar
│   │   ├── Skeleton.tsx      # Loading skeleton primitives matching actual column widths
│   │   └── Textarea.tsx      # Textarea component primitive
│   ├── product/              # Product domain components
│   │   └── ProductForm.tsx   # Reusable form component for create & edit product flows (zod + react-hook-form + ImageUploader)
│   └── ui/                   # Low-level UI primitives (Button, Modal, etc.)
│
├── constants/                # App Constants
│   ├── api.ts                # Backend API routes mapping (including UPLOAD endpoints)
│   ├── product.constants.ts  # Product defaults and unit options constants
│   ├── routes.ts             # App router routing definitions
│   └── storage.ts            # Local and session storage keys
│
├── hooks/                    # Reusable Custom React Hooks
│   ├── useAdminFcmLifecycle.ts # Admin FCM token lifecycle hook
│   ├── useAuth.ts            # Authentication profile queries & status utilities
│   ├── useDebounce.ts        # Input debouncing hook
│   └── useProductFilters.ts  # Type-safe URL query parameter state management for Products page (`nuqs`)
│
├── lib/                      # Core integration utilities
│   ├── firebase.ts           # Firebase client SDK initialization & Messaging helpers
│   ├── store/                # Redux slices configuration
│   ├── axiosInstance.ts      # Axios request interceptor and refresh token queue
│   ├── store.ts              # Redux store configurations & persist setup
│   ├── format.ts             # Currency and numeric format helpers
│   └── utils.ts              # Styling (cn/clsx/tailwind-merge) helper utilities
│
├── services/                 # Service & React Query hooks
│   ├── category/             # Category API service & hooks
│   ├── notification/         # Notification API service & React Query hooks
│   ├── order/                # Order API service & hooks
│   ├── product/              # Product API service & React Query hooks (`useProducts`, `useProductDetail`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`)
│   ├── upload/               # Direct S3 upload service (`uploadService.ts` with `uploadImages` and `processFormImages`)
│   └── user/                 # User API service & hooks
│
└── utils/                    # Utility scripts & helpers
    └── fileValidation.ts     # Client-side image validation (3MB size, max 3 files, mime types)
```

---

## 4. Product Management & Form Workflow

- **Product Form (`ProductForm.tsx`)**:
  - Reusable component shared by `/products/new` and `/products/[id]/edit`.
  - Driven by `react-hook-form` + `zod` schema validation.
  - Supports detailed product fields: Name, Description, Category (Controller wrapped `<Select>`), Unit, Pack Size, Price, Status (`isActive`, `isVatApplicable`), Keywords (`KeywordsInput.tsx`), and Product Media (`ImageUploader.tsx`).
- **Confirmation-First Upload Workflow**:
  - Clicking "Save Changes" or "Create Product" runs form validation and opens `ConfirmModal` **before** uploading any images to AWS S3.
  - When the user confirms in `ConfirmModal`, `uploadService.processFormImages` uploads pending `File` instances to S3, returns confirmed public URLs, and executes the create/update mutation.
  - Modal displays active loading state (`"Processing..."`) while uploading and saving.
- **Product Detail View (`/products/[id]/page.tsx`)**:
  - Full-width clean card layout displaying product metadata, pricing, category, pack size, VAT status, and Product Media gallery displaying all uploaded product images.
- **Product Navigation & History**:
  - Direct back button handling preserving user navigation history and modal prompt on discarding unsaved changes.

---

## 5. UI Component Library & Shared Controls

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

## 6. URL State Management (`nuqs`) & Filtering

- **Nuqs Integration**: `NuqsAdapter` wrapped in root `layout.tsx` for type-safe Next.js App Router URL search parameter synchronization.
- **Product Filters Hook (`useProductFilters.ts`)**:
  - Encapsulates `page`, `search`, and `category` search params using `useQueryState` and `useQueryStates`.
  - Configured with `shallow: true` and `history: "push"` for seamless browser back/forward history navigation without losing state on page reloads.
- **Controlled Page Filters Component (`PageFilters.tsx`)**:
  - Uses guarded `useDebounce` (500ms) for local input state (`debouncedValue !== searchQuery`) to eliminate unnecessary API requests while typing and prevent URL parameter resetting on page reloads/mount.
