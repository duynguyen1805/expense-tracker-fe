'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Target, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { FinancialGoal } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Mock data - replace with API calls
    const mockGoals: FinancialGoal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 6500,
        targetDate: new Date('2024-12-31'),
        description: 'Save 6 months of living expenses',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Vacation Fund',
        targetAmount: 5000,
        currentAmount: 2000,
        targetDate: new Date('2024-06-30'),
        description: 'Save for summer vacation',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'New Car',
        targetAmount: 25000,
        currentAmount: 8000,
        targetDate: new Date('2025-03-31'),
        description: 'Down payment for a new car',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    setTimeout(() => {
      setGoals(mockGoals);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount || !currentAmount || !targetDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newGoal: FinancialGoal = {
      id: editingGoal?.id || Date.now().toString(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      targetDate: new Date(targetDate),
      description,
      userId: '1',
      createdAt: editingGoal?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingGoal) {
      setGoals(goals.map(goal => goal.id === editingGoal.id ? newGoal : goal));
      toast({
        title: 'Success',
        description: 'Goal updated successfully!',
      });
    } else {
      setGoals([...goals, newGoal]);
      toast({
        title: 'Success',
        description: 'Goal created successfully!',
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate.toISOString().split('T')[0]);
    setDescription(goal.description);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: 'Success',
      description: 'Goal deleted successfully!',
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setDescription('');
  };

  const getProgressPercentage = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (goal: FinancialGoal) => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (goal: FinancialGoal) => {
    const percentage = getProgressPercentage(goal);
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = (goal: FinancialGoal) => {
    const percentage = getProgressPercentage(goal);
    const daysRemaining = getDaysRemaining(goal);
    
    if (percentage >= 100) return 'Completed!';
    if (daysRemaining < 0) return 'Overdue';
    if (daysRemaining <= 30) return 'Due soon';
    return 'In progress';
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
          <p className="text-gray-600 dark:text-gray-400">Set and track your financial objectives</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Update your financial goal' : 'Set a new financial target'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter goal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="currentAmount">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    placeholder="Enter current amount"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                                  <Textarea
                    id="description"
                    placeholder="Enter goal description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    rows={3}
                  />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? 'Update' : 'Add'} Goal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal);
          const progressColor = getProgressColor(goal);
          const daysRemaining = getDaysRemaining(goal);
          const statusText = getStatusText(goal);

          return (
            <Card key={goal.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: ${goal.currentAmount.toLocaleString()}</span>
                    <span>Target: ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${progressColor}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progressPercentage.toFixed(1)}% complete</span>
                    <span className={daysRemaining < 0 ? 'text-red-500' : ''}>
                      {Math.abs(daysRemaining)} days {daysRemaining < 0 ? 'overdue' : 'remaining'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Remaining: ${(goal.targetAmount - goal.currentAmount).toLocaleString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      statusText === 'Completed!' ? 'bg-green-100 text-green-800' :
                      statusText === 'Overdue' ? 'bg-red-100 text-red-800' :
                      statusText === 'Due soon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {statusText}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
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
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-gray-500">No financial goals set yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first financial goal to start working towards your objectives
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 