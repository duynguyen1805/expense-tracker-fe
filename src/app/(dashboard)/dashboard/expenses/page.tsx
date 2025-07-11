'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, Plus, Edit, Trash2 } from 'lucide-react';
import { Expense, Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Mock data - replace with API calls
    const mockCategories: Category[] = [
      { id: '1', name: 'Food', type: 'expense', color: '#ef4444', icon: '🍕', userId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'Transport', type: 'expense', color: '#3b82f6', icon: '🚗', userId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: '🎬', userId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '4', name: 'Shopping', type: 'expense', color: '#f59e0b', icon: '🛍️', userId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '5', name: 'Bills', type: 'expense', color: '#06b6d4', icon: '📄', userId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '6', name: 'Other', type: 'expense', color: '#6b7280', icon: '📦', userId: '1', createdAt: new Date(), updatedAt: new Date() },
    ];

    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 50,
        description: 'Lunch at restaurant',
        categoryId: '1',
        category: mockCategories[0],
        date: new Date('2024-01-15'),
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        amount: 30,
        description: 'Gas for car',
        categoryId: '2',
        category: mockCategories[1],
        date: new Date('2024-01-14'),
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        amount: 25,
        description: 'Movie tickets',
        categoryId: '3',
        category: mockCategories[2],
        date: new Date('2024-01-13'),
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setExpenses(mockExpenses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !categoryId || !date) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) return;

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      amount: parseFloat(amount),
      description,
      categoryId,
      category: selectedCategory,
      date: new Date(date),
      userId: '1',
      createdAt: editingExpense?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingExpense) {
      setExpenses(expenses.map(expense => expense.id === editingExpense.id ? newExpense : expense));
      toast({
        title: 'Success',
        description: 'Expense updated successfully!',
      });
    } else {
      setExpenses([...expenses, newExpense]);
      toast({
        title: 'Success',
        description: 'Expense added successfully!',
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    setCategoryId(expense.categoryId);
    setDate(expense.date.toISOString().split('T')[0]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: 'Success',
      description: 'Expense deleted successfully!',
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate('');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { category, total, count: categoryExpenses.length };
  }).filter(item => item.count > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your spending</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
              <DialogDescription>
                {editingExpense ? 'Update your expense details' : 'Add a new expense entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpense ? 'Update' : 'Add'} Expense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} expense entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses by Category */}
      {expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expensesByCategory.map((item) => (
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
                        {item.count} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">${item.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((item.total / totalExpenses) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>Your expense entries</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No expense entries yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: expense.category.color }}
                    >
                      {expense.category.icon}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category.name} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-red-600">-${expense.amount}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 