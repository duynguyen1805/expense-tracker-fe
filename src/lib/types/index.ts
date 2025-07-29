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
  goalId: number;
  userId: number;
  goalName: string;
  targetAmount: number;
  deadline: Date;
  autoDeduct: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  notificationId: number;
  userId: number;
  type: "EMAIL" | "PUSH" | "IN_APP";
  title: string;
  message: string;
  status: "PENDING" | "SENT" | "FAILED" | "READ";
  relatedGoalId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFinancialGoalRequest {
  goalName: string;
  targetAmount: number;
  deadline: string;
  autoDeduct: boolean;
}

export interface UpdateFinancialGoalRequest {
  goalName?: string;
  targetAmount?: number;
  deadline?: string;
  autoDeduct?: boolean;
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

export interface NotificationPreferences {
  id: number;
  userId: number;
  email: boolean;
  push: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  expenseAlerts: boolean;
  incomeAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  achievementCelebrations: boolean;
  systemUpdates: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateNotificationPreferencesRequest {
  email?: boolean;
  push?: boolean;
  budgetAlerts?: boolean;
  goalReminders?: boolean;
  expenseAlerts?: boolean;
  incomeAlerts?: boolean;
  weeklyReports?: boolean;
  monthlyReports?: boolean;
  achievementCelebrations?: boolean;
  systemUpdates?: boolean;
}
