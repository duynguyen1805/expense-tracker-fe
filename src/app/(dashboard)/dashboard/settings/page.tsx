"use client";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Palette, Database } from "lucide-react";
import { useTheme } from "@/lib/context/theme-context";
import { useCurrency } from "@/lib/context/currency-context";
import { api } from "@/lib/api/client";
import NotificationPreferencesComponent from "@/components/dashboard/notification-preferences";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    goalReminders: true,
  });
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  // 2FA states
  const [secret, setSecret] = useState("");
  const [otpAuthUrl, setOTPAuthUrl] = useState("");
  const [qr, setQr] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"init" | "verify" | "enabled" | "disable">(
    "init"
  );
  const [twoFAStatus, setTwoFAStatus] = useState({
    isTwoFactorAuthEnabled: user?.isTwoFactorAuthEnabled,
    timeActiveTwoFactorAuth: user?.timeActiveTwoFactorAuth,
  });

  // Fetch 2FA status on mount
  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const res = await api.auth.get2FAStatus();
        if (res.data.success) {
          setTwoFAStatus(res.data.data);
        }
      } catch (e) {}
    };
    fetch2FAStatus();
  }, []);

  // Generate 2FA secret and QR
  const handleGenerate2FA = async () => {
    setIsLoading(true);
    try {
      const res = await api.auth.generate2FA();
      if (res.data.success && res.data.data) {
        setSecret(res.data.data.secret);
        setOTPAuthUrl(res.data.data.otpauth_url);
        setQr(res.data.data.qr);
        setStep("verify");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enable 2FA
  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      const res = await api.auth.enable2FA({ code: otpCode });
      if (res.data.success) {
        toast({ title: "Success", description: "2FA enabled!" });
        setStep("enabled");
        // Refresh status
        const statusRes = await api.auth.get2FAStatus();
        if (statusRes.data.success) setTwoFAStatus(statusRes.data.data);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      const res = await api.auth.disable2FA({ code: otpCode, emailOtp });
      if (res.data.success) {
        toast({ title: "Success", description: "2FA disabled!" });
        setStep("init");
        setOtpCode("");
        setEmailOtp("");
        // Refresh status
        const statusRes = await api.auth.get2FAStatus();
        if (statusRes.data.success) setTwoFAStatus(statusRes.data.data);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP to email for disabling 2FA
  const handleSendDisableOtp = async () => {
    try {
      await api.auth.sendDisable2FAOtp();
      toast({ title: "OTP sent", description: "Check your email for the OTP" });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.firstName || ""}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user?.lastName || ""}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    placeholder="Enter your email"
                    disabled
                  />
                </div>
              </div>
              <Button>Update Profile</Button>
            </CardContent>
          </Card>

          {/* 2FA Card Start */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>
                Enhance your account security with 2FA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {twoFAStatus.isTwoFactorAuthEnabled ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA Status</p>
                      <p className="text-sm text-muted-foreground">
                        2FA is enabled on your account.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setStep("disable")}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      2FA has been active since:{" "}
                      {twoFAStatus.timeActiveTwoFactorAuth
                        ? new Date(
                            twoFAStatus.timeActiveTwoFactorAuth
                          ).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  {step === "disable" && (
                    <div className="space-y-4">
                      <Button
                        onClick={handleSendDisableOtp}
                        variant="secondary"
                        type="button"
                      >
                        Send OTP to Email
                      </Button>
                      <Input
                        placeholder="Enter OTP from Email"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                      />
                      <Input
                        placeholder="Enter OTP from Authenticator app"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                      <Button
                        onClick={handleDisable2FA}
                        disabled={isLoading}
                        type="button"
                      >
                        Confirm Disable 2FA
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA Status</p>
                      <p className="text-sm text-muted-foreground">
                        2FA is not enabled. Enable it for extra security.
                      </p>
                    </div>
                    <Button
                      onClick={handleGenerate2FA}
                      disabled={isLoading}
                      type="button"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                  {step === "verify" && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Scan the QR code below with your authenticator app or
                        enter the secret key manually.
                      </p>
                      {qr && (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={
                              qr.startsWith("data:image")
                                ? qr
                                : `data:image/png;base64,${qr.replace(/\s/g, "")}`
                            }
                            alt="2FA QR"
                          />
                          <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
                            <span className="font-mono text-xs break-all">
                              {secret}
                            </span>
                          </div>
                        </div>
                      )}
                      <Input
                        placeholder="Enter OTP from Authenticator app"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                      <Button
                        onClick={handleEnable2FA}
                        disabled={isLoading}
                        type="button"
                      >
                        Confirm & Enable 2FA
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          {/* 2FA Card End */}

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationPreferencesComponent />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="VND">VNĐ (₫)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download all your financial data
                  </p>
                </div>
                <Button variant="outline">Export</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all your financial records
                  </p>
                </div>
                <Button variant="outline">Clear Data</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your financial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Backup Data</p>
                  <p className="text-sm text-muted-foreground">
                    Create a backup of your data
                  </p>
                </div>
                <Button variant="outline">Backup</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Restore Data</p>
                  <p className="text-sm text-muted-foreground">
                    Restore from a previous backup
                  </p>
                </div>
                <Button variant="outline">Restore</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
