# Smart Stock Manager (SmStocks)

A modern stock management and point-of-sale system built with Next.js, React, and TypeScript. Streamline inventory, sales, and reporting in one platform.

## Features

- **Role-based Access**
  - Admin: Full system access
  - Cashier: POS and basic inventory

- **Inventory Management**
  - Product tracking
  - Stock level monitoring
  - Category management

- **Point of Sale**
  - Quick checkout
  - Multiple payment methods
  - Receipt generation

- **Customer Management**
  - Customer profiles
  - Purchase history
  - Returns processing

- **Reporting**
  - Sales analytics
  - Inventory reports
  - Transaction history

## Tech Stack

- **Core**
  - Next.js 14 with App Router
  - React 18 with Hooks
  - TypeScript for type safety
  - Tailwind CSS for styling

- **State & Data**
  - React Context API for global state
  - React Query for server state
  - Zod for schema validation

- **UI Components**
  - Headless UI for accessible components
  - Lucide Icons for consistent iconography
  - Tremor for data visualization

- **Development**
  - ESLint and Prettier for code quality
  - TypeScript for type checking
  - Husky for Git hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL (for future backend integration)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kdrighteo/SmStocks.git
   cd SmStocks
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected routes
│   │   ├── admin/          # Admin dashboard and features
│   │   │   ├── inventory/  # Inventory management
│   │   │   ├── users/      # User management
│   │   │   ├── reports/    # Reporting
│   │   │   └── settings/   # System settings
│   │   └── cashier/        # Cashier interface
│   │       ├── pos/        # Point of Sale
│   │       ├── returns/    # Returns processing
│   │       └── customers/  # Customer management
│   └── ...
├── components/             # Reusable components
│   ├── dashboard/          # Dashboard-specific components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── constants/              # App constants
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## Authentication

The application comes with two default user accounts for testing:

### Admin Account

- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Full access to all features including inventory management and sales reports

### Cashier Account

- **Email**: cashier@example.com
- **Password**: cashier123
- **Access**: Limited to POS and transaction history

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (for future use)
DATABASE_URL=postgresql://user:password@localhost:5432/furniture_showroom
```

## Deployment

### Vercel

The easiest way to deploy this application is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the platform from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Self-Hosting

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
