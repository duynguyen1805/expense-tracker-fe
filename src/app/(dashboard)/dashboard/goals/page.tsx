"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  FinancialGoal,
  CreateFinancialGoalRequest,
  UpdateFinancialGoalRequest,
} from "@/lib/types";
import { api } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";
import Notifications from "@/components/dashboard/notifications";

export default function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [upcomingGoals, setUpcomingGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  // Form state
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [autoDeduct, setAutoDeduct] = useState(false);

  const loadGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.goals.getAll();
      if (response.data.success) {
        setGoals(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
      toast({
        title: "Error",
        description: "Failed to load financial goals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUpcomingGoals = useCallback(async () => {
    try {
      const response = await api.goals.getUpcoming(30);
      if (response.data.success) {
        setUpcomingGoals(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading upcoming goals:", error);
    }
  }, []);

  useEffect(() => {
    loadGoals();
    loadUpcomingGoals();
  }, [goals, upcomingGoals, loadGoals, loadUpcomingGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalName || !targetAmount || !deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingGoal) {
        const updateData: UpdateFinancialGoalRequest = {
          goalName,
          targetAmount: parseFloat(targetAmount),
          deadline,
          autoDeduct,
        };

        const response = await api.goals.update(editingGoal.goalId, updateData);
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Goal updated successfully!",
          });
          loadGoals();
          loadUpcomingGoals();
        }
      } else {
        const createData: CreateFinancialGoalRequest = {
          goalName,
          targetAmount: parseFloat(targetAmount),
          deadline,
          autoDeduct,
        };

        const response = await api.goals.create(createData);
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Goal created successfully!",
          });
          loadGoals();
          loadUpcomingGoals();
        }
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving goal:", error);
      toast({
        title: "Error",
        description: "Failed to save goal",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.goalName);
    setTargetAmount(goal.targetAmount.toString());
    setDeadline(new Date(goal.deadline).toISOString().split("T")[0]);
    setAutoDeduct(goal.autoDeduct);
    setIsDialogOpen(true);
  };

  const handleDelete = async (goalId: number) => {
    try {
      const response = await api.goals.delete(goalId);
      if (response.data.success) {
        setGoals(goals.filter((goal) => goal.goalId !== goalId));
        setUpcomingGoals(
          upcomingGoals.filter((goal) => goal.goalId !== goalId)
        );
        toast({
          title: "Success",
          description: "Goal deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    setGoalName("");
    setTargetAmount("");
    setDeadline("");
    setAutoDeduct(false);
  };

  const getDaysRemaining = (goal: FinancialGoal) => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (goal: FinancialGoal) => {
    const daysRemaining = getDaysRemaining(goal);
    if (daysRemaining < 0) return "overdue";
    if (daysRemaining <= 1) return "critical";
    if (daysRemaining <= 7) return "urgent";
    if (daysRemaining <= 14) return "warning";
    return "normal";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "overdue":
        return "border-red-500 bg-red-50 dark:bg-red-950";
      case "critical":
        return "border-red-400 bg-red-50 dark:bg-red-950";
      case "urgent":
        return "border-orange-400 bg-orange-50 dark:bg-orange-950";
      case "warning":
        return "border-yellow-400 bg-yellow-50 dark:bg-yellow-950";
      default:
        return "";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "overdue":
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Target className="h-5 w-5 text-muted-foreground" />;
    }
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
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set and track your financial objectives
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            Notifications
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? "Edit Goal" : "Add Goal"}
                </DialogTitle>
                <DialogDescription>
                  {editingGoal
                    ? "Update your financial goal"
                    : "Set a new financial target"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    type="text"
                    placeholder="Enter goal name"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="Enter target amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoDeduct"
                    checked={autoDeduct}
                    onCheckedChange={setAutoDeduct}
                  />
                  <Label htmlFor="autoDeduct">Auto-deduct from income</Label>
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
                    {editingGoal ? "Update" : "Add"} Goal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notifications Section */}
      {showNotifications && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              Stay updated with your financial goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Notifications limit={10} showHeader={false} />
          </CardContent>
        </Card>
      )}

      {/* Upcoming Goals Section */}
      {upcomingGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingGoals.map((goal) => {
              const urgency = getUrgencyLevel(goal);
              const urgencyColor = getUrgencyColor(urgency);
              const urgencyIcon = getUrgencyIcon(urgency);
              const daysRemaining = getDaysRemaining(goal);

              return (
                <Card key={goal.goalId} className={`${urgencyColor}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {goal.goalName}
                        </CardTitle>
                        <CardDescription>
                          Target: ${goal.targetAmount.toLocaleString()}
                        </CardDescription>
                      </div>
                      {urgencyIcon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Days remaining:</span>
                        <span
                          className={`font-semibold ${
                            urgency === "overdue"
                              ? "text-red-600"
                              : urgency === "critical"
                                ? "text-red-500"
                                : urgency === "urgent"
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                          }`}
                        >
                          {Math.abs(daysRemaining)}{" "}
                          {daysRemaining < 0 ? "overdue" : "days"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                      {goal.autoDeduct && (
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Auto-deduct enabled
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Goals Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Financial Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const urgency = getUrgencyLevel(goal);
            const urgencyColor = getUrgencyColor(urgency);
            const urgencyIcon = getUrgencyIcon(urgency);
            const daysRemaining = getDaysRemaining(goal);

            return (
              <Card key={goal.goalId} className={`relative ${urgencyColor}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.goalName}</CardTitle>
                      <CardDescription>
                        Target: ${goal.targetAmount.toLocaleString()}
                      </CardDescription>
                    </div>
                    {urgencyIcon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Days remaining:</span>
                      <span
                        className={`font-semibold ${
                          urgency === "overdue"
                            ? "text-red-600"
                            : urgency === "critical"
                              ? "text-red-500"
                              : urgency === "urgent"
                                ? "text-orange-500"
                                : "text-yellow-500"
                        }`}
                      >
                        {Math.abs(daysRemaining)}{" "}
                        {daysRemaining < 0 ? "overdue" : "days"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                    {goal.autoDeduct && (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Auto-deduct enabled
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.goalId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-gray-500">No financial goals set yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first financial goal to start working towards your
              objectives
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
