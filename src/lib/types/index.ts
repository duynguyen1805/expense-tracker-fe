import { EIncomeTypeSourceName } from "../enums/income.enum";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Income {
  incomeId: string;
  sourceName: EIncomeTypeSourceName;
  amount: number;
  customName: string;
  description: string;
  date: Date;
  month: number;
  year: number;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  category: Category;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId: string;
  category: Category;
  period: "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  topCategories: Array<{
    category: Category;
    amount: number;
  }>;
  recentTransactions: Array<Income | Expense>;
}
