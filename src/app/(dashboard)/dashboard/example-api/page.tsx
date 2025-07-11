'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api/client';

export default function ExampleApiPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<unknown>(null);
  const { toast } = useToast();

  // Ví dụ 1: Gọi API login
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await api.auth.login({ email, password });
      
      console.log('Login Response:', response);
      setApiResponse(response.data);
      
      toast({
        title: 'Success',
        description: 'API call successful!',
      });
    } catch (error) {
      console.error('Login Error:', error);
      toast({
        title: 'Error',
        description: 'API call failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ví dụ 2: Gọi API get categories
  const handleGetCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.categories.getAll();
      
      console.log('Categories Response:', response);
      setApiResponse(response.data);
      
      toast({
        title: 'Success',
        description: 'Categories loaded!',
      });
    } catch (error) {
      console.error('Categories Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ví dụ 3: Gọi API get incomes
  const handleGetIncomes = async () => {
    try {
      setIsLoading(true);
      const response = await api.income.getAll();
      
      console.log('Incomes Response:', response);
      setApiResponse(response.data);
      
      toast({
        title: 'Success',
        description: 'Incomes loaded!',
      });
    } catch (error) {
      console.error('Incomes Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load incomes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ví dụ 4: Gọi API dashboard stats
  const handleGetStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.dashboard.getStats();
      
      console.log('Stats Response:', response);
      setApiResponse(response.data);
      
      toast({
        title: 'Success',
        description: 'Dashboard stats loaded!',
      });
    } catch (error) {
      console.error('Stats Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stats',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Client Examples</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ví dụ cách sử dụng API client từ client.ts
        </p>
      </div>

      {/* Login Form */}
      <Card>
        <CardHeader>
          <CardTitle>1. Auth API Example</CardTitle>
          <CardDescription>Gọi API login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Calling...' : 'Call Login API'}
          </Button>
        </CardContent>
      </Card>

      {/* Other API Examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>2. Categories API</CardTitle>
            <CardDescription>Get all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetCategories} disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : 'Get Categories'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Incomes API</CardTitle>
            <CardDescription>Get all incomes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetIncomes} disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : 'Get Incomes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Dashboard API</CardTitle>
            <CardDescription>Get dashboard stats</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetStats} disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : 'Get Stats'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Response Display */}
      {apiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
            <CardDescription>Response from the last API call</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>Cách sử dụng API client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Import API client:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
{`import { api } from '@/lib/api/client';`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Gọi API với async/await:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
{`const response = await api.auth.login({ email, password });
console.log(response.data);`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Error handling:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
{`try {
  const response = await api.categories.getAll();
  // Handle success
} catch (error) {
  // Handle error
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Available API methods:</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
{`// Auth
api.auth.login(data)
api.auth.register(data)
api.auth.verifyOtp(data)

// Categories
api.categories.getAll()
api.categories.create(data)
api.categories.update(id, data)
api.categories.delete(id)

// Income
api.income.getAll()
api.income.create(data)
api.income.update(id, data)
api.income.delete(id)

// Expenses
api.expenses.getAll()
api.expenses.create(data)
api.expenses.update(id, data)
api.expenses.delete(id)

// Budgets
api.budgets.getAll()
api.budgets.create(data)
api.budgets.update(id, data)
api.budgets.delete(id)

// Goals
api.goals.getAll()
api.goals.create(data)
api.goals.update(id, data)
api.goals.delete(id)

// Dashboard
api.dashboard.getStats()`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 