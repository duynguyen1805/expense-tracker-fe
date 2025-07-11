'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockStats: DashboardStats = {
      totalIncome: 5000,
      totalExpenses: 3200,
      balance: 1800,
      monthlyIncome: 2500,
      monthlyExpenses: 1800,
      monthlyBalance: 700,
      topCategories: [
        { category: { id: '1', name: 'Food', type: 'expense', color: '#ef4444', icon: '🍕', userId: '1', createdAt: new Date(), updatedAt: new Date() }, amount: 800 },
        { category: { id: '2', name: 'Transport', type: 'expense', color: '#3b82f6', icon: '🚗', userId: '1', createdAt: new Date(), updatedAt: new Date() }, amount: 600 },
        { category: { id: '3', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: '🎬', userId: '1', createdAt: new Date(), updatedAt: new Date() }, amount: 400 },
      ],
      recentTransactions: [
        { id: '1', amount: 100, description: 'Lunch', categoryId: '1', category: { id: '1', name: 'Food', type: 'expense', color: '#ef4444', icon: '🍕', userId: '1', createdAt: new Date(), updatedAt: new Date() }, date: new Date(), userId: '1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', amount: 50, description: 'Gas', categoryId: '2', category: { id: '2', name: 'Transport', type: 'expense', color: '#3b82f6', icon: '🚗', userId: '1', createdAt: new Date(), updatedAt: new Date() }, date: new Date(), userId: '1', createdAt: new Date(), updatedAt: new Date() },
      ],
    };

    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here&apos;s your financial overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +${stats.monthlyIncome} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.monthlyExpenses} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +${stats.monthlyBalance} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.monthlyBalance / stats.monthlyIncome) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              of income saved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
            <CardDescription>Your highest spending categories this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCategories.map((item, index) => (
                <div key={item.category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: item.category.color }}
                    >
                      {item.category.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.amount} spent
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((item.amount / stats.monthlyExpenses) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: transaction.category.color }}
                    >
                      {transaction.category.icon}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Add Income
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingDown className="h-6 w-6 mb-2" />
              Add Expense
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              Set Budget
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Add Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 