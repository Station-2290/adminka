# Station2290 Admin Panel (Adminka)

A modern, comprehensive admin panel for Station2290 coffee shop management, built with Vite, React, TypeScript, and TanStack Router. Part of the Station2290 microservices ecosystem.

## 🚀 Features

### 📊 Dashboard & Analytics
- **Real-time Metrics**: Sales, orders, customer analytics
- **Interactive Charts**: Revenue trends, product performance
- **Order Monitoring**: Live order status and management
- **Performance Insights**: Business intelligence and reporting

### 🛒 Order Management
- **Order Processing**: View, update, and manage all orders
- **Status Tracking**: Complete order lifecycle management
- **Customer Information**: Access customer details and history
- **Real-time Updates**: Live order notifications and status changes

### 📦 Product Management
- **Product Catalog**: Full CRUD operations for products
- **Category Management**: Organize products by categories
- **Inventory Tracking**: Stock levels and availability
- **Pricing Control**: Manage product prices and promotions

### 👥 Customer Management
- **Customer Profiles**: Comprehensive customer information
- **Order History**: Track customer purchase patterns
- **Communication**: Customer service and support tools

### 👤 User & Staff Management
- **Staff Accounts**: Create and manage employee accounts
- **Role-Based Access**: Admin, Manager, Employee permissions
- **Activity Monitoring**: Track staff actions and performance

### 🔧 System Administration
- **API Integration**: Seamless connection to Station2290 API
- **Settings Management**: Configure system preferences
- **Backup & Maintenance**: System health and data management

## 🏗️ Station2290 Architecture

### Microservices Ecosystem

This admin panel is part of the Station2290 coffee shop management system:

