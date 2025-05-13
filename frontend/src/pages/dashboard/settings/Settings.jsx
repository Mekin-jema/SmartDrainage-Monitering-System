

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Settings,
  AlertCircle,
  Bell,
  Database,
  User,
  Shield,
  Mail,
  Clock,
  Download,
  Upload,
  Key,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ToastAction } from '@/components/ui/toast';
// import { useToast } from '@/components/ui/use-toast';
// import { TimePicker } from '@/components/ui/time-picker';
import { Dialog } from '@/components/ui/dialog';



const SettingsPage = () => {
  // const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('system');
  const [systemSettings, setSystemSettings] = useState({
    systemName: 'Smart Sewage System',
    dataRetentionDays: 30,
    autoBackup: true,
    backupFrequency: 'weekly',
    maintenanceMode: false,
  });

  const [alertSettings, setAlertSettings] = useState({
    criticalThreshold: 90,
    warningThreshold: 70,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertSound: true,
    quietHours: { start: '22:00', end: '06:00' },
  });

  const [userSettings, setUserSettings] = useState({
    name: 'Admin User',
    email: 'admin@sewage.com',
    avatar: '',
    theme: 'light',
    timezone: 'Africa/Addis_Ababa',
    language: 'en',
    twoFactorAuth: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
    sessions: [
      { id: '1', device: 'Chrome on Windows', lastAccessed: '2 hours ago' },
      { id: '2', device: 'Safari on iPhone', lastAccessed: '1 week ago' },
    ],
  });

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserSettings(prev => ({ ...prev, avatar: e.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSave = async () => {
  //   try {
  //     // Simulated API call
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     toast({
  //       title: 'Settings saved successfully',
  //       description: 'Your changes have been applied',
  //     });
  //   } catch (error) {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Error saving settings',
  //       description: 'There was a problem saving your changes',
  //       action: <ToastAction altText="Try again">Try again</ToastAction>,
  //     });
  //   }
  // };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Settings className="w-8 h-8" />
          <h1 className="text-3xl font-bold">System Settings</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          {/* <Button onClick={handleSave}>Save Changes</Button> */}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> System
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" /> Data
          </TabsTrigger>
        </TabsList>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" /> General Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>System Name</Label>
                <Input
                  value={systemSettings.systemName}
                  onChange={(e) => setSystemSettings(prev => ({
                    ...prev,
                    systemName: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Retention (Days)</Label>
                <Slider
                  value={[systemSettings.dataRetentionDays]}
                  min={1}
                  max={365}
                  step={1}
                  onValueChange={([val]) => setSystemSettings(prev => ({
                    ...prev,
                    dataRetentionDays: val
                  }))}
                />
                <div className="text-sm text-muted-foreground">
                  {systemSettings.dataRetentionDays} days
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily system data backups
                  </p>
                </div>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(val) => setSystemSettings(prev => ({
                    ...prev,
                    autoBackup: val
                  }))}
                />
              </div>

              <Dialog
                title="Enable Maintenance Mode?"
                description="This will temporarily disable non-essential system functions."
                onConfirm={() => setSystemSettings(prev => ({
                  ...prev,
                  maintenanceMode: true
                }))}
              >
                <Button variant="destructive" className="w-full">
                  Enter Maintenance Mode
                </Button>
              </Dialog>
            </div>
          </div>
        </TabsContent>

        {/* Alert Settings Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Alert Thresholds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Critical Threshold ({alertSettings.criticalThreshold}%)</Label>
                <Slider
                  value={[alertSettings.criticalThreshold]}
                  min={50}
                  max={100}
                  step={5}
                  onValueChange={([val]) => setAlertSettings(prev => ({
                    ...prev,
                    criticalThreshold: val
                  }))}
                />
              </div>
              <div className="space-y-4">
                <Label>Warning Threshold ({alertSettings.warningThreshold}%)</Label>
                <Slider
                  value={[alertSettings.warningThreshold]}
                  min={30}
                  max={90}
                  step={5}
                  onValueChange={([val]) => setAlertSettings(prev => ({
                    ...prev,
                    warningThreshold: val
                  }))}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" /> Quiet Hours
              </h3>
              {/* <div className="flex items-center gap-4">
                <TimePicker
                  value={alertSettings.quietHours.start}
                  onChange={(val) => setAlertSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, start: val }
                  }))}
                />
                <span>to</span>
                <TimePicker
                  value={alertSettings.quietHours.end}
                  onChange={(val) => setAlertSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, end: val }
                  }))}
                />
              </div> */}
            </div>
          </div>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Key className="w-5 h-5" /> Authentication
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={userSettings.twoFactorAuth}
                  onCheckedChange={(val) => setUserSettings(prev => ({
                    ...prev,
                    twoFactorAuth: val
                  }))}
                />
              </div>
            </div>

            <Separator />

            <h3 className="text-lg font-semibold">Active Sessions</h3>
            <div className="space-y-2">
              {securitySettings.sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">{session.lastAccessed}</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <LogOut className="w-4 h-4 mr-2" /> Revoke
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* User Profile Tab */}
        <TabsContent value="user" className="space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" /> Profile Settings
            </h2>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userSettings.avatar} />
                <AvatarFallback>{userSettings.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button asChild variant="outline">
                    <span>Upload New Photo</span>
                  </Button>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG or GIF up to 5MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={userSettings.name}
                  onChange={(e) => setUserSettings(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="bg-card rounded-lg p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" /> Data Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <Download className="w-6 h-6" />
                  <div>
                    <Label>Export System Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Download a backup of all system data
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Export Data
                </Button>
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <Upload className="w-6 h-6" />
                  <div>
                    <Label>Import System Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Restore from a previous backup
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;