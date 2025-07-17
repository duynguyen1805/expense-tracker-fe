"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingDown, Plus, Edit, Trash2 } from "lucide-react";
import { Expense, Category, Budget } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/context/auth-context";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load categories
        const categoriesResponse: any = await api.categories.getAll();
        const budgetsResponse: any = await api.budgets.getAll();
        if (categoriesResponse.data.success && categoriesResponse.data.data) {
          setCategories(categoriesResponse.data.data);
        }
        if (budgetsResponse.data.success && budgetsResponse.data.data) {
          setBudgets(budgetsResponse.data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !budgetId || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const selectedBudget = budgets.find((b) => b.budgetId === budgetId);
    if (!selectedBudget) return;

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      amount: parseFloat(amount),
      description,
      budgetId,
      budget: selectedBudget,
      date: new Date(date),
      userId: user?.id || "",
      createdAt: editingExpense?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingExpense) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingExpense.id ? newExpense : expense
        )
      );
      toast({
        title: "Success",
        description: "Expense updated successfully!",
      });
    } else {
      setExpenses([...expenses, newExpense]);
      toast({
        title: "Success",
        description: "Expense added successfully!",
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    setBudgetId(expense.budgetId);
    setDate(expense.date.toISOString().split("T")[0]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted successfully!",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
    setAmount("");
    setDescription("");
    setBudgetId("");
    setDate("");
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  // thống kê expenses theo budget
  const expensesByBudget = budgets
    .map((budget) => {
      const budgetExpenses = expenses.filter(
        (expense) => expense.budgetId === budget.budgetId
      );
      const total = budgetExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      return { budget, total, count: budgetExpenses.length };
    })
    .filter((item) => item.count > 0);

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
          <p className="text-gray-600 dark:text-gray-400">
            Track your spending
          </p>
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
              <DialogTitle>
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </DialogTitle>
              <DialogDescription>
                {editingExpense
                  ? "Update your expense details"
                  : "Add a new expense entry"}
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
                <Label htmlFor="budget">Budget</Label>
                <Select value={budgetId} onValueChange={setBudgetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((budget) => (
                      <SelectItem key={budget.budgetId} value={budget.budgetId}>
                        {budget.budgetName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-fit">
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpense ? "Update" : "Add"} Expense
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
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} expense entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses by Category */}
      {expensesByBudget.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Budget</CardTitle>
            <CardDescription>Breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expensesByBudget.map((item) => (
                <div
                  key={item.budget.budgetId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{
                        backgroundColor:
                          item.budget.category?.categoryColor || "#ccc",
                      }}
                    >
                      {item.budget.category?.categoryIcon || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{item.budget.budgetName}</p>
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
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor:
                          expense.budget.category?.categoryColor || "#ccc",
                      }}
                    >
                      {expense.budget.category?.categoryIcon || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.budget.category?.categoryName || "No Category"}{" "}
                        • {new Date(expense.date).toLocaleDateString()}
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
