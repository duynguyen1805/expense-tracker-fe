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
import { TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { Income } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api/client";
import { listIncomeSourceName } from "@/lib/constants/incomeSourceList";
import { formatCurrencyVND } from "@/lib/utils";

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [totalIncome, setTotalIncomes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const { toast } = useToast();

  // Form state
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [customName, setCustomName] = useState("");
  const [typeSourceName, setTypeSourceNameIncome] = useState("");
  const [date, setDate] = useState("");

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load incomes
        const incomesResponse: any = await api.income.getAll();
        if (incomesResponse.data.success && incomesResponse.data.data) {
          setIncomes(incomesResponse.data.data.incomes);
          setTotalIncomes(incomesResponse.data.data.totalIncome);
        }
      } catch (error) {
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

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, ""); // chỉ lấy số
    setAmount(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !typeSourceName || !date) {
      toast({
        title: "Error",
        description: "Please fill in fields marked with *",
        variant: "destructive",
      });
      return;
    }

    try {
      const incomeData = {
        amount: parseFloat(amount),
        sourceName: typeSourceName,
        customName,
        description,
        date: date,
      };

      if (editingIncome) {
        // Update existing income
        const response = await api.income.update(
          editingIncome.incomeId,
          incomeData
        );
        if (response.data.success) {
          // setIncomes(
          //   incomes.map((income) =>
          //     income.incomeId === editingIncome.incomeId
          //       ? response.data.data.incomes
          //       : income
          //   )
          // );
          // setTotalIncomes(response.data.data.totalIncome);
          toast({
            title: "Success",
            description: "Income updated successfully!",
          });
        }
      } else {
        // Create new income
        const response = await api.income.create(incomeData);
        if (response.data.success) {
          // setIncomes([...incomes, response.data.data.incomes]);
          // setTotalIncomes(response.data.data.totalIncome);
          toast({
            title: "Success",
            description: "Income added successfully!",
          });
        }
      }

      // Reload incomes
      const getAllIncomes: any = await api.income.getAll();
      if (getAllIncomes.data.success && getAllIncomes.data.data) {
        setIncomes(getAllIncomes.data.data.incomes);
        setTotalIncomes(getAllIncomes.data.data.totalIncome);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving income:", error);
      toast({
        title: "Error",
        description: "Failed to save income",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setAmount(income.amount.toString());
    setDescription(income.description);
    setTypeSourceNameIncome(income.sourceName);
    setCustomName(income.customName);
    setDate(
      typeof income.date === "string"
        ? income.date.split("T")[0]
        : income.date.toISOString().split("T")[0]
    );
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.income.delete(id);
      if (response.data.success) {
        // setIncomes(incomes.filter((income) => income.incomeId !== id));
        // Reload incomes
        const getAllIncomes: any = await api.income.getAll();
        if (getAllIncomes.data.success && getAllIncomes.data.data) {
          setIncomes(getAllIncomes.data.data.incomes);
          setTotalIncomes(getAllIncomes.data.data.totalIncome);
        }
        toast({
          title: "Success",
          description: "Income deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast({
        title: "Error",
        description: "Failed to delete income",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingIncome(null);
    setAmount("");
    setDescription("");
    setTypeSourceNameIncome("");
    setCustomName("");
    setDate("");
  };

  // const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

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
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your income sources
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIncome ? "Edit Income" : "Add Income"}
              </DialogTitle>
              <DialogDescription>
                {editingIncome
                  ? "Update your income details"
                  : "Add a new income entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sourceName">
                  {
                    <div className="flex items-center py-[2px]">
                      <div className="">Source name </div>
                      <div className=" text-red-500 ml-1">*</div>
                    </div>
                  }
                </Label>
                <Select
                  value={typeSourceName}
                  onValueChange={setTypeSourceNameIncome}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {listIncomeSourceName.map((listIncome) => (
                      <SelectItem
                        key={listIncome.sourceName}
                        value={listIncome.sourceName}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{listIncome.icon}</span>
                          {listIncome.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {
                    <div className="flex items-center py-[2px]">
                      <div className="">Amount </div>
                      <div className=" text-red-500 ml-1">*</div>
                    </div>
                  }
                </Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  step="1"
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
                <Label htmlFor="customName">Custom name (optional)</Label>
                <Input
                  id="customName"
                  type="text"
                  placeholder="Salary from company X"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  // className="pl-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  // className="pl-10"
                  required
                />
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
                  {editingIncome ? "Update" : "Add"} Income
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
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrencyVND(totalIncome).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {incomes.length} income entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Income List */}
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
          <CardDescription>Your income entries</CardDescription>
        </CardHeader>
        <CardContent>
          {incomes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No income entries yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomes.map((income) => (
                <div
                  key={income.sourceName}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor: listIncomeSourceName.find(
                          (item) => item.sourceName === income.sourceName
                        )?.color,
                      }}
                    >
                      {
                        listIncomeSourceName.find(
                          (item) => item.sourceName === income.sourceName
                        )?.icon
                      }
                    </div>
                    <div>
                      <p className="font-medium">{income.description}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <span>{income.sourceName}</span>
                        {income?.customName && (
                          <span className="px-[2px]">
                            {" "}
                            - {income.customName} -{" "}
                          </span>
                        )}
                        <span>
                          {new Date(income.date).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-green-600">
                      +{formatCurrencyVND(income.amount)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(income)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(income.incomeId)}
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
