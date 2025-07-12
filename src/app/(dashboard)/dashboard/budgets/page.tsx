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
import { Target, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { Budget, Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Mock data - replace with API calls
    const mockCategories: Category[] = [
      {
        id: "1",
        name: "Food",
        type: "expense",
        color: "#ef4444",
        icon: "🍕",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Transport",
        type: "expense",
        color: "#3b82f6",
        icon: "🚗",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Entertainment",
        type: "expense",
        color: "#8b5cf6",
        icon: "🎬",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Shopping",
        type: "expense",
        color: "#f59e0b",
        icon: "🛍️",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockBudgets: Budget[] = [
      {
        id: "1",
        name: "Food Budget",
        amount: 500,
        spent: 350,
        categoryId: "1",
        category: mockCategories[0],
        period: "monthly",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Transport Budget",
        amount: 200,
        spent: 180,
        categoryId: "2",
        category: mockCategories[1],
        period: "monthly",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setBudgets(mockBudgets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !amount || !categoryId || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    if (!selectedCategory) return;

    const newBudget: Budget = {
      id: editingBudget?.id || Date.now().toString(),
      name,
      amount: parseFloat(amount),
      spent: editingBudget?.spent || 0,
      categoryId,
      category: selectedCategory,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: "1",
      createdAt: editingBudget?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingBudget) {
      setBudgets(
        budgets.map((budget) =>
          budget.id === editingBudget.id ? newBudget : budget
        )
      );
      toast({
        title: "Success",
        description: "Budget updated successfully!",
      });
    } else {
      setBudgets([...budgets, newBudget]);
      toast({
        title: "Success",
        description: "Budget created successfully!",
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setName(budget.name);
    setAmount(budget.amount.toString());
    setCategoryId(budget.categoryId);
    setPeriod(budget.period);
    setStartDate(budget.startDate.toISOString().split("T")[0]);
    setEndDate(budget.endDate.toISOString().split("T")[0]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
    toast({
      title: "Success",
      description: "Budget deleted successfully!",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
    setName("");
    setAmount("");
    setCategoryId("");
    setPeriod("monthly");
    setStartDate("");
    setEndDate("");
  };

  const getProgressPercentage = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  const getProgressColor = (budget: Budget) => {
    const percentage = getProgressPercentage(budget);
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

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
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set and track your spending limits
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? "Edit Budget" : "Create Budget"}
              </DialogTitle>
              <DialogDescription>
                {editingBudget
                  ? "Update your budget details"
                  : "Set a new spending limit"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Budget Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter budget name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
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
                <Label htmlFor="period">Period</Label>
                <Select
                  value={period}
                  onValueChange={(value: "monthly" | "yearly") =>
                    setPeriod(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-fit">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 w-fit">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
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
                  {editingBudget ? "Update" : "Create"} Budget
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const progressPercentage = getProgressPercentage(budget);
          const progressColor = getProgressColor(budget);
          const isOverBudget = budget.spent > budget.amount;

          return (
            <Card
              key={budget.id}
              className={
                isOverBudget ? "border-red-200 bg-red-50 dark:bg-red-950" : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: budget.category.color }}
                    >
                      {budget.category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{budget.name}</CardTitle>
                      <CardDescription>{budget.category.name}</CardDescription>
                    </div>
                  </div>
                  {isOverBudget && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: ${budget.spent}</span>
                    <span>Budget: ${budget.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${progressColor}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progressPercentage.toFixed(1)}% used</span>
                    <span>{budget.period}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <p>
                      Remaining: ${Math.max(budget.amount - budget.spent, 0)}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(budget.startDate).toLocaleDateString()} -{" "}
                      {new Date(budget.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-gray-500">No budgets created yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first budget to start tracking your spending limits
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
