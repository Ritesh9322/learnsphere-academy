import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings, Globe, Bell, Shield, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'appearance'>('general');

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure your LMS platform preferences</p>
        </div>

        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {[
            { id: 'general', label: 'General', icon: Globe },
            { id: 'email', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Palette },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="font-display font-semibold text-foreground">General Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium">Platform Name</Label><Input defaultValue="LMS Academy" className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Support Email</Label><Input defaultValue="support@lmsacademy.com" className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Contact Phone</Label><Input defaultValue="+91 98765 43210" className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Currency</Label><Input defaultValue="INR (₹)" className="mt-1.5" /></div>
            </div>
            <div>
              <Label className="text-sm font-medium">Platform Description</Label>
              <textarea defaultValue="LMS Academy is a world-class learning management platform for coaching institutes." rows={3} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="font-medium text-foreground text-sm mb-3">Registration Settings</h3>
              <div className="space-y-3">
                {[
                  ['Allow Student Registration', true],
                  ['Require Email Verification', true],
                  ['Auto-approve Teachers', false],
                  ['Enable Social Login', false],
                ].map(([label, enabled]) => (
                  <div key={label as string} className="flex items-center justify-between py-2">
                    <span className="text-sm text-foreground">{label as string}</span>
                    <button className="w-10 h-5 rounded-full relative transition-colors" style={{ background: enabled ? 'var(--gradient-primary)' : 'hsl(var(--muted))' }}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => toast({ title: 'Settings saved!' })} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
              <Save className="w-4 h-4 mr-2" />Save Settings
            </Button>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="font-display font-semibold text-foreground">Notification Settings</h2>
            <div className="space-y-3">
              {[
                ['New User Registration', 'Email admin on new signups', true],
                ['Payment Received', 'Email admin on successful payments', true],
                ['Teacher Application', 'Notify when teachers apply', true],
                ['Course Published', 'Notify admin on course publication', false],
                ['System Alerts', 'Critical system notifications', true],
                ['Weekly Reports', 'Automated weekly analytics summary', false],
              ].map(([label, desc, enabled]) => (
                <div key={label as string} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-foreground text-sm">{label as string}</div>
                    <div className="text-xs text-muted-foreground">{desc as string}</div>
                  </div>
                  <button className="w-10 h-5 rounded-full relative transition-colors" style={{ background: enabled ? 'var(--gradient-primary)' : 'hsl(var(--muted))' }}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
            <Button onClick={() => toast({ title: 'Notification preferences saved!' })} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
              <Save className="w-4 h-4 mr-2" />Save Preferences
            </Button>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="font-display font-semibold text-foreground">Appearance Settings</h2>
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <div className="flex gap-3 mt-2">
                {['Light', 'Dark', 'System'].map(theme => (
                  <button key={theme} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${theme === 'Dark' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Primary Color</Label>
              <div className="flex gap-3 mt-2">
                {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                  <button key={color} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground/30 transition-all" style={{ background: color, boxShadow: color === '#3b82f6' ? '0 0 0 2px hsl(var(--foreground))' : 'none' }} />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Logo URL</Label>
              <Input defaultValue="/favicon.ico" className="mt-1.5" />
            </div>
            <Button onClick={() => toast({ title: 'Appearance settings saved!' })} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
              <Save className="w-4 h-4 mr-2" />Save Appearance
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
