# Smart Stock Manager

A comprehensive inventory and point-of-sale (POS) system for furniture and bedding showrooms, built with Next.js, React, and TypeScript.

## Features

- **Role-based access control** (Admin and Cashier roles)
- **Inventory Management** - Track products, stock levels, and categories
- **Point of Sale** - Process sales with multiple payment methods
- **Sales Reporting** - View sales analytics and transaction history
- **Responsive Design** - Works on desktop and tablet devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Headless UI, Hero Icons
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts

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
│   │   └── cashier/        # Cashier interface
│   └── ...
├── components/             # Reusable components
│   ├── dashboard/          # Dashboard-specific components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── constants/              # App constants
├── context/                # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
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
