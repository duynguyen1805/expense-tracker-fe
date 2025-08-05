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
import { Target, AlertTriangle, Clock } from "lucide-react";
import { FinancialGoal } from "@/lib/types";
import { api } from "@/lib/api/client";
import Link from "next/link";

export default function GoalsSummary() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [upcomingGoals, setUpcomingGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
    loadUpcomingGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await api.goals.getAll();
      if (response.data.success) {
        setGoals(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUpcomingGoals = async () => {
    try {
      const response = await api.goals.getUpcoming(7);
      if (response.data.success) {
        setUpcomingGoals(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading upcoming goals:", error);
    }
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
    return "normal";
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "overdue":
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "urgent":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalGoals = goals.length;
  const urgentGoals = upcomingGoals.filter((goal) => {
    const urgency = getUrgencyLevel(goal);
    return (
      urgency === "critical" || urgency === "urgent" || urgency === "overdue"
    );
  }).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Financial Goals</CardTitle>
            <CardDescription>
              Track your financial objectives and deadlines
            </CardDescription>
          </div>
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalGoals}</div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {urgentGoals}
            </div>
            <div className="text-sm text-muted-foreground">Need Attention</div>
          </div>
        </div>

        {upcomingGoals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Upcoming Deadlines</h4>
            <div className="space-y-2">
              {upcomingGoals.slice(0, 3).map((goal) => {
                const urgency = getUrgencyLevel(goal);
                const urgencyIcon = getUrgencyIcon(urgency);
                const daysRemaining = getDaysRemaining(goal);

                return (
                  <div
                    key={goal.goalId}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-2">
                      {urgencyIcon}
                      <div>
                        <div className="text-sm font-medium">
                          {goal.goalName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          urgency === "overdue"
                            ? "text-red-600"
                            : urgency === "critical"
                              ? "text-red-500"
                              : "text-orange-500"
                        }`}
                      >
                        {Math.abs(daysRemaining)}{" "}
                        {daysRemaining < 0 ? "overdue" : "days"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/goals">View All Goals</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/goals">
              <Target className="mr-2 h-4 w-4" />
              Add Goal
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
