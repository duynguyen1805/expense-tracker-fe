# Expense Tracker Manager

A modern web application for managing Expense Trackers, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication

- Email-based registration with OTP verification
- Secure login/logout functionality
- User session management

### 📊 Dashboard

- Financial overview with key metrics
- Income and expense summaries
- Monthly balance tracking
- Top spending categories
- Recent transactions

### 💰 Income Management

- Add, edit, and delete income entries
- Categorize income sources
- Track income history
- Monthly income statistics

### 💸 Expense Tracking

- Comprehensive expense management
- Category-based organization
- Spending analysis by category
- Expense history and trends

### 🎯 Budget Management

- Set spending limits by category
- Visual progress indicators
- Budget alerts and notifications
- Monthly and yearly budget periods

### 🎯 Financial Goals

- Set and track financial objectives
- Progress visualization
- Deadline management
- Goal completion tracking

### ⚙️ Settings

- User profile management
- Notification preferences
- Theme customization
- Data export and privacy settings

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd personal-finance-fe
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── (dashboard)/      # Dashboard pages
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── budgets/
│   │   ├── goals/
│   │   └── settings/
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   └── forms/           # Form components
├── lib/
│   ├── types/           # TypeScript interfaces
│   ├── api/             # API client
│   ├── context/         # React contexts
│   └── utils/           # Utility functions
└── hooks/               # Custom React hooks
```

## Key Features

### Authentication Flow

1. User registers with email and password
2. OTP verification email is sent
3. User verifies email with OTP
4. User can log in with email/password

### Dashboard Overview

- Total income, expenses, and balance
- Monthly financial summaries
- Top spending categories
- Recent transactions
- Quick action buttons

### Data Management

- CRUD operations for all financial data
- Real-time updates
- Data validation
- Error handling

## Backend Integration

The app is designed to work with a backend API that includes:
https://github.com/duynguyen1805/expense-tracker-api

- **Tables**: users, income, expenses, budgets, categories, financial_goals
- **Authentication**: JWT tokens with email OTP verification
- **API Endpoints**: RESTful API for all CRUD operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
