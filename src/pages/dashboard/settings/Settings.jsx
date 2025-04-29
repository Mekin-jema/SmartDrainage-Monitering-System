"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings,
  AlertCircle,
  Bell,
  MapPin,
  Database,
  User,
  Shield,
  Mail
} from 'lucide-react';

const SettingsPage = () => {
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
  });

  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    density: 'normal',
    timezone: 'Africa/Addis_Ababa',
    language: 'en',
  });

  const handleSystemSettingChange = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAlertSettingChange = (field, value) => {
    setAlertSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleUserSettingChange = (field, value) => {
    setUserSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Settings className="w-8 h-8" />
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" /> System
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="w-4 h-4" /> User
          </TabsTrigger>
        </TabsList>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" /> General System Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={systemSettings.systemName}
                  onChange={(e) => handleSystemSettingChange('systemName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention (Days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  min="1"
                  max="365"
                  value={systemSettings.dataRetentionDays}
                  onChange={(e) => handleSystemSettingChange('dataRetentionDays', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="autoBackup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable regular system data backups
                  </p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(val) => handleSystemSettingChange('autoBackup', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable non-essential functions
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(val) => handleSystemSettingChange('maintenanceMode', val)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" /> Database Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <div className="flex gap-4">
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <Button
                      key={freq}
                      variant={systemSettings.backupFrequency === freq ? 'default' : 'outline'}
                      onClick={() => handleSystemSettingChange('backupFrequency', freq)}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Alert Settings Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Alert Thresholds
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="criticalThreshold">Critical Level Threshold (%)</Label>
                <Input
                  id="criticalThreshold"
                  type="number"
                  min="1"
                  max="100"
                  value={alertSettings.criticalThreshold}
                  onChange={(e) => handleAlertSettingChange('criticalThreshold', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warningThreshold">Warning Level Threshold (%)</Label>
                <Input
                  id="warningThreshold"
                  type="number"
                  min="1"
                  max="100"
                  value={alertSettings.warningThreshold}
                  onChange={(e) => handleAlertSettingChange('warningThreshold', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Manhole Alert Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="alertSound">Alert Sound</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when new alerts are received
                  </p>
                </div>
                <Switch
                  id="alertSound"
                  checked={alertSettings.alertSound}
                  onCheckedChange={(val) => handleAlertSettingChange('alertSound', val)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" /> Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={alertSettings.emailNotifications}
                  onCheckedChange={(val) => handleAlertSettingChange('emailNotifications', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive critical alerts via SMS
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={alertSettings.smsNotifications}
                  onCheckedChange={(val) => handleAlertSettingChange('smsNotifications', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts on mobile devices
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={alertSettings.pushNotifications}
                  onCheckedChange={(val) => handleAlertSettingChange('pushNotifications', val)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* User Settings Tab */}
        <TabsContent value="user" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Preferences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={userSettings.theme}
                  onChange={(e) => handleUserSettingChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={userSettings.timezone}
                  onChange={(e) => handleUserSettingChange('timezone', e.target.value)}
                >
                  <option value="Africa/Addis_Ababa">Addis Ababa (EAT)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">New York (EST)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={userSettings.language}
                  onChange={(e) => handleUserSettingChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="am">Amharic</option>
                  <option value="or">Oromo</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsPage;