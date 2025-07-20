import { ECategoriesType } from "../enums/category.enum";
import { EIncomeTypeSourceName } from "../enums/income.enum";

export enum EnumUserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: EnumUserStatus;
  accountType: string;
  lastChangePasswordAt: Date;
  isFrozen: boolean;
  avatar: number;
  isTwoFactorAuthEnabled: boolean;
  twoFactorAuthSecret: string;
  timeActiveTwoFactorAuth: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  theme?: "light" | "dark" | "system";
  currency?: "VND" | "USD" | "EUR" | "GBP";
}

export interface Category {
  categoryId: string;
  categoryName: string;
  typeCategory: ECategoriesType;
  categoryColor: string;
  categoryIcon: string;
  userId: string;
  isActive: boolean;
  allocatedAmount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Income {
  incomeId: string;
  sourceName: EIncomeTypeSourceName;
  amount: number;
  customName: string;
  description: string;
  date: Date | string;
  month: number;
  year: number;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Expense {
  expenseId: string;
  amount: number;
  description: string;
  budgetId: string;
  budgets: Budget;
  expenseDate: Date | string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  budgetId: string;
  budgetName: string;
  totalAmount: number;
  spent: number;
  categoryId: string;
  category: Category;
  period: "MONTHLY" | "YEARLY"; // "monthly" | "yearly";
  startDate: Date | string;
  endDate: Date | string;
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

export interface DashboardCategory {
  categoryId: string;
  categoryName: string;
  typeCategory: string;
  categoryColor: string;
  categoryIcon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTopCategory {
  category: DashboardCategory;
  amount: number;
}

export interface DashboardTransaction {
  expenseId: string;
  amount: number;
  description: string;
  categoryId: string;
  category: DashboardCategory;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  topCategories: DashboardTopCategory[];
  recentTransactions: DashboardTransaction[];
}