- **Infrastructure**: [Station2290-Infrastructure](https://github.com/Station-2290/infrastructure)
- **API Backend**: [Station2290-API](https://github.com/Station-2290/api)
- **Customer Website**: [Station2290-Web](https://github.com/Station-2290/web)
- **WhatsApp Bot**: [Station2290-Bot](https://github.com/Station-2290/bot)
- **Admin Panel**: [Station2290-Adminka](https://github.com/Station-2290/adminka) (this repository)
- **Order Panel**: [Station2290-Order-Panel](https://github.com/Station-2290/order-panel)

### 🔄 Automatic Deployment

This admin panel **deploys automatically** when you push to the `main` branch:

1. **GitHub Actions** builds the Vite application
2. **Creates** optimized static build
3. **Containerizes** with Nginx for production serving
4. **Deploys** to production VPS via SSH
5. **Health checks** ensure panel accessibility

**Production URL**: https://adminka.station2290.ru

## 🛠 Technology Stack

- **Framework**: Vite + React 19
- **Language**: TypeScript
- **Routing**: TanStack Router (file-based routing)
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Theme**: next-themes for dark/light mode
- **Charts**: Recharts for data visualization
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

**For Local Development:**
- Node.js 18+
- pnpm package manager
- Access to Station2290 API (local or remote)
- Admin user account in the system

**For Production Deployment:**
- Infrastructure repository deployed on VPS
- GitHub Secrets configured for automated deployment

### Local Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Station-2290/adminka.git
cd adminka
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Environment Configuration:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Environment Variables:**

**Local Development:**
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# Application Settings
VITE_APP_TITLE=Station2290 Admin
VITE_APP_DESCRIPTION=Coffee Shop Admin Panel

# Development Mode
NODE_ENV=development
```

**Production Environment:**
```bash
# Production API
VITE_API_URL=https://api.station2290.ru/api/v1

# Application Settings
VITE_APP_TITLE=Station2290 Admin
VITE_APP_DESCRIPTION=Coffee Shop Admin Panel

# Production Mode
NODE_ENV=production
```

5. **Start Development Server:**
```bash
pnpm start
# or
pnpm dev
```

**Local Admin Panel**: http://localhost:8080

## 📜 Available Scripts

```bash
# Development
pnpm start        # Start development server (port 8080)
pnpm dev          # Alternative development command

# Building
pnpm build        # Build for production
pnpm serve        # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm check        # Run lint + format

# Testing
pnpm test         # Run tests with Vitest

# API Types
pnpm gen:api      # Generate API types from OpenAPI schema
```

## 📁 Project Structure

```
src/
├── routes/                 # TanStack Router file-based routes
│   ├── __root.tsx         # Root layout
│   ├── index.tsx          # Dashboard home
│   ├── orders/           # Order management routes
│   ├── products/         # Product management routes
│   ├── customers/        # Customer management routes
│   └── settings/         # Settings and configuration
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API services
├── types/                # TypeScript type definitions
└── __generated__/        # Auto-generated API types
```

## 🎯 Core Features

### Dashboard Overview
- **Sales Metrics**: Daily, weekly, monthly revenue
- **Order Statistics**: Order counts, average order value
- **Product Performance**: Best-selling items, inventory alerts
- **Customer Insights**: New customers, repeat customers

### Order Management
- **Order List**: Filterable and sortable order table
- **Order Details**: Complete order information and history
- **Status Updates**: Change order status with real-time updates
- **Print Orders**: Kitchen tickets and customer receipts

### Product Catalog
- **Product Grid/List**: Visual product management interface
- **Add/Edit Products**: Complete product information forms
- **Category Management**: Organize products by categories
- **Bulk Operations**: Mass product updates and imports

### User Management
- **Staff Directory**: Employee profiles and roles
- **Permission Control**: Role-based access management
- **Activity Logs**: Track user actions and changes

## 🔐 Authentication & Authorization

### Access Control
- **Role-Based Permissions**: Admin, Manager, Employee levels
- **Secure Authentication**: Integration with Station2290 API auth
- **Session Management**: Automatic token refresh and logout
- **Protected Routes**: Route-level access control

### User Roles
| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, settings |
| **Manager** | Operations management, reports, staff oversight |
| **Employee** | Order processing, customer service |

## 🎨 Design System

### UI Components
- **shadcn/ui Integration**: Modern, accessible components
- **Consistent Theming**: Dark/light mode support
- **Responsive Design**: Mobile-first approach
- **Data Visualization**: Interactive charts and graphs

### Navigation
- **File-based Routing**: TanStack Router with TypeScript
- **Breadcrumbs**: Clear navigation hierarchy
- **Sidebar Navigation**: Collapsible menu structure
- **Search**: Global search across entities

## 📊 Data Management

### API Integration
- **Type-safe API**: Auto-generated types from OpenAPI schema
- **TanStack Query**: Server state management with caching
- **Real-time Updates**: WebSocket integration for live data
- **Error Handling**: Comprehensive error boundaries

### Form Management
- **React Hook Form**: Performant form handling
- **Zod Validation**: Type-safe form validation
- **Auto-save**: Draft saving for long forms
- **File Uploads**: Image and document upload support

## 🚀 Production Deployment

### Automatic Deployment Process
1. **Build Optimization**: Vite production build with tree-shaking
2. **Static Assets**: Optimized images, CSS, and JavaScript
3. **Nginx Configuration**: Production-ready web server setup
4. **Reverse Proxy**: Integration with infrastructure Nginx
5. **Health Monitoring**: Automated deployment verification

### Performance Features
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component and route lazy loading
- **Caching**: Aggressive caching for static assets
- **Bundle Optimization**: Minimal bundle sizes

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow the established patterns and conventions
3. Write tests for new functionality
4. Run linting and formatting: `pnpm check`
5. Build and test: `pnpm build && pnpm test`
6. Submit a pull request with clear description

### Development Guidelines
- Use TypeScript for all new code
- Follow the component structure and naming conventions
- Implement responsive design for all interfaces
- Add proper error handling and loading states
- Write unit tests for business logic

## 📞 Support

For technical support or questions about the admin panel:
- Create an issue in the GitHub repository
- Check the troubleshooting section in the infrastructure docs
- Contact the development team via organization channels

---

**Station2290 Admin Panel** - Comprehensive management interface for modern coffee shop operations ☕️