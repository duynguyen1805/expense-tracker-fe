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

import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/context/auth-context";
import { formatCurrencyVND } from "@/lib/utils";

export default function BudgetsPage() {
  const { user } = useAuth();
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
  const [_selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [period, setPeriod] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load categories
        const categoriesResponse: any = await api.categories.getAll();
        const budgetsReponse: any = await api.budgets.getAll();
        if (categoriesResponse.data.success && categoriesResponse.data.data) {
          setCategories(categoriesResponse.data.data);
        }
        if (budgetsReponse.data.success && budgetsReponse.data.data) {
          setBudgets(budgetsReponse.data.data);
        }
      } catch (error: unknown) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

    const newBudget = {
      budgetName: name,
      totalAmount: parseFloat(amount),
      spent: editingBudget?.spent || 0,
      categoryId: +categoryId,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: user?.id || "",
      createdAt: editingBudget?.createdAt || new Date(),
      updatedAt: new Date(),
      category: categories.find((cat) => cat.categoryId === categoryId)!,
    };

    if (editingBudget) {
      const response = await api.budgets.update(
        editingBudget.budgetId,
        newBudget
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Budget updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update budget",
          variant: "destructive",
        });
      }
    } else {
      const response = await api.budgets.create(newBudget);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Budget created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create budget",
          variant: "destructive",
        });
      }
    }

    // Reload budgets
    const getAllBudgets: any = await api.budgets.getAll();
    if (getAllBudgets.data.success && getAllBudgets.data.data) {
      setBudgets(getAllBudgets.data.data);
    }

    handleCloseDialog();
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, ""); // chỉ lấy số
    setAmount(raw);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setName(budget.budgetName);
    setAmount(budget.totalAmount.toString());
    setCategoryId(budget.categoryId.toString());
    setSelectedCategory(budget.category);
    setPeriod(budget.period);
    setStartDate(
      typeof budget.startDate === "string"
        ? budget.startDate.split("T")[0]
        : budget.startDate.toISOString().split("T")[0]
    );
    setEndDate(
      typeof budget.endDate === "string"
        ? budget.endDate.split("T")[0]
        : budget.endDate.toISOString().split("T")[0]
    );
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.budgetId !== id));
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
    setSelectedCategory(null);
    setPeriod("MONTHLY");
    setStartDate("");
    setEndDate("");
  };

  const getProgressPercentage = (budget: Budget) => {
    return Math.min((budget.spent / budget.totalAmount) * 100, 100);
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
                  onChange={(e) => handleChangeAmount(e)}
                  required
                />
                {amount && (
                  <p className="text-sm text-gray-500">
                    = {formatCurrencyVND(Number(amount))}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={categoryId}
                  onValueChange={(categoryId) => {
                    const found =
                      categories.find((cat) => cat.categoryId === categoryId) ||
                      null;
                    setSelectedCategory(found);
                    setCategoryId(categoryId);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem
                        key={category.categoryId.toString()}
                        value={category.categoryId.toString()}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{category.categoryIcon}</span>
                          {category.categoryName}
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
                  onValueChange={(value: "MONTHLY" | "YEARLY") =>
                    setPeriod(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
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
          const isOverBudget = budget.spent > budget.totalAmount;

          return (
            <Card
              key={budget.budgetId}
              className={
                isOverBudget ? "border-red-200 bg-red-50 dark:bg-red-950" : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: budget.category.categoryColor }}
                    >
                      {budget.category.categoryIcon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {budget.budgetName}
                      </CardTitle>
                      <CardDescription>
                        {budget.category.categoryName}
                      </CardDescription>
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
                    <span>Spent: {formatCurrencyVND(budget.spent)}</span>
                    <span>Budget: {formatCurrencyVND(budget.totalAmount)}</span>
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
                    <p className="items-start space-x-1">
                      <span className="">Remaining:</span>
                      <span className="">
                        {formatCurrencyVND(
                          Math.max(budget.totalAmount - budget.spent, 0)
                        )}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(budget.startDate).toLocaleDateString()} -{" "}
                      {new Date(budget.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
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
                      onClick={() => handleDelete(budget.budgetId)}
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
