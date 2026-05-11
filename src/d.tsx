/* ecommerce-frontend/
├── .env.local                          # Environment variables
├── .gitignore                          # Git ignore file
├── next.config.js                      # Next.js configuration
├── package.json                        # Dependencies
├── postcss.config.js                   # PostCSS configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── README.md                           # Project documentation
├── public/                             # Static assets
│   ├── favicon.ico
│   └── placeholder.jpg
└── src/
    ├── app/                            # Next.js App Router
    │   ├── (auth)/                     # Authentication routes group
    │   │   ├── layout.tsx              # Auth layout
    │   │   ├── login/
    │   │   │   └── page.tsx            # Login page
    │   │   └── register/
    │   │       └── page.tsx            # Register page
    │   ├── (protected)/                # Protected routes group
    │   │   ├── layout.tsx              # Protected layout
    │   │   ├── account/
    │   │   │   └── page.tsx            # User account page
    │   │   ├── cart/
    │   │   │   └── page.tsx            # Shopping cart page
    │   │   ├── checkout/
    │   │   │   └── page.tsx            # Checkout page
    │   │   └── orders/
    │   │       └── page.tsx            # Orders page
    │   ├── (admin)/                    # Admin routes group
    │   │   ├── layout.tsx              # Admin layout
    │   │   └── admin/
    │   │       ├── dashboard/
    │   │       │   └── page.tsx        # Admin dashboard
    │   │       ├── products/
    │   │       │   ├── page.tsx        # Products list
    │   │       │   ├── new/
    │   │       │   │   └── page.tsx    # Create product
    │   │       │   └── edit/
    │   │       │       └── [id]/
    │   │       │           └── page.tsx # Edit product
    │   │       ├── orders/
    │   │       │   └── page.tsx        # Manage orders
    │   │       └── users/
    │   │           └── page.tsx        # Manage users
    │   ├── products/                   # Public product routes
    │   │   └── [slug]/
    │   │       └── page.tsx            # Product detail page
    │   ├── layout.tsx                  # Root layout
    │   ├── page.tsx                    # Home page
    │   ├── providers.tsx               # App providers
    │   └── globals.css                 # Global styles
    ├── components/                     # React components
    │   ├── common/                     # Shared components
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   └── LoadingSpinner.tsx
    │   ├── auth/                       # Authentication components
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   ├── account/                    # Account components
    │   │   └── ProfileForm.tsx
    │   ├── cart/                       # Cart components
    │   │   ├── CartList.tsx
    │   │   ├── CartItem.tsx
    │   │   └── CartSummary.tsx
    │   ├── checkout/                   # Checkout components
    │   │   ├── CheckoutForm.tsx
    │   │   ├── ShippingForm.tsx
    │   │   └── PaymentForm.tsx
    │   ├── products/                   # Product components
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductGrid.tsx
    │   │   ├── ProductFilters.tsx
    │   │   └── ProductDetail.tsx
    │   ├── admin/                      # Admin components
    │   │   ├── products/
    │   │   │   ├── ProductForm.tsx
    │   │   │   ├── ProductTable.tsx
    │   │   │   └── ProductImageUpload.tsx
    │   │   ├── orders/
    │   │   │   ├── OrderTable.tsx
    │   │   │   └── OrderStatusBadge.tsx
    │   │   └── users/
    │   │       ├── UserTable.tsx
    │   │       └── UserRoleBadge.tsx
    │   ├── ui/                         # Reusable UI components
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   └── Modal.tsx
    │   └── providers/                  # Context providers
    │       └── AuthProvider.tsx
    ├── redux/                          # Redux state management
    │   ├── store.ts                    # Redux store configuration
    │   ├── slices/                     # Redux slices
    │   │   ├── authSlice.ts ok
    │   │   ├── productSlice.ts ok
    │   │   ├── cartSlice.ts
    │   │   ├── orderSlice.ts
    │   │   ├── categorySlice.ts
    │   │   └── uiSlice.ts
    │   └── hooks/
    │       └── useRedux.ts             # Typed Redux hooks
    ├── services/                       # API services
    │   ├── api/                        # Backend API calls
    │   │   ├── axios.config.ts  ok       # Axios configuration
    │   │   ├── auth.service.ts ok
    │   │   ├── product.service.ts ok
    │   │   ├── cart.service.ts
    │   │   ├── order.service.ts
    │   │   └── payment.service.ts
    │   └── firebase/   ok                 # Firebase configuration
    │       └── config.ts               # Firebase init (Auth only)
    ├── types/    ok                      # TypeScript type definitions
    │   ├── user.types.ts
    │   ├── product.types.ts
    │   ├── cart.types.ts
    │   └── order.types.ts
    └── hooks/    ok                      # Custom React hooks
        └── useAuthGuard.ts             # Authentication guard hook */




        /* # Core dependencies
npm install @reduxjs/toolkit react-redux axios  ok

# Firebase (Authentication only)
npm install firebase ok

# UI and Forms
npm install react-hook-form react-icons react-hot-toast

# Payment
npm install @stripe/stripe-js @stripe/react-stripe-js

# Theme and Alerts
npm install next-themes sweetalert2 */